'use client';

// removed link
import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
// Theme toggle removed for permanent dark mode

const NAV_LINKS = [
  { label: 'Home', href: '#hero', section: 'hero' },
  { label: 'About', href: '#about', section: 'about' },
  { label: 'Projects', href: '#projects', section: 'projects' },
  { label: 'Services', href: '#services', section: 'services' },
  { label: 'GitHub', href: '#github', section: 'github' },
  { label: 'Contact', href: '#contact', section: 'contact' },
];

export function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to track active section
  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'services', 'github', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-background/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="font-semibold text-sm text-foreground hover:opacity-70 transition-opacity tracking-tight"
        >
          Bimsara
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`text-sm transition-colors duration-150 ${
                activeSection === link.section
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={resumeUrl || '#'}
            download={!!resumeUrl}
            target={resumeUrl ? '_blank' : undefined}
            rel={resumeUrl ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 text-sm font-medium rounded-[10px] hover:opacity-80 transition-opacity"
          >
            <Download size={13} />
            Resume
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button
            className="p-2 -mr-1 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-y-auto transition-all duration-300 ease-out absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border ${
          isOpen ? 'h-[calc(100vh-64px)] opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`px-3 py-2.5 text-base rounded-lg transition-colors ${
                activeSection === link.section
                  ? 'text-foreground font-medium bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={resumeUrl || '#'}
            download={!!resumeUrl}
            target={resumeUrl ? '_blank' : undefined}
            rel={resumeUrl ? 'noopener noreferrer' : undefined}
            className="mt-2 flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 font-medium rounded-[10px] hover:opacity-80 transition-opacity text-sm"
          >
            <Download size={15} /> Download Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
