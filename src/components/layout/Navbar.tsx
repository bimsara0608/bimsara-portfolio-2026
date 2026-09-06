'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Download } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-bold text-base tracking-tight text-foreground hover:opacity-70 transition-opacity"
          >
            Bimsara
          </Link>

          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
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
              href="/resume.pdf"
              download
              className="ml-1 inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-1.5 text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity"
            >
              <Download size={13} />
              Resume
            </a>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-base text-foreground">
            Bimsara
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 -mr-1 rounded-lg text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } glass-nav border-t border-border`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            download
            className="mt-2 flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Download size={16} /> Download Resume
          </a>
        </div>
      </div>
    </header>
  );
}
