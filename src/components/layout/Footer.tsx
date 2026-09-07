'use client';

import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { subscribeNewsletter } from '@/app/actions';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMsg, setSubMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('loading');
    const formData = new FormData();
    formData.append('email', email);
    const result = await subscribeNewsletter(formData);
    if (result.error) {
      setSubStatus('error');
      setSubMsg(result.error);
    } else {
      setSubStatus('success');
      setSubMsg("You're subscribed!");
      setEmail('');
    }
  };

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="mt-0 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand + Newsletter */}
          <div className="md:col-span-2">
            <p className="font-semibold text-base mb-1 text-white">Bimsara Gunawardana</p>
            <p className="text-sm mb-5 text-white/50">Design Engineer · Colombo, Sri Lanka</p>
            {subStatus === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Mail size={14} /> {subMsg}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3.5 py-2 text-sm rounded-[10px] focus:outline-none placeholder:text-white/30 text-white"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-opacity hover:opacity-70"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <ArrowRight size={15} className="text-white" />
                </button>
              </form>
            )}
            {subStatus === 'error' && <p className="text-red-400 text-xs mt-2">{subMsg}</p>}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-4 text-white/30">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About', id: 'about' },
                { label: 'Projects', id: 'projects' },
                { label: 'Services', id: 'services' },
                { label: 'GitHub', id: 'github' },
                { label: 'Contact', id: 'contact' },
              ].map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => handleNavClick(l.id)}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-4 text-white/30">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com/in/bimsara-gunawardana-8a9b07253',
                },
                { label: 'GitHub', href: 'https://github.com/bimsara0608' },
                { label: 'GrabCAD', href: 'https://grabcad.com' },
                { label: 'hello@bimsara.com', href: 'mailto:hello@bimsara.com' },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Bimsara Gunawardana. All rights reserved.
          </p>
          <p className="text-xs text-white/20">Built with Next.js &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}
