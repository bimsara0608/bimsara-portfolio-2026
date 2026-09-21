// src/app/api/seed-embeddings/route.ts
// One-time (and re-runnable) endpoint to generate and store embeddings
// for all published projects and experiences.
// Protected by SEED_SECRET env var.
//
// Usage: GET /api/seed-embeddings?secret=<SEED_SECRET>

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '@/lib/embeddings';
import { getCachedProjects, getCachedExperiences } from '@/lib/data';
import type { Project, Experience } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function getServiceSupabase() {
  // Use service-role key if available, otherwise fall back to anon key
  // (anon key has INSERT access on portfolio_embeddings if RLS allows it)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

function buildProjectText(p: Project): string {
  return [
    `Project: ${p.title}`,
    `Category: ${p.category}`,
    p.description ? `Description: ${p.description}` : '',
    p.challenge ? `Challenge: ${p.challenge}` : '',
    p.solution ? `Solution: ${p.solution}` : '',
    p.tools?.length ? `Tools & Technologies: ${p.tools.join(', ')}` : '',
    p.timeline ? `Timeline: ${p.timeline}` : '',
    p.client ? `Client: ${p.client}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildExperienceText(e: Experience): string {
  return [
    `Experience: ${e.title} at ${e.company}`,
    e.period ? `Period: ${e.period}` : '',
    e.desc ? `Details: ${e.desc}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const results = { projects: 0, experiences: 0, errors: 0 };

  try {
    const [projects, experiences] = await Promise.all([
      getCachedProjects(),
      getCachedExperiences(),
    ]);

    // --- Seed projects ---
    for (const project of projects) {
      try {
        const text = buildProjectText(project);
        const embedding = await generateEmbedding(text);

        await supabase.from('portfolio_embeddings').upsert(
          {
            content_type: 'project',
            content_id: project.id,
            content_text: text,
            embedding,
          },
          { onConflict: 'content_id' }
        );

        results.projects++;
      } catch (err) {
        console.error(`Failed to embed project ${project.id}:`, err);
        results.errors++;
      }
    }

    // --- Seed experiences ---
    for (const experience of experiences) {
      try {
        const text = buildExperienceText(experience);
        const embedding = await generateEmbedding(text);

        await supabase.from('portfolio_embeddings').upsert(
          {
            content_type: 'experience',
            content_id: experience.id,
            content_text: text,
            embedding,
          },
          { onConflict: 'content_id' }
        );

        results.experiences++;
      } catch (err) {
        console.error(`Failed to embed experience ${experience.id}:`, err);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      seeded: results.projects + results.experiences,
      breakdown: results,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
