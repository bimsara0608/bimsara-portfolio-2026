/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';
import { getCachedProfile, getCachedProjects, getCachedExperiences } from '@/lib/data';

// Allow streaming responses up to 30 seconds (Vercel maxDuration)
export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const [profile, projects, experiences] = await Promise.all([
      getCachedProfile(),
      getCachedProjects(),
      getCachedExperiences(),
    ]);

    // Construct a concise context string for the LLM
    const projectContext = projects
      .slice(0, 15) // Limit to top 15 to avoid overwhelming the prompt, though Gemini Flash has a large context window
      .map(
        (p) =>
          `- ${p.title} (${p.category}): ${p.description || 'No description provided.'} Tools: ${p.tools?.join(', ') || 'N/A'}`
      )
      .join('\n');

    const experienceContext = experiences
      .map((e) => `- ${e.title} at ${e.company} (${e.period}): ${e.desc}`)
      .join('\n');

    const systemPrompt = `You are a professional AI assistant integrated into the portfolio of ${profile?.name || 'Bimsara Gunawardana'}. 
Your goal is to answer questions from recruiters and visitors about Bimsara's experience, projects, and skills. 
You must base your answers ONLY on the provided context below. 
Be concise, helpful, and maintain a professional yet approachable tone. 
Do not hallucinate information. If the answer is not in the context, politely say you don't have that information but encourage the user to reach out to Bimsara directly via the contact form.

CONTEXT:
---
Bio: ${profile?.bio || 'Design Engineer'}
Experience:
${experienceContext}

Projects:
${projectContext}
---
End of context.`;

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing Groq API Key in environment variables.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Filter out empty messages that might be sent by old cached frontend bundles
    const coreMessages = messages
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))
      .filter((msg: any) => msg.content && msg.content.trim() !== '');

    // Gemini strictly requires the first message to be from a 'user'.
    // If the chat UI uses an initial assistant greeting, we must drop it.
    while (coreMessages.length > 0 && coreMessages[0].role !== 'user') {
      coreMessages.shift();
    }

    const result = await streamText({
      model: groq('qwen/qwen3.8-27b'),
      messages: coreMessages,
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred connecting to the AI.' }), {
      status: 500,
    });
  }
}
