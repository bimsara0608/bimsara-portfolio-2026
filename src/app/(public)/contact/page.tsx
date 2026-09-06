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

export default function ContactPage() {
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

  const fieldClass =
    'w-full glass-input px-4 py-3 focus:outline-none transition-colors font-medium text-sm';
  const labelClass =
    'block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Left: Info */}
        <div>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">
            /01 Contact
          </h2>
          <h1 className="text-fluid-h2 font-bold mb-8 leading-tight">
            Ready to
            <br />
            collaborate?
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-md">
            Whether you have a specific project in mind or just want to explore possibilities,
            I&apos;d love to hear from you.
          </p>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-card p-3 border border-border rounded-lg">
                <Mail className="text-foreground" size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                  Email
                </p>
                <a
                  href="mailto:hello@bimsara.com"
                  className="font-medium text-lg hover:text-muted-foreground transition-colors magnetic"
                >
                  hello@bimsara.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-card p-3 border border-border rounded-lg">
                <MapPin className="text-foreground" size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                  Location
                </p>
                <p className="font-medium text-lg">Colombo, Sri Lanka · Worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/in/bimsara-gunawardana-8a9b07253"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic bg-card p-3 border border-border rounded-lg hover:border-foreground transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <ExternalLink className="text-foreground" size={18} /> LinkedIn
              </a>
              <a
                href="https://github.com/bimsara0608"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic bg-card p-3 border border-border rounded-lg hover:border-foreground transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <ExternalLink className="text-foreground" size={18} /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="glass-card p-8 md:p-12">
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <p className="text-red-500 font-medium text-sm bg-red-500/10 px-4 py-3 rounded-xl">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="magnetic w-full bg-foreground text-background px-8 py-4 font-bold text-lg hover:opacity-80 transition-opacity flex justify-center items-center gap-2 disabled:opacity-60 rounded-lg"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-6 text-center">
          /02 FAQ
        </h2>
        <h3 className="text-3xl font-bold mb-10 text-center">Common Questions</h3>
        <div className="space-y-2">
          {FAQ.map((item, idx) => (
            <div key={idx} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-bold hover:bg-muted/50 transition-colors"
              >
                {item.q}
                <ChevronDown
                  size={20}
                  className={`text-muted-foreground flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
