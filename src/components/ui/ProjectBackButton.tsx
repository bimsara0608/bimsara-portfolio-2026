'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function ProjectBackButton() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    // If the user has navigation history in this tab, go back to preserve exact scroll position
    if (typeof window !== 'undefined' && window.history.state && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href="/projects"
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-medium mb-12 transition-colors group text-sm"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      Back to Projects
    </Link>
  );
}
