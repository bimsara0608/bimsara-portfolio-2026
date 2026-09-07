'use client';

import { useState } from 'react';
import { submitContactForm } from '@/app/actions';
import {
  ArrowRight,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const SUBJECTS = [
  'Mechanical / Product CAD Design',
  '3D Visualization & Animation',
  'Robotics & Automation System',
  'DFM & Prototyping Review',
  'Full-Time / Contract Opportunity',
  'Other Inquiry',
];

const BUDGETS = ['Under $1,000', '$1,000 – $3,000', '$3,000 – $10,000', '$10,000+', 'To Be Scoped'];

const FAQ = [
  {
    q: 'What CAD deliverables and formats do you provide?',
    a: 'Full parametric native SolidWorks models (.SLDPRT, .SLDASM), universal neutral exchange files (.STEP, .IGES, .X_T), 2D manufacturing drawings with GD&T (.PDF, .DXF, .DWG), and optimized additive manufacturing files (.STL, .3MF). For renders, 4K EXR/PNG with multi-pass alphas.',
  },
  {
    q: 'Can you design for specific manufacturing processes (DFM/DFA)?',
    a: 'Yes. Every component is modeled with target manufacturing constraints in mind: uniform wall thickness and draft angles for injection molding, bend radii and K-factors for sheet metal, tool reach and standard radii for CNC milling, and layer orientation optimization for 3D printing.',
  },
  {
    q: 'Do you sign Non-Disclosure Agreements (NDAs)?',
    a: 'Yes, absolutely. Client confidentiality and IP security are top priorities. I am happy to review and sign mutual NDAs before you share proprietary product documentation or CAD models.',
  },
  {
    q: 'What is your typical project timeline?',
    a: 'Turnaround depends on mechanical complexity. Individual components or 3D product visualizations typically take 3–7 business days; complete multi-part mechanisms from specification to manufacturing drawings range from 2–5 weeks with structured milestone reviews.',
  },
  {
    q: 'How do you handle remote communication and CAD reviews?',
    a: 'I collaborate seamlessly across global time zones via video conferences, screen-shared 3D SolidWorks sessions, interactive eDrawings assemblies, and step-by-step design milestone approvals.',
  },
];

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    if (result.error) {
      setStatus('error');
      setMessage(result.error);
    } else {
      setStatus('success');
      setMessage(
        "Thank you! Your message and specifications have been received. I'll get back to you within 24 hours."
      );
      (e.target as HTMLFormElement).reset();
    }
  }

  const fieldClass =
    'w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-400/60 transition-colors';
  const labelClass =
    'block text-[11px] font-mono font-medium text-muted-foreground mb-1.5 uppercase tracking-wider';

  return (
    <section id="contact" className="w-full py-24 md:py-32 px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Left: Info */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium tracking-widest uppercase text-white/90 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              LET&apos;S COLLABORATE
            </span>
            <h2 className="text-fluid-h2 text-white mb-5 leading-tight tracking-tight">
              Have an engineering challenge?{' '}
              <span className="text-muted-foreground block md:inline">Let&apos;s build it.</span>
            </h2>
            <p className="text-[15px] text-muted-foreground mb-10 leading-relaxed max-w-md">
              Whether you need precision SolidWorks modeling, finite element analysis, 3D
              visualization, or manufacturing consulting, let&apos;s discuss specifications.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                    Direct Email
                  </p>
                  <a
                    href="mailto:bimsaragunawardana3d@gmail.com"
                    className="text-sm font-mono font-medium text-foreground hover:text-cyan-400 transition-colors"
                  >
                    bimsaragunawardana3d@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                    Location & Availability
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Colombo, Sri Lanka · Available for Worldwide Remote Collaboration
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href="https://linkedin.com/in/bimsara-gunawardana-8a9b07253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.02] px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                >
                  <ExternalLink size={12} /> LinkedIn
                </a>
                <a
                  href="https://github.com/bimsara0608"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.02] px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                >
                  <ExternalLink size={12} /> GitHub
                </a>
                <a
                  href="https://grabcad.com/bimsara.gunawardana-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.02] px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                >
                  <ExternalLink size={12} /> GrabCAD
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="card p-7 md:p-8 bg-white/[0.02] border-white/10">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Message Dispatched</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {message}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs font-mono text-cyan-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className={fieldClass}
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className={fieldClass}
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="subject" className={labelClass}>
                      Project Scope
                    </label>
                    <select name="subject" id="subject" className={fieldClass}>
                      <option value="" className="bg-neutral-900">
                        Select inquiry type...
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} className="bg-neutral-900">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className={labelClass}>
                      Estimated Budget
                    </label>
                    <select name="budget" id="budget" className={fieldClass}>
                      <option value="" className="bg-neutral-900">
                        Select range...
                      </option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b} className="bg-neutral-900">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Project Specifications & Requirements *
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    className={`${fieldClass} resize-none`}
                    placeholder="Describe your design parameters, target materials, timeline, or engineering challenge..."
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-white text-black font-semibold py-3 px-6 text-xs font-mono uppercase tracking-wider hover:bg-white/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50 rounded-lg shadow-md"
                >
                  {status === 'loading' ? 'Dispatching Specifications...' : 'Submit Inquiry'}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Engineering FAQ */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">
              FAQ
            </span>
            <h3 className="text-xl font-medium text-foreground">Common Engineering Questions</h3>
          </div>

          <div className="space-y-2.5">
            {FAQ.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-white/[0.02] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ml-4 ${
                      openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
