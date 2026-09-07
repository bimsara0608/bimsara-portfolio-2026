'use client';

import { useState } from 'react';
import { submitContactForm } from '@/app/actions';
import { ArrowRight, Mail, MapPin, ExternalLink, ChevronDown } from 'lucide-react';

const SUBJECTS = [
  'Freelance Project',
  'Job Opportunity',
  'Collaboration',
  '3D Modeling Quote',
  'Other',
];
const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000+', "Let's Discuss"];

const FAQ = [
  {
    q: 'What is your typical turnaround time?',
    a: "Most projects are completed within 2–6 weeks depending on complexity. I'll give you a detailed timeline before starting.",
  },
  {
    q: 'Do you offer revisions?',
    a: 'Yes. Every project includes up to 2 rounds of revision. Additional revisions are available at a small hourly rate.',
  },
  {
    q: 'What file formats do you deliver?',
    a: 'For CAD: SLDPRT, SLDASM, STEP, IGES, STL. For renders: PNG, JPEG, EXR. For 3D files: FBX, OBJ, BLEND.',
  },
  {
    q: 'Are you available for remote work?',
    a: 'Absolutely. I work with clients worldwide entirely remotely with clear communication throughout.',
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
      setMessage("Thanks for reaching out! I'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }
  }

  const fieldClass = 'form-input';
  const labelClass =
    'block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider';

  return (
    <section id="contact" className="w-full py-24 md:py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heavy dark frosted glass backdrop */}
        <div className="rounded-[24px] bg-black/90 backdrop-blur-3xl border border-white/5 p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* Left: Info */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white mb-6">
                Contact
              </span>
              <h2 className="text-fluid-h2 text-white mb-5 leading-tight tracking-tight">
                Ready to collaborate?{' '}
                <span className="text-muted-foreground">Let&apos;s talk.</span>
              </h2>
              <p className="text-[15px] text-muted-foreground mb-10 leading-relaxed max-w-sm">
                Whether you have a specific project in mind or just want to explore possibilities,
                I&apos;d love to hear from you.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-muted border border-border rounded-[10px] flex items-center justify-center flex-shrink-0">
                    <Mail size={15} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                      Email
                    </p>
                    <a
                      href="mailto:hello@bimsara.com"
                      className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                    >
                      hello@bimsara.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-muted border border-border rounded-[10px] flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Colombo, Sri Lanka · Worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://linkedin.com/in/bimsara-gunawardana-8a9b07253"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-border px-3.5 py-2 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <ExternalLink size={13} /> LinkedIn
                  </a>
                  <a
                    href="https://github.com/bimsara0608"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-border px-3.5 py-2 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <ExternalLink size={13} /> GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="card p-7 md:p-8">
              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-500 text-xl">✓</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className={fieldClass}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className={fieldClass}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelClass}>
                      Subject
                    </label>
                    <select name="subject" id="subject" className={fieldClass}>
                      <option value="">Select a subject...</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className={labelClass}>
                      Budget Range
                    </label>
                    <select name="budget" id="budget" className={fieldClass}>
                      <option value="">Select a range...</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      className={`${fieldClass} resize-none`}
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm bg-red-500/8 border border-red-200 dark:border-red-500/20 px-4 py-3 rounded-[10px]">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-foreground text-background px-6 py-3 font-medium text-[15px] hover:opacity-80 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50 rounded-[10px]"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                    <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-foreground mb-2 text-center">
              Common Questions
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Quick answers to things you might wonder about.
            </p>
            <div className="space-y-2">
              {FAQ.map((item, idx) => (
                <div key={idx} className="faq-item">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {item.q}
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground flex-shrink-0 transition-transform ml-4 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* end frosted glass */}
      </div>
    </section>
  );
}
