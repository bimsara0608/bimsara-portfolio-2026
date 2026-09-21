// src/app/api/chat/route.ts
// Enterprise-grade AI chat route with:
//  1. RAG — semantic search over portfolio_embeddings (pgvector)
//  2. Lead Qualification — AI tool calling to capture client briefs

import { createGroq } from '@ai-sdk/groq';
import { streamText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getCachedProfile, getCachedProjects, getCachedExperiences } from '@/lib/data';
import { searchSimilarContent } from '@/lib/embeddings';

// Allow streaming responses up to 60 seconds (Vercel maxDuration)
export const maxDuration = 60;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch base profile info (lightweight, always needed)
    const profile = await getCachedProfile();
    const ownerName = profile?.name || 'Bimsara Gunawardana';

    // ── RAG: Semantic Search ────────────────────────────────────────────────
    // Extract the last user message to use as the semantic search query
    const lastUserMessage = [...messages]
      .reverse()
      .find((m: { role: string }) => m.role === 'user');

    const userQuery = (lastUserMessage?.content as string) || '';

    // Run RAG search and fall back to static context if pgvector isn't ready
    const ragChunks = await searchSimilarContent(userQuery, 5);

    let portfolioContext: string;

    if (ragChunks.length > 0) {
      // RAG mode: only inject the most relevant chunks
      portfolioContext = ragChunks
        .map((c) => `[${c.content_type.toUpperCase()}]\n${c.content_text}`)
        .join('\n\n---\n\n');
    } else {
      // Fallback mode: inject limited static context (for first-run before seeding)
      const [projects, experiences] = await Promise.all([
        getCachedProjects(),
        getCachedExperiences(),
      ]);

      const projectContext = projects
        .slice(0, 10)
        .map(
          (p) =>
            `Project: ${p.title} (${p.category}): ${p.description || ''} Tools: ${p.tools?.join(', ') || 'N/A'}`
        )
        .join('\n');

      const experienceContext = experiences
        .map((e) => `Experience: ${e.title} at ${e.company} (${e.period}): ${e.desc}`)
        .join('\n');

      portfolioContext = `${experienceContext}\n\n${projectContext}`;
    }

    // ── System Prompt ───────────────────────────────────────────────────────
    const systemPrompt = `You are an expert AI sales assistant and portfolio representative for ${ownerName}, a CSWP-certified CAD Design Engineer specializing in mechanical design, SolidWorks, autonomous robotics, and 3D visualization.

## YOUR TWO ROLES

### Role 1: Portfolio Expert
Answer questions about ${ownerName}'s work using ONLY the portfolio context below.
- Be specific — mention real project names, tools, technologies.
- If something is not in the context, say you don't have that info and invite them to contact ${ownerName} via the contact form.
- Never hallucinate. Never make up projects or credentials.

### Role 2: Client Qualification Agent
When a visitor indicates they have a project, need CAD/design work, or are looking to hire — activate the qualification flow:
1. Warmly acknowledge their need
2. Ask what type of project/product they are designing
3. Ask about manufacturing method (3D printing, CNC, injection molding, sheet metal, etc.)
4. Ask if they have sketches, references, or existing CAD files
5. Ask about timeline and approximate budget range
6. ONLY once you have explicitly gathered their REAL name, REAL email, and project type — call the submit_lead tool to save their brief. NEVER use placeholders like "[Client Name]". If they haven't provided their name or email, ASK them for it before calling the tool.
7. After submitting, tell them: "${ownerName} will review your project brief and get back to you within 24–48 hours!"

## TONE
Professional, knowledgeable, helpful. Slightly enthusiastic about engineering and design challenges.
CRITICAL INSTRUCTION: ALWAYS reply in very short, concise sentences. Keep your responses under 2-3 sentences whenever possible. Never output long blocks of text.

## PORTFOLIO CONTEXT
(Semantic search returned these as most relevant to the user's current question)
---
${portfolioContext}
---
End of context.`;

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing Groq API Key in environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    // Clean and validate message history
    const coreMessages = messages
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((msg: any) => ({ role: msg.role, content: msg.content }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((msg: any) => msg.content && (msg.content as string).trim() !== '');

    // Strip any leading non-user messages (some models require user-first)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    while (coreMessages.length > 0 && (coreMessages[0] as any).role !== 'user') {
      coreMessages.shift();
    }

    // ── Tool: submit_lead ───────────────────────────────────────────────────
    const submitLead = tool({
      description:
        "Call this tool when you have gathered enough information from a potential client to create a project brief. This saves the lead directly into the portfolio owner's database so they can follow up.",
      inputSchema: z.object({
        name: z.string().describe('Full name of the potential client'),
        email: z.string().describe('Email address of the potential client'),
        project_type: z
          .string()
          .describe(
            'Type of project or product they need designed (e.g. "Drone chassis", "Injection-molded enclosure")'
          ),
        manufacturing_method: z
          .string()
          .optional()
          .describe(
            'Intended manufacturing method: 3D printing, CNC machining, injection molding, sheet metal, etc.'
          ),
        has_sketches: z
          .boolean()
          .optional()
          .describe('Whether the client already has sketches, references, or existing CAD files'),
        timeline: z
          .string()
          .optional()
          .describe('Project timeline or deadline, e.g. "2 weeks", "End of October"'),
        budget_range: z
          .string()
          .optional()
          .describe('Approximate budget range, e.g. "$200–$500", "Under $1000"'),
        additional_notes: z
          .string()
          .optional()
          .describe('Any other relevant details mentioned by the client'),
      }),
      execute: async (leadData: {
        name: string;
        email: string;
        project_type: string;
        manufacturing_method?: string;
        has_sketches?: boolean;
        timeline?: string;
        budget_range?: string;
        additional_notes?: string;
      }) => {
        try {
          const supabase = getSupabaseClient();

          const subject = `[AI Lead] ${leadData.project_type}`;
          const message = [
            `Project Type: ${leadData.project_type}`,
            leadData.manufacturing_method ? `Manufacturing: ${leadData.manufacturing_method}` : '',
            leadData.has_sketches !== undefined
              ? `Has Sketches: ${leadData.has_sketches ? 'Yes' : 'No'}`
              : '',
            leadData.timeline ? `Timeline: ${leadData.timeline}` : '',
            leadData.budget_range ? `Budget: ${leadData.budget_range}` : '',
            leadData.additional_notes ? `Notes: ${leadData.additional_notes}` : '',
          ]
            .filter(Boolean)
            .join('\n');

          const { error } = await supabase.from('contact_messages').insert({
            name: leadData.name,
            email: leadData.email,
            subject,
            message,
            is_read: false,
          });

          if (error) {
            console.error('Failed to save lead:', error);
            return {
              success: false,
              message: 'There was an issue saving your brief. Please try again.',
            };
          }

          return {
            success: true,
            message: `Lead saved successfully for ${leadData.name}. ${ownerName} will be notified.`,
          };
        } catch (err) {
          console.error('submit_lead error:', err);
          return {
            success: false,
            message: 'An error occurred while saving your project brief.',
          };
        }
      },
    });

    // ── Stream ──────────────────────────────────────────────────────────────
    const result = await streamText({
      model: groq('openai/gpt-oss-20b'),
      messages: coreMessages,
      system: systemPrompt,
      tools: { submit_lead: submitLead },
      // Allow up to 3 steps: user msg → tool call → tool result → final reply
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Chat API Error:', err);
    return new Response(JSON.stringify({ error: 'An error occurred connecting to the AI.' }), {
      status: 500,
    });
  }
}
