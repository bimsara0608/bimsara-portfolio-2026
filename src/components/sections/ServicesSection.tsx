import { ArrowRight, PenTool, Cpu, Printer, Video, CheckCircle2 } from 'lucide-react';

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

export function ServicesSection() {
  return (
    <section id="services" className="w-full py-24 md:py-32 px-6 lg:px-8 section-alt">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span className="section-label">Services</span>
          <h2 className="text-fluid-h2 text-foreground mb-4">What I do</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            I help startups and established companies turn ideas into physical products through
            expert engineering and design.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {SERVICES.map((service) => (
            <div key={service.title} className="card p-7 md:p-8 flex flex-col">
              <service.icon size={32} className="text-muted-foreground mb-5" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-foreground mb-3">{service.title}</h3>
              <p className="text-[15px] text-muted-foreground mb-7 flex-1 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2.5">
                {service.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process */}
        <div className="mb-20">
          <h3 className="text-xl font-medium text-foreground mb-10 text-center">My Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-5 left-8 right-8 h-px bg-border" />
            {PROCESS.map((p) => (
              <div key={p.step} className="relative pt-3 text-center md:text-left">
                <div className="w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center text-sm font-semibold mb-5 border border-border mx-auto md:mx-0 relative z-10">
                  {p.step}
                </div>
                <h4 className="text-sm font-medium text-foreground mb-1.5">{p.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-foreground text-background p-10 md:p-14 text-center rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">Have a project in mind?</h2>
          <p className="mb-8 max-w-md mx-auto text-[15px] opacity-70 leading-relaxed">
            Whether you need a quick 3D render or a complete mechanical design from scratch,
            I&apos;m ready to help.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-background text-foreground font-medium px-6 py-3 rounded-[10px] hover:opacity-90 transition-opacity text-sm"
          >
            Start a Conversation <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
