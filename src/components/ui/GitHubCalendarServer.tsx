import React from 'react';
import { GitHubCalendarClient } from './GitHubCalendarClient';

export async function GitHubCalendarServer({ username }: { username: string }) {
  let svgContent: string | null = null;

  try {
    const res = await fetch(`https://ghchart.rshah.org/${username}`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      svgContent = await res.text();
    }
  } catch {
    // Silently ignore and fallback
  }

  if (!svgContent) {
    return (
      <div className="py-10 text-center text-zinc-400 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm">
        GitHub contributions temporarily unavailable.
      </div>
    );
  }

  let transformedSvg = svgContent;

  // 1. Ensure viewBox attribute is present so SVG can render responsively without clipping
  if (!transformedSvg.includes('viewBox')) {
    transformedSvg = transformedSvg.replace(/<svg\s+/i, '<svg viewBox="0 0 663 104" ');
  }

  // 2. Make empty contribution cells visible and sleek in dark mode
  transformedSvg = transformedSvg.replace(/fill:#eeeeee/gi, 'fill:rgba(255,255,255,0.08)');
  transformedSvg = transformedSvg.replace(/fill:#EEEEEE/g, 'fill:rgba(255,255,255,0.08)');

  // 3. Style month and day text labels for crisp readability on dark backgrounds
  transformedSvg = transformedSvg.replace(/fill:#767676/gi, 'fill:#a1a1aa');

  // 4. Give cells rounded corners (rx="2" ry="2") for modern design aesthetics
  transformedSvg = transformedSvg.replace(/<rect\s+/gi, '<rect rx="2" ry="2" ');

  return <GitHubCalendarClient svgHtml={transformedSvg} />;
}
