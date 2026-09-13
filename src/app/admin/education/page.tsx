import { createClient } from '@/utils/supabase/server';
import type { Education } from '@/lib/types';
import { EducationManager } from '@/components/admin/EducationManager';

export const revalidate = 0;

export default async function AdminEducationPage() {
  const supabase = await createClient();
  const { data: education } = await supabase
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true });

  return <EducationManager initialEducation={(education as Education[]) ?? []} />;
}
