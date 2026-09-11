import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/utils/supabase/server';
import { FluidBackground } from '@/components/background/FluidBackground';
import { SmoothEntrance } from '@/components/layout/SmoothEntrance';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('resume_url').limit(1).single();

  return (
    <>
      <SmoothEntrance />
      <FluidBackground />
      <Navbar resumeUrl={profile?.resume_url} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
