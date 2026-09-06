import Link from "next/link";
import { ArrowRight, PenTool, Cpu, Printer, Video, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "Services | Bimsara Gunawardana",
  description: "Product design, CAD modeling, and 3D visualization services.",
};

const SERVICES = [
  {
    title: "Product Design & CAD",
    icon: PenTool,
    description: "End-to-end product design focusing on manufacturability and aesthetics. From concept sketches to production-ready SolidWorks models.",
    features: ["Parametric 3D Modeling", "Sheet Metal Design", "Plastic Injection Molding Design", "Technical Drawings"],
  },
  {
    title: "Mechanical Engineering",
    icon: Cpu,
    description: "Rigorous engineering analysis to ensure your product works in the real world. Structural integrity and mechanical movement simulation.",
    features: ["Finite Element Analysis (FEA)", "Motion Studies", "Tolerance Stack-up", "Material Selection"],
  },
  {
    title: "3D Visualization & Animation",
    icon: Video,
    description: "Photorealistic rendering and product animation using Blender to create stunning marketing materials before a physical prototype exists.",
    features: ["Product Renders", "Exploded View Animations", "Assembly Instructions", "Lighting & Texturing"],
  },
  {
    title: "Prototyping & 3D Printing",
    icon: Printer,
    description: "Optimization of designs for additive manufacturing. Slicing, print-in-place mechanisms, and physical prototyping advice.",
    features: ["FDM / SLA Optimization", "Support Structure Design", "Rapid Prototyping", "DFM (Design for Mfg)"],
  },
];

const PROCESS = [
  { step: "01", title: "Discovery", desc: "We discuss your vision, requirements, and constraints." },
  { step: "02", title: "Concept", desc: "Initial sketches and block models for feedback." },
  { step: "03", title: "Engineering", desc: "Detailed CAD modeling and mechanical analysis." },
  { step: "04", title: "Delivery", desc: "Final source files, technical drawings, and renders." },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      {/* Header */}
      <div className="mb-24 text-center max-w-3xl mx-auto">
        <ScrollReveal direction="up">
          <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/03 Services</h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">What I Do</h1>
          <p className="text-xl text-muted leading-relaxed">
            I help startups and established companies turn ideas into physical products through expert engineering and design.
          </p>
        </ScrollReveal>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        {SERVICES.map((service, idx) => (
          <ScrollReveal key={service.title} direction="up" delay={idx * 150}>
            <div className="card p-8 md:p-10 h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <service.icon size={40} className="text-accent dark:text-white mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted mb-8 flex-1">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Process */}
      <div className="mb-32">
        <ScrollReveal direction="up">
          <h2 className="text-3xl font-bold mb-12 text-center">My Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-6 left-0 w-full h-[2px] bg-gray-100 dark:bg-gray-800 -z-10" />
            {PROCESS.map((p, idx) => (
              <div key={p.step} className="relative pt-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-accent dark:text-white rounded-full flex items-center justify-center font-black mb-6 border-4 border-white dark:border-black mx-auto md:mx-0">
                  {p.step}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* CTA */}
      <ScrollReveal direction="up">
        <div className="card bg-accent dark:bg-gray-900 text-white p-12 md:p-20 text-center border-0">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Have a project in mind?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
            Whether you need a quick 3D render or a complete mechanical design from scratch, I&apos;m ready to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-accent px-8 py-4 font-bold text-lg rounded-full hover:scale-105 transition-transform"
          >
            Start a Conversation <ArrowRight size={20} />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
