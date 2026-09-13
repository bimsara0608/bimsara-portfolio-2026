import { createClient } from '@/utils/supabase/server';
import type { Certification } from '@/lib/types';
import { CertificationManager } from '@/components/admin/CertificationManager';

export const revalidate = 0;

export default async function AdminCertificationsPage() {
  const supabase = await createClient();
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true });

  return <CertificationManager initialCertifications={(certifications as Certification[]) ?? []} />;
}
