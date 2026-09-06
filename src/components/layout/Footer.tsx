'use client';

import Link from 'next/link';
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

  return (
    <footer className="bg-foreground text-background mt-16 border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand + Newsletter */}
          <div className="md:col-span-2">
            <p className="font-bold text-xl mb-1 text-background">Bimsara Gunawardana</p>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Design Engineer · Colombo, Sri Lanka
            </p>
            {subStatus === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                <Mail size={16} /> {subMsg}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2 text-sm rounded-full focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                  }}
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-60 transition-opacity hover:opacity-80"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <ArrowRight size={16} className="text-white" />
                </button>
              </form>
            )}
            {subStatus === 'error' && <p className="text-red-400 text-xs mt-2">{subMsg}</p>}
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Projects', href: '/projects' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
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
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Bimsara Gunawardana. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
