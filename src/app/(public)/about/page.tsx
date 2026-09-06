import Image from 'next/image';
import { Download, Award, Briefcase, GraduationCap, MapPin, Mail } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata = {
  title: 'About | Bimsara Gunawardana',
  description: 'Learn more about my journey as a Design Engineer.',
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').limit(1).single();

  const bio =
    profile?.bio ||
    'I specialize in transforming complex engineering challenges into elegant, manufacturable designs. With expertise in SolidWorks and Blender, I bridge the gap between technical precision and visual storytelling.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <ScrollReveal direction="up">
            <div className="glass-card overflow-hidden">
              <div className="w-full aspect-[4/5] relative bg-muted">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile?.name || 'Bimsara'}
                    fill
                    sizes="(max-width: 768px) 100vw, 35vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-muted-foreground opacity-30">
                    {profile?.name?.charAt(0) || 'B'}
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <p className="font-bold text-lg text-foreground">
                  {profile?.name || 'Bimsara Gunawardana'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.title || 'Design Engineer'}
                </p>
                <div className="h-px bg-border" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={15} />
                  <span>{profile?.location || 'Colombo, Sri Lanka'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={15} />
                  <a
                    href={`mailto:${profile?.email || 'hello@bimsara.com'}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {profile?.email || 'hello@bimsara.com'}
                  </a>
                </div>
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full bg-foreground text-background font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:opacity-80 transition-opacity text-sm"
                  >
                    <Download size={15} /> Download Resume
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8">
          <ScrollReveal direction="up" delay={100}>
            <div className="section-divider" />
            <h1 className="text-fluid-h2 font-bold mb-6">Engineering meets design.</h1>
            <div className="space-y-4 text-muted-foreground text-base leading-relaxed mb-14">
              {bio
                .split('\n')
                .filter(Boolean)
                .map((paragraph: string, i: number) => (
                  <p key={i} className={i === 0 ? 'text-lg text-foreground font-medium' : ''}>
                    {paragraph}
                  </p>
                ))}
            </div>
          </ScrollReveal>

          {/* Experience */}
          <ScrollReveal direction="up" delay={200}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5">
              <Briefcase size={20} className="text-muted-foreground" />
              Experience
            </h3>
            <div className="space-y-6 ml-2 pl-6 border-l-2 border-border relative mb-14">
              {[
                {
                  title: 'Design Engineer',
                  company: 'Freelance',
                  period: '2023 – Present',
                  desc: 'Specializing in product design, CAD modeling, and 3D visualization for clients worldwide.',
                  active: true,
                },
                {
                  title: 'Mechanical Engineering Intern',
                  company: 'Tech Corp',
                  period: '2022 – 2023',
                  desc: 'Assisted in design and prototyping of mechanical assemblies. Conducted FEA analysis.',
                  active: false,
                },
              ].map((exp) => (
                <div key={exp.title} className="relative">
                  <span
                    className={`absolute -left-[29px] top-1.5 w-3 h-3 rounded-full border-2 ${exp.active ? 'border-foreground bg-background' : 'border-border bg-muted'}`}
                  />
                  <div className="glass-card p-5">
                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {exp.company} · {exp.period}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Education & Certifications */}
          <ScrollReveal direction="up" delay={300}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5">
              <GraduationCap size={20} className="text-muted-foreground" />
              Education & Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-6">
                <Award size={22} className="text-foreground mb-4" />
                <h4 className="font-semibold text-foreground mb-1">
                  Certified SolidWorks Professional (CSWP)
                </h4>
                <p className="text-sm text-muted-foreground mb-2">Dassault Systèmes</p>
                <p className="text-sm text-muted-foreground">
                  Advanced parametric modeling, complex assemblies.
                </p>
              </div>
              <div className="glass-card p-6">
                <GraduationCap size={22} className="text-foreground mb-4" />
                <h4 className="font-semibold text-foreground mb-1">BSc Engineering (Hons)</h4>
                <p className="text-sm text-muted-foreground mb-2">University Name</p>
                <p className="text-sm text-muted-foreground">
                  Mechanical Engineering & Product Design.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
