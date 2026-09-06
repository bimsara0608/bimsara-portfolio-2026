import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Award, Briefcase, GraduationCap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "About | Bimsara Gunawardana",
  description: "Learn more about my journey as a Design Engineer.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").limit(1).single();

  const bio = profile?.bio || "I specialize in transforming complex engineering challenges into elegant, manufacturable designs. With expertise in SolidWorks and Blender, I bridge the gap between technical precision and visual storytelling.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Image & Quick Info */}
        <div className="lg:col-span-5 space-y-8">
          <ScrollReveal direction="up">
            <div className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile?.name || "Bimsara"}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                  {profile?.name?.charAt(0) || "B"}
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <div className="card p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted">
                <MapPinIcon />
                <span className="font-medium">{profile?.location || "Colombo, Sri Lanka"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <MailIcon />
                <a href={`mailto:${profile?.email}`} className="font-medium hover:text-accent dark:hover:text-white transition-colors">
                  {profile?.email || "hello@bimsara.com"}
                </a>
              </div>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full bg-accent dark:bg-white text-white dark:text-accent font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Download size={18} /> Download Resume
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" delay={100}>
            <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 About Me</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
              Engineering meets design.
            </h1>
            
            <div className="prose prose-lg dark:prose-invert prose-gray max-w-none text-muted mb-16">
              <p className="lead text-2xl font-medium text-foreground dark:text-gray-200 leading-relaxed mb-6">
                {bio.split('\n')[0]}
              </p>
              {bio.split('\n').slice(1).map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </ScrollReveal>

          {/* Timeline / Experience */}
          <ScrollReveal direction="up" delay={300}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="text-muted" /> Experience
            </h3>
            <div className="space-y-8 border-l-2 border-gray-200 dark:border-gray-800 ml-3 pl-8 relative">
              <div className="relative">
                <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white dark:bg-black border-4 border-accent dark:border-white" />
                <h4 className="text-lg font-bold">Design Engineer</h4>
                <p className="text-muted mb-2">Freelance · 2023 – Present</p>
                <p className="text-gray-600 dark:text-gray-400">Specializing in product design, CAD modeling, and 3D visualization for clients worldwide. Developed robust parametric models and created photorealistic renders for marketing materials.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white dark:bg-black border-4 border-gray-300 dark:border-gray-700" />
                <h4 className="text-lg font-bold">Mechanical Engineering Intern</h4>
                <p className="text-muted mb-2">Tech Corp · 2022 – 2023</p>
                <p className="text-gray-600 dark:text-gray-400">Assisted in the design and prototyping of mechanical assemblies. Conducted finite element analysis (FEA) to validate structural integrity before manufacturing.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Education & Certifications */}
          <ScrollReveal direction="up" delay={400} className="mt-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="text-muted" /> Education & Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <Award className="text-accent dark:text-white mb-4" size={24} />
                <h4 className="font-bold mb-1">Certified SolidWorks Professional (CSWP)</h4>
                <p className="text-sm text-muted mb-3">Dassault Systèmes</p>
                <p className="text-sm text-gray-500">Advanced mechanical design, parametric modeling, and complex assemblies.</p>
              </div>
              <div className="card p-6">
                <GraduationCap className="text-accent dark:text-white mb-4" size={24} />
                <h4 className="font-bold mb-1">BSc Engineering (Hons)</h4>
                <p className="text-sm text-muted mb-3">University Name</p>
                <p className="text-sm text-gray-500">Specialization in Mechanical Engineering and Product Design.</p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );
}
