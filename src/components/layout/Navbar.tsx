'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Download } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'GitHub', href: '/github' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
      {/* ── Desktop Floating Pill ── */}
      <div
        className={`hidden md:flex max-w-5xl mx-auto items-center justify-between px-5 py-2.5 rounded-full transition-all duration-300 pointer-events-auto ${
          scrolled
            ? 'backdrop-blur-2xl bg-background/80 border border-border shadow-lg shadow-black/5'
            : 'backdrop-blur-xl bg-background/60 border border-border/50'
        }`}
      >
        <Link
          href="/"
          className="font-bold text-sm tracking-tight text-foreground hover:opacity-70 transition-opacity"
        >
          Bimsara
        </Link>

        <nav className="flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                isActive(link.href)
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href={resumeUrl || '#'}
            download={!!resumeUrl}
            target={resumeUrl ? '_blank' : undefined}
            rel={resumeUrl ? 'noopener noreferrer' : undefined}
            className="ml-1 inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-1.5 text-sm font-semibold rounded-full hover:opacity-80 transition-opacity"
          >
            <Download size={13} />
            Resume
          </a>
        </div>
      </div>

      {/* ── Mobile Bar ── */}
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 pointer-events-auto ${
          scrolled || isOpen
            ? 'backdrop-blur-2xl bg-background/90 border border-border shadow-lg'
            : 'backdrop-blur-xl bg-background/60 border border-border/50'
        }`}
      >
        <Link href="/" className="font-bold text-sm text-foreground">
          Bimsara
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 -mr-1 rounded-xl text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      <div
        className={`md:hidden mt-2 overflow-hidden transition-all duration-300 ease-out rounded-2xl pointer-events-auto ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="backdrop-blur-2xl bg-background/95 border border-border rounded-2xl p-3">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive(link.href)
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={resumeUrl || '#'}
              download={!!resumeUrl}
              target={resumeUrl ? '_blank' : undefined}
              rel={resumeUrl ? 'noopener noreferrer' : undefined}
              className="mt-2 flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <Download size={16} /> Download Resume
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
