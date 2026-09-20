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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'hi' }],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
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
