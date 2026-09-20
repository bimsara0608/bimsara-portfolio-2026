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

    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Extract just the model IDs for easy reading
    const availableModels = data.data ? data.data.map((m: { id: string }) => m.id) : data;

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      availableModels,
      fullResponse: data,
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
