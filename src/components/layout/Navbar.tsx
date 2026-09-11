'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
// Theme toggle removed for permanent dark mode

const NAV_LINKS = [
  { label: 'Home', href: '/#hero', section: 'hero' },
  { label: 'About', href: '/#about', section: 'about' },
  { label: 'Skills', href: '/#skills', section: 'skills' },
  { label: 'Projects', href: '/#projects', section: 'projects' },
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'GitHub', href: '/#github', section: 'github' },
  { label: 'Contact', href: '/#contact', section: 'contact' },
];

export function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to track active section (only on home page)
  useEffect(() => {
    if (!isHome) return;
    const sections = ['hero', 'about', 'skills', 'projects', 'services', 'github', 'contact'];
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
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    // Only intercept for smooth scrolling when already on home page
    if (isHome) {
      e.preventDefault();
      const sectionId = href.replace('/#', '');
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // On other pages, let the browser follow the /#hash href naturally (navigates to home + section)
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || isOpen
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-background/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/#hero"
          onClick={(e) => handleNavClick(e, '/#hero')}
          className="flex items-center gap-2.5 group tracking-tight"
        >
          <span className="font-semibold text-sm text-foreground group-hover:text-white transition-colors">
            Bimsara Gunawardana
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-xs font-medium uppercase tracking-wider transition-colors duration-150 ${
                isHome && activeSection === link.section
                  ? 'text-white font-semibold'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={resumeUrl || '#contact'}
            download={resumeUrl ? true : undefined}
            target={resumeUrl ? '_blank' : undefined}
            rel={resumeUrl ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 bg-white text-black px-3.5 py-1.5 text-xs font-medium rounded-lg hover:bg-white/90 transition-all shadow-sm"
          >
            <Download size={12} />
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
        className={`md:hidden overflow-y-auto transition-all duration-300 ease-out absolute top-16 left-0 right-0 bg-[#09090b] border-b border-white/10 shadow-2xl ${
          isOpen ? 'h-[calc(100vh-64px)] opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`px-3 py-2.5 text-base rounded-lg transition-colors ${
                isHome && activeSection === link.section
                  ? 'text-foreground font-medium bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={resumeUrl || '#contact'}
            download={resumeUrl ? true : undefined}
            target={resumeUrl ? '_blank' : undefined}
            rel={resumeUrl ? 'noopener noreferrer' : undefined}
            className="mt-3 flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 font-medium rounded-lg hover:bg-zinc-200 transition-all text-xs uppercase tracking-wider shadow-sm"
          >
            <Download size={14} /> Download Resume
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
