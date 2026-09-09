import {
  ArrowRight,
  PenTool,
  Cpu,
  Printer,
  Video,
  CheckCircle2,
  Layers,
  ShieldCheck,
} from 'lucide-react';

const SERVICES = [
  {
    title: 'Product Design & Parametric CAD',
    tag: 'SOLIDWORKS / STEP / DFM',
    icon: PenTool,
    description:
      'End-to-end parametric modeling engineered for real-world functionality, ergonomic enclosures, and manufacturing precision.',
    features: [
      'Parametric 3D CAD (.SLDPRT, .STEP, .IGES)',
      'Complex Surfacing & Ergonomic Housings',
      'Sheet Metal & Plastic Enclosure Tooling',
      'GD&T Production Drawings (ASME Y14.5)',
    ],
  },
  {
    title: 'Mechanical & Robotics Engineering',
    tag: 'SIMULATION & MECHANISMS',
    icon: Cpu,
    description:
      'Rigorous mechanism design, kinematic simulations, and structural analysis to ensure real-world reliability before physical tooling.',
    features: [
      'FEA Structural & Stress Analysis',
      'Kinematic & Multi-Body Motion Studies',
      'Tolerance Stack-Up & Clearance Audits',
      'Actuator, Motor & Transmission Sizing',
    ],
  },
  {
    title: 'Photorealistic 3D Visualization',
    tag: 'BLENDER / CYCLES / CINEMATICS',
    icon: Video,
    description:
      'High-fidelity product visualization, exploded technical assembly sequences, and cinematic renders for engineering documentation and investor launches.',
    features: [
      '4K Photorealistic Studio Renders',
      'Technical Exploded Assembly Animations',
      'PBR Texturing & Custom Lighting Rigs',
      'Interactive 3D Turnarounds & Motion Graphics',
    ],
  },
  {
    title: 'Prototyping & DFM Optimization',
    tag: 'ADDITIVE / CNC / TOOLING',
    icon: Printer,
    description:
      'Design for Additive & Subtractive Manufacturing (DFM/DFA) to eliminate tooling rework, reduce component count, and slash production costs.',
    features: [
      'DFM Audits for Injection Molding & CNC',
      'Additive Optimization (FDM, SLA, SLS)',
      'Print-in-Place & Snap-Fit Mechanisms',
      'BOM Generation & Vendor Fabrication Packs',
    ],
  },
];

const PROCESS = [
  {
    step: '01',
    phase: 'SPECIFICATION',
    title: 'Discovery & Constraints',
    desc: 'Deep-dive into functional requirements, mechanical loads, material constraints, and target unit economics.',
  },
  {
    step: '02',
    phase: 'CONCEPT',
    title: 'Ideation & Form Study',
    desc: 'Ergonomic explorations, volumetric block models, and architectural feasibility checks before deep CAD.',
  },
  {
    step: '03',
    phase: 'ENGINEERING',
    title: 'Parametric CAD & FEA',
    desc: 'Detailed SolidWorks modeling, kinematic motion studies, stress analysis, and tolerance stack-up validation.',
  },
  {
    step: '04',
    phase: 'HANDOFF',
    title: 'Fabrication & Delivery',
    desc: 'Release of manufacturing-ready STEP/DXF files, GD&T drawings, BOM documentation, and photorealistic renders.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="w-full py-24 md:py-32 px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div>
          {/* Header */}
          <div className="mb-16 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium tracking-widest uppercase text-white/80 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              CAPABILITIES &amp; SERVICES
            </span>
            <h2 className="text-fluid-h2 text-white mb-4 tracking-tight">
              Engineering Capabilities.{' '}
              <span className="text-zinc-400 block md:inline">From concept to production.</span>
            </h2>
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Combining Certified SolidWorks Professional rigor, robotics automation insight, and
              high-end 3D visualization to deliver robust, manufacturing-ready hardware.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="card p-7 md:p-8 flex flex-col bg-[#111114] border-white/[0.08] hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:border-cyan-400/40 group-hover:text-cyan-300 transition-colors">
                    <service.icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-[14px] text-zinc-400 mb-6 flex-1 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-4 border-t border-white/[0.08]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-3">
                    Deliverables &amp; Methods
                  </span>
                  <ul className="space-y-2">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                METHODOLOGY
              </span>
              <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                The Engineering Workflow
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                A disciplined sequence designed to derisk development, iterate rapidly, and ensure
                zero surprises in fabrication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
              {/* Connected Line across desktop */}
              <div className="hidden md:block absolute top-7 left-10 right-10 h-px bg-gradient-to-r from-white/10 via-cyan-500/30 to-white/10 pointer-events-none" />

              {PROCESS.map((p) => (
                <div
                  key={p.step}
                  className="relative p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-white/20 transition-all text-left shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="w-10 h-10 bg-zinc-950 text-white rounded-xl flex items-center justify-center text-xs font-mono font-bold border border-white/15 shadow-sm">
                      {p.step}
                    </div>
                    <span className="text-[10px] font-mono font-medium tracking-wider text-zinc-400 uppercase px-2 py-0.5 rounded bg-white/[0.04]">
                      {p.phase}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">{p.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Action Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114] p-8 md:p-12 text-center shadow-xl">
            <div className="max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-3">
                <ShieldCheck size={14} /> Certified SolidWorks Professional (CSWP)
              </span>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 tracking-tight">
                Have a mechanical challenge or CAD project?
              </h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Whether you need precision CAD modeling, manufacturing drawings, or a complete
                product design from initial specs, let&apos;s build it right.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-all text-xs font-mono uppercase tracking-wider shadow-md"
              >
                Discuss Specifications <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
