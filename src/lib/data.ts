import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { Profile, Project, Education, Experience, Certification } from '@/lib/types';

// Anonymous public client for cached server queries (no cookies/session overhead)
function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export const getCachedProfile = unstable_cache(
  async (): Promise<Profile | null> => {
    const supabase = getPublicSupabase();
    const { data } = await supabase.from('profiles').select('*').limit(1).single();
    return (data as Profile) || null;
  },
  ['profile-data'],
  { revalidate: 3600, tags: ['profile'] }
);

export const getCachedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('date', { ascending: false });
    return (data as Project[]) || [];
  },
  ['projects-data'],
  { revalidate: 3600, tags: ['projects'] }
);

export const getCachedEducation = unstable_cache(
  async (): Promise<Education[]> => {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    return (data as Education[]) || [];
  },
  ['education-data'],
  { revalidate: 3600, tags: ['education'] }
);

export const getCachedExperiences = unstable_cache(
  async (): Promise<Experience[]> => {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    return (data as Experience[]) || [];
  },
  ['experiences-data'],
  { revalidate: 3600, tags: ['experiences'] }
);

export const getCachedCertifications = unstable_cache(
  async (): Promise<Certification[]> => {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    return (data as Certification[]) || [];
  },
  ['certifications-data'],
  { revalidate: 3600, tags: ['certifications'] }
);

export const getCachedProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    return (data as Project) || null;
  },
  ['project-by-slug'],
  { revalidate: 3600, tags: ['projects'] }
);
