import Image from 'next/image';
import { Download, Briefcase, GraduationCap, MapPin, Mail } from 'lucide-react';
import { type Profile, type Education, MOCK_EDUCATION } from '@/lib/types';

interface AboutSectionProps {
  profile: Profile;
  education?: Education[];
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
    title: 'Concept & 3D Designer',
    company: 'Lautus Robotics',
    period: 'Robotics & Automation',
    desc: 'Developed concept designs and 3D CAD models and participated in manufacturing and assembly of an AGV for the Civil Aviation Authority of Sri Lanka.',
    active: false,
  },
  {
    title: 'Co-Founder & Lead 3D Designer',
    company: 'VirtualPensar Pvt Ltd',
    period: 'Design & Visualization',
    desc: 'Led 3D design and prototyping, delivering 60+ engineering projects including functional prototypes and 3D-printable components.',
    active: false,
  },
];

export function AboutSection({ profile, education = MOCK_EDUCATION }: AboutSectionProps) {
  const educationItems = education && education.length > 0 ? education : MOCK_EDUCATION;

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
                  <h3 className="font-semibold text-base text-white tracking-tight">
                    {profile?.name || 'Bimsara Gunawardana'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">CSWP Certified Designer</p>
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
                ABOUT ME
              </span>
              <h2 className="text-fluid-h2 text-white mb-6 tracking-tight">
                Turning ideas into <span className="text-zinc-400">practical solutions.</span>
              </h2>

              <div className="p-6 md:p-7 rounded-2xl bg-[#111114] border border-white/[0.08] text-zinc-300 text-[15px] leading-relaxed space-y-3.5 shadow-lg">
                <p>
                  I’m <span className="text-white font-medium">Bimsara Gunawardana</span>, a{' '}
                  <span className="text-white font-medium">Design Engineer</span> focused on
                  mechanical design, manufacturing, automation, and product development. With a
                  background in{' '}
                  <span className="text-white font-medium">Engineering Technology</span>, I work
                  across CAD, robotics, embedded systems, and 3D printing to turn ideas into
                  practical solutions.
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

            {/* Education */}
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <GraduationCap size={16} className="text-zinc-400" />
                <h3 className="text-base font-semibold text-white tracking-tight">Education</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {educationItems.map((edu) => (
                  <div
                    key={edu.id}
                    className="card p-6 border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                          {edu.logo_url ? (
                            <Image
                              src={edu.logo_url}
                              alt={edu.institution}
                              width={40}
                              height={40}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <GraduationCap size={22} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-white text-base leading-snug tracking-tight">
                            {edu.institution}
                          </h4>
                          {edu.degree ? (
                            <p className="text-xs text-zinc-300 mt-1 leading-snug">
                              {edu.degree}
                              {edu.field_of_study ? `, ${edu.field_of_study}` : ''}
                            </p>
                          ) : edu.field_of_study ? (
                            <p className="text-xs text-zinc-300 mt-1 leading-snug">
                              {edu.field_of_study}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {edu.activities && (
                        <p className="text-xs text-zinc-400 leading-relaxed mt-2 pl-0.5">
                          {edu.activities}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed mt-2 pl-0.5">
                          {edu.description}
                        </p>
                      )}
                    </div>

                    {edu.period && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="text-emerald-400/90 font-medium">{edu.period}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
