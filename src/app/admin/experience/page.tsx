import { createClient } from '@/utils/supabase/server';
import type { Experience } from '@/lib/types';
import { ExperienceManager } from '@/components/admin/ExperienceManager';

export const revalidate = 0;

export default async function AdminExperiencePage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });

  return <ExperienceManager initialExperiences={(experiences as Experience[]) ?? []} />;
}
