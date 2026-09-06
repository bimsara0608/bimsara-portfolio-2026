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
    <footer className="bg-foreground text-background py-20 mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-2 text-background">Stay Connected</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Get notified about new projects and updates.
            </p>
            {subStatus === 'success' ? (
              <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
                <Mail size={16} /> {subMsg}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="glass-input-dark px-4 py-2 w-full focus:outline-none text-sm font-medium rounded-none border border-muted-foreground/30 text-background bg-background/5"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="magnetic bg-background text-foreground px-4 py-2 font-bold hover:opacity-80 transition-opacity flex-shrink-0 disabled:opacity-70"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                {subStatus === 'error' && <p className="text-red-500 text-xs">{subMsg}</p>}
              </form>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-xs">
              Navigation
            </h3>
            <ul className="space-y-3">
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
                    className="text-sm font-medium text-background/80 hover:text-background transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-xs">
              Social
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://linkedin.com/in/bimsara-gunawardana-8a9b07253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-background/80 hover:text-background transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bimsara0608"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-background/80 hover:text-background transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://grabcad.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-background/80 hover:text-background transition-colors"
                >
                  GrabCAD
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-xs">
              Contact
            </h3>
            <a
              href="mailto:hello@bimsara.com"
              className="text-sm font-medium text-background/80 hover:text-background transition-colors block mb-2"
            >
              hello@bimsara.com
            </a>
            <p className="text-muted-foreground text-sm">
              Colombo, Sri Lanka
              <br />
              Available worldwide.
            </p>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bimsara Gunawardana. All rights reserved.
          </p>
          <div className="font-black text-2xl tracking-tighter text-background opacity-20">
            Bimsara
          </div>
        </div>
      </div>
    </footer>
  );
}
