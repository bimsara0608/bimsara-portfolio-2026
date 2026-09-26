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

    const userQuery = (() => {
      if (!lastUserMessage) return '';
      // content is a string in most cases; fall back to parts for { text } format
      if (typeof lastUserMessage.content === 'string' && lastUserMessage.content.trim()) {
        return lastUserMessage.content as string;
      }
      // AI SDK v7 { text } format stores content in parts
      const parts = (lastUserMessage as any).parts || [];
      const textPart = parts.find((p: any) => p.type === 'text');
      return textPart?.text || '';
    })();

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
    const systemPrompt = `You are a friendly AI assistant representing ${ownerName}, a CSWP-certified CAD Design Engineer (SolidWorks, robotics, 3D visualization).

You have TWO modes:

**MODE 1 — Portfolio Q&A**
Answer questions about ${ownerName}'s projects, skills, and experience using only the portfolio context below. Be concise and specific.

**MODE 2 — Client Qualification**
Activate ONLY when the user clearly wants to hire or get design work done.

Collect these details ONE AT A TIME in order. Check the conversation history before each question — skip any field the user already answered:
1. Project type (what they need designed)
2. Manufacturing method (3D print / CNC / injection mold / etc.)
3. Do they have sketches or references?
4. Timeline
5. Budget
6. Their name
7. Their email

Once you have name + email + project type, call submit_lead ONCE. Never call it more than once.
After calling submit_lead, say: "${ownerName} will review your brief and get back to you within 24–48 hours!" Then stop collecting info.

**ABSOLUTE RULES**
- Ask only ONE question per reply — never ask two things at once.
- Before asking ANYTHING, read the conversation history above carefully. If the user already answered a question, SKIP IT. Do NOT re-ask it.
- A user saying "ok", "thanks", "sounds good", or "sure" is a conversational acknowledgement, NOT a prompt to ask another question.
- Never call submit_lead more than once. If a tool result exists in the history, the lead is already saved.
- Keep every reply under 2–3 short sentences.

**PORTFOLIO CONTEXT** (most relevant chunks for this query):
---
${portfolioContext}
---`;

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing Groq API Key in environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    // Clean and validate message history — preserve tool invocations so the AI
    // knows what it has already asked and submitted in this conversation.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coreMessages = messages.reduce((acc: any[], msg: any) => {
      // Always keep user messages that have content
      if (msg.role === 'user') {
        // Extract content from either the string field or the parts array
        let content = (msg.content as string) || '';
        if (!content.trim()) {
          // AI SDK v7 { text } format stores content in parts
          const parts = (msg.parts || []) as any[];
          const textPart = parts.find((p: any) => p.type === 'text');
          content = textPart?.text || '';
        }
        if (content.trim() !== '') {
          acc.push({ role: 'user', content });
        }
        return acc;
      }

      // For assistant messages, build a summary string that includes any tool calls made
      if (msg.role === 'assistant') {
        const textContent = (msg.content as string) || '';
        // Extract any tool invocations from the parts array (they show as empty content)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toolParts = (msg.parts || []).filter((p: any) => p.type === 'tool-invocation');
        if (toolParts.length > 0) {
          // Build a combined content string so the model knows the tool was already called
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const toolSummary = toolParts.map((p: any) => {
            const args = JSON.stringify(p.toolInvocation?.input || p.args || {});
            const result = JSON.stringify(p.toolInvocation?.output || p.result || {});
            return `[Tool: ${p.toolName} | Args: ${args} | Result: ${result}]`;
          }).join(' ');
          acc.push({ role: 'assistant', content: [textContent, toolSummary].filter(Boolean).join('\n') });
        } else if (textContent.trim() !== '') {
          acc.push({ role: 'assistant', content: textContent });
        }
        return acc;
      }

      return acc;
    }, []);

    // Strip any leading non-user messages (Groq requires user-first)
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

          // ── Idempotency guard ──────────────────────────────────────────────
          // Check if a lead from the same email was already submitted within
          // the last 10 minutes to prevent duplicate inserts caused by the
          // AI re-triggering the tool on short follow-up messages.
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
          const { data: existing } = await supabase
            .from('contact_messages')
            .select('id')
            .eq('email', leadData.email.toLowerCase().trim())
            .gte('created_at', tenMinutesAgo)
            .limit(1);

          if (existing && existing.length > 0) {
            // Already submitted recently — return success without a second insert
            return {
              success: true,
              message: `Brief for ${leadData.name} was already received. ${ownerName} will be in touch within 24–48 hours!`,
            };
          }

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
            email: leadData.email.toLowerCase().trim(),
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
      model: groq('llama-3.3-70b-versatile'),
      messages: coreMessages,
      system: systemPrompt,
      tools: { submit_lead: submitLead },
      // 5 steps max: user msg → (optional follow-ups) → tool call → tool result → final reply
      // We do NOT use stepCountIs(1) as that breaks tool → result → reply sequences
      stopWhen: stepCountIs(5),
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
