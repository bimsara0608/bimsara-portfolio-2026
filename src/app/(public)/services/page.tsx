import Link from 'next/link';
import { ArrowRight, PenTool, Cpu, Printer, Video, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata = {
  title: 'Services | Bimsara Gunawardana',
  description: 'Product design, CAD modeling, and 3D visualization services.',
};

const SERVICES = [
  {
    title: 'Product Design & CAD',
    icon: PenTool,
    description:
      'End-to-end product design focusing on manufacturability and aesthetics. From concept sketches to production-ready SolidWorks models.',
    features: [
      'Parametric 3D Modeling',
      'Sheet Metal Design',
      'Plastic Injection Molding Design',
      'Technical Drawings',
    ],
  },
  {
    title: 'Mechanical Engineering',
    icon: Cpu,
    description:
      'Rigorous engineering analysis to ensure your product works in the real world. Structural integrity and mechanical movement simulation.',
    features: [
      'Finite Element Analysis (FEA)',
      'Motion Studies',
      'Tolerance Stack-up',
      'Material Selection',
    ],
  },
  {
    title: '3D Visualization & Animation',
    icon: Video,
    description:
      'Photorealistic rendering and product animation using Blender to create stunning marketing materials before a physical prototype exists.',
    features: [
      'Product Renders',
      'Exploded View Animations',
      'Assembly Instructions',
      'Lighting & Texturing',
    ],
  },
  {
    title: 'Prototyping & 3D Printing',
    icon: Printer,
    description:
      'Optimization of designs for additive manufacturing. Slicing, print-in-place mechanisms, and physical prototyping advice.',
    features: [
      'FDM / SLA Optimization',
      'Support Structure Design',
      'Rapid Prototyping',
      'DFM (Design for Mfg)',
    ],
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'We discuss your vision, requirements, and constraints.',
  },
  { step: '02', title: 'Concept', desc: 'Initial sketches and block models for feedback.' },
  { step: '03', title: 'Engineering', desc: 'Detailed CAD modeling and mechanical analysis.' },
  { step: '04', title: 'Delivery', desc: 'Final source files, technical drawings, and renders.' },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
      {/* Header */}
      <div className="mb-24 text-center max-w-3xl mx-auto">
        <ScrollReveal direction="up">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">
            /03 Services
          </h2>
          <h1 className="text-fluid-h2 font-bold mb-8">What I Do</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            I help startups and established companies turn ideas into physical products through
            expert engineering and design.
          </p>
        </ScrollReveal>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        {SERVICES.map((service, idx) => (
          <ScrollReveal key={service.title} direction="up" delay={idx * 150}>
            <div className="glass-card p-8 md:p-10 h-full flex flex-col">
              <service.icon size={40} className="text-foreground mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-8 flex-1">{service.description}</p>
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
            <div className="hidden md:block absolute top-6 left-0 w-full h-[2px] bg-border -z-10" />
            {PROCESS.map((p) => (
              <div key={p.step} className="relative pt-4">
                <div className="w-12 h-12 bg-background text-foreground rounded-full flex items-center justify-center font-black mb-6 border-4 border-border mx-auto md:mx-0">
                  {p.step}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* CTA */}
      <ScrollReveal direction="up">
        <div
          className="glass-card p-12 md:p-16 text-center"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--bg)' }}>
            Have a project in mind?
          </h2>
          <p className="mb-10 max-w-xl mx-auto text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Whether you need a quick 3D render or a complete mechanical design from scratch,
            I&apos;m ready to help.
          </p>
          <Link
            href="/contact"
            className="magnetic inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 font-bold text-lg rounded-full hover:opacity-90 transition-opacity"
          >
            Start a Conversation <ArrowRight size={20} />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
