// src/lib/embeddings.ts
// Utility for generating embeddings via Google's free API and
// performing semantic similarity search via Supabase pgvector.

import { createClient } from '@supabase/supabase-js';

export interface ContextChunk {
  content_type: string;
  content_text: string;
  similarity: number;
}

// Use a service-role-free public client for read-only similarity search
function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Generate a 768-dimensional embedding vector using Google's
 * text-embedding-004 model (free tier: 1,500 req/day).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_API_KEY;
  if (!apiKey) throw new Error('Missing GOOGLE_GENERATIVE_API_KEY');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-2',
        outputDimensionality: 768,
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Google Embedding API error: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return data.embedding.values as number[];
}

/**
 * Perform a semantic similarity search over the portfolio_embeddings table.
 * Returns the top `limit` most relevant content chunks.
 */
export async function searchSimilarContent(query: string, limit = 5): Promise<ContextChunk[]> {
  try {
    const embedding = await generateEmbedding(query);
    const supabase = getPublicSupabase();

    const { data, error } = await supabase.rpc('match_portfolio_content', {
      query_embedding: embedding,
      match_count: limit,
    });

    if (error) {
      console.error('pgvector search error:', error);
      return [];
    }

    return (data as ContextChunk[]) || [];
  } catch (err) {
    // Gracefully degrade — if embeddings fail, return empty (fallback
    // to static context in the chat route)
    console.error('searchSimilarContent failed, falling back:', err);
    return [];
  }
}
