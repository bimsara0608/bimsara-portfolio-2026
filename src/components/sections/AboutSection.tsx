import Image from 'next/image';
import { Download, Award, Briefcase, GraduationCap, MapPin, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

interface AboutSectionProps {
  profile: Profile;
}

const EXPERIENCE = [
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
];

export function AboutSection({ profile }: AboutSectionProps) {
  const bio =
    profile?.bio ||
    'I specialize in transforming complex engineering challenges into elegant, manufacturable designs. With expertise in SolidWorks and Blender, I bridge the gap between technical precision and visual storytelling.';

  return (
    <section id="about" className="w-full py-24 md:py-32 px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Profile card */}
            <div className="lg:col-span-4">
              <div className="card overflow-hidden">
                {/* Photo */}
                <div className="w-full aspect-[4/5] relative bg-black/20">
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
                    <div className="w-full h-full flex items-center justify-center text-5xl text-muted-foreground opacity-20 select-none">
                      {profile?.name?.charAt(0) || 'B'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <div>
                    <p className="font-semibold text-base text-foreground">
                      {profile?.name || 'Bimsara Gunawardana'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {profile?.title || 'Design Engineer'}
                    </p>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={13} className="flex-shrink-0" />
                    <span>{profile?.location || 'Colombo, Sri Lanka'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={13} className="flex-shrink-0" />
                    <a
                      href={`mailto:${profile?.email || 'hello@bimsara.com'}`}
                      className="hover:text-foreground transition-colors break-all"
                    >
                      {profile?.email || 'hello@bimsara.com'}
                    </a>
                  </div>

                  {profile?.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full bg-foreground text-background font-medium py-2.5 rounded-[10px] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity text-sm"
                    >
                      <Download size={13} /> Download Resume
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Bio + experience */}
            <div className="lg:col-span-8">
              {/* Section label + heading */}
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white mb-6">
                About
              </span>
              <h2 className="text-fluid-h2 text-white mb-8 tracking-tight">
                Engineering <span className="text-muted-foreground">meets design.</span>
              </h2>

              {/* Bio paragraphs */}
              <div className="space-y-4 text-muted-foreground text-[15px] leading-relaxed mb-14">
                {bio
                  .split('\n')
                  .filter(Boolean)
                  .map((paragraph: string, i: number) => (
                    <p key={i} className={i === 0 ? 'text-base text-foreground' : ''}>
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Experience */}
              <h3 className="text-base font-semibold mb-6 flex items-center gap-2 text-foreground">
                <Briefcase size={16} className="text-muted-foreground" />
                Experience
              </h3>
              <div className="timeline-line space-y-5 mb-14">
                {EXPERIENCE.map((exp) => (
                  <div key={exp.title} className="relative">
                    <span className={`timeline-dot ${exp.active ? 'active' : ''}`} />
                    <div className="card p-5">
                      <h4 className="font-medium text-foreground text-sm">{exp.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {exp.company} · {exp.period}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education & Certs */}
              <h3 className="text-base font-semibold mb-6 flex items-center gap-2 text-foreground">
                <GraduationCap size={16} className="text-muted-foreground" />
                Education &amp; Certifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-6">
                  <Award size={20} className="text-muted-foreground mb-4" strokeWidth={1.5} />
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    Certified SolidWorks Professional (CSWP)
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1.5">Dassault Systèmes</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Advanced parametric modeling, complex assemblies.
                  </p>
                </div>
                <div className="card p-6">
                  <GraduationCap
                    size={20}
                    className="text-muted-foreground mb-4"
                    strokeWidth={1.5}
                  />
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    BSc Engineering (Hons)
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1.5">University of Moratuwa</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Mechanical Engineering &amp; Product Design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
