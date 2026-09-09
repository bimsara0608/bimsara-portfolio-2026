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
  return (
    <section id="about" className="w-full py-24 md:py-32 px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Profile card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="card overflow-hidden border-white/[0.08] shadow-2xl">
              {/* Photo */}
              <div className="w-full aspect-[4/5] relative bg-zinc-950 overflow-hidden">
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
                  <div className="w-full h-full flex items-center justify-center text-5xl text-zinc-700 font-mono">
                    {profile?.name?.charAt(0) || 'B'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 space-y-4 bg-[#111114]">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base text-white tracking-tight">
                      {profile?.name || 'Bimsara Gunawardana'}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      CSWP
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">
                    {profile?.title || 'Design Engineer'}
                  </p>
                </div>

                <div className="h-px bg-white/[0.08]" />

                <div className="space-y-2.5 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={13} className="text-zinc-500 flex-shrink-0" />
                    <span>{profile?.location || 'Colombo, Sri Lanka'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={13} className="text-zinc-500 flex-shrink-0" />
                    <a
                      href={`mailto:${profile?.email || 'bimsaragunawardana3d@gmail.com'}`}
                      className="hover:text-white transition-colors truncate"
                    >
                      {profile?.email || 'bimsaragunawardana3d@gmail.com'}
                    </a>
                  </div>
                </div>

                <a
                  href={profile?.resume_url || '#contact'}
                  download={profile?.resume_url ? true : undefined}
                  target={profile?.resume_url ? '_blank' : undefined}
                  rel={profile?.resume_url ? 'noopener noreferrer' : undefined}
                  className="w-full bg-white text-black font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all text-xs font-mono tracking-wider uppercase shadow-sm"
                >
                  <Download size={13} /> Download Resume
                </a>
              </div>
            </div>
          </div>

          {/* Right: Bio + experience + education */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header & Bio Card */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium tracking-widest uppercase text-white/80 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                ABOUT BIMSARA
              </span>
              <h2 className="text-fluid-h2 text-white mb-6 tracking-tight">
                Engineering rigor meets <span className="text-zinc-400">industrial design.</span>
              </h2>

              <div className="p-6 md:p-7 rounded-2xl bg-[#111114] border border-white/[0.08] text-zinc-300 text-[15px] leading-relaxed space-y-3.5 shadow-lg">
                <p>
                  I’m a <span className="text-white font-medium">Design Engineer</span> with an
                  academic background in{' '}
                  <span className="text-white font-medium">
                    Instrumentation and Automation Technology
                  </span>{' '}
                  from the <span className="text-white font-medium">University of Colombo</span>.
                </p>
                <p className="text-zinc-400">
                  I operate at the intersection of parametric SolidWorks CAD modeling, kinematic
                  mechanism design, robotics automation, and photorealistic 3D
                  visualization—transforming abstract engineering specifications into robust,
                  manufacturing-ready products.
                </p>
              </div>
            </div>

            {/* Experience Timeline */}
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <Briefcase size={16} className="text-zinc-400" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Verified Experience
                </h3>
              </div>

              <div className="space-y-4">
                {EXPERIENCE.map((exp) => (
                  <div
                    key={exp.title}
                    className="card p-6 border-white/[0.08] hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-white text-base">{exp.title}</h4>
                        <p className="text-xs font-mono text-cyan-400/90 mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-400 self-start sm:self-auto">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mt-2">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Credentials */}
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <GraduationCap size={16} className="text-zinc-400" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Education &amp; Certification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-6 border-white/[0.08] hover:border-white/20">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Award size={20} />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">
                    Certified SOLIDWORKS Professional (CSWP)
                  </h4>
                  <p className="text-xs font-mono text-cyan-400/80 mb-2">Dassault Systèmes</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Verified international certification in advanced parametric modeling, complex
                    multi-body assemblies, and manufacturing validation.
                  </p>
                </div>

                <div className="card p-6 border-white/[0.08] hover:border-white/20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <GraduationCap size={20} />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">B.Eng.Tech (Honours)</h4>
                  <p className="text-xs font-mono text-emerald-400/80 mb-2">
                    University of Colombo · 2022 – Present
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Instrumentation and Automation Technology. Multidisciplinary engineering
                    spanning robotics, control systems, and CAD automation.
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
