import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'No GROQ_API_KEY found in environment variables.' },
        { status: 400 }
      );
    }

    // Simulate the exact failing conversation
    const messages = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'Hello! I am an AI assistant for Bimsara. How can I help?' },
      { role: 'user', content: 'how can i contact him?' },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: messages,
      }),
    });

    const data = await response.json();

    // Extract rate limit headers specifically
    const rateLimits: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      if (key.toLowerCase().includes('ratelimit')) {
        rateLimits[key] = value;
      }
    });

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      rateLimits,
      data,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: err.message || 'Unknown network error',
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}
