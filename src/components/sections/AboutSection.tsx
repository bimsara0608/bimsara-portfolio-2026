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
    desc: 'Specializing in end-to-end product design, parametric SolidWorks CAD, mechanical assemblies, and photorealistic 3D visualization for international clients.',
    active: true,
  },
  {
    title: 'Autonomation Engineering Intern',
    company: 'MAS Bodyline / MAS Holdings',
    period: 'Process Innovation',
    desc: 'Engineering projects spanning Zig-Zag auto feeder development, PLC programming, HMI interface design, AGV troubleshooting, yarn break detection, PCB design, CAD modeling, and rapid physical prototyping.',
    active: false,
  },
  {
    title: 'Co-Founder & Design Engineer',
    company: 'Lautus Robotics',
    period: 'Robotics & Automation',
    desc: 'Robotics mechanical architecture, custom enclosure engineering, sensor mount integration, and autonomous system design.',
    active: false,
  },
  {
    title: '3D & CAD Specialist',
    company: 'VirtualPensar Pvt Ltd',
    period: 'Design & Visualization',
    desc: 'Parametric CAD modeling, engineering visualization, physical prototype design, and manufacturing asset preparation.',
    active: false,
  },
];

export function AboutSection({ profile }: AboutSectionProps) {
  const bio =
    profile?.bio ||
    'I’m a Design Engineer with an academic background in Instrumentation and Automation Technology from the University of Colombo. I operate at the intersection of parametric CAD, mechanical design, robotics, automation, and 3D visualization to transform engineering concepts into functional, manufacturable products.';

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
                      alt={profile?.name || 'Bimsara Gunawardana'}
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
                      href={`mailto:${profile?.email || 'bimsaragunawardana3d@gmail.com'}`}
                      className="hover:text-foreground transition-colors break-all"
                    >
                      {profile?.email || 'bimsaragunawardana3d@gmail.com'}
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
                Verified Experience
              </h3>
              <div className="timeline-line space-y-5 mb-14">
                {EXPERIENCE.map((exp) => (
                  <div key={exp.title} className="relative">
                    <span className={`timeline-dot ${exp.active ? 'active' : ''}`} />
                    <div className="card p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className="font-medium text-foreground text-sm">{exp.title}</h4>
                        <span className="text-xs font-mono text-muted-foreground">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{exp.company}</p>
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
                Education &amp; Certification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-6">
                  <Award size={20} className="text-muted-foreground mb-4" strokeWidth={1.5} />
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    Certified SOLIDWORKS Professional (CSWP)
                  </h4>
                  <p className="text-xs font-mono text-muted-foreground mb-1.5">
                    Dassault Systèmes
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Verified certification in advanced parametric modeling, complex multi-body
                    assemblies, and manufacturing validation.
                  </p>
                </div>
                <div className="card p-6">
                  <GraduationCap
                    size={20}
                    className="text-muted-foreground mb-4"
                    strokeWidth={1.5}
                  />
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    Bachelor of Engineering Technology (Honours)
                  </h4>
                  <p className="text-xs font-mono text-muted-foreground mb-1.5">
                    University of Colombo
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instrumentation and Automation Technology. Multidisciplinary engineering,
                    robotics, control systems, and automation.
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
