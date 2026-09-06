import React from 'react';

export async function GitHubCalendarServer({ username }: { username: string }) {
  let svgContent: string | null = null;

  try {
    const res = await fetch(`https://ghchart.rshah.org/${username}`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      svgContent = await res.text();
    }
  } catch (err) {
    // Silently ignore and fallback
  }

  if (!svgContent) {
    return (
      <div className="py-10 text-center text-muted-foreground bg-secondary/20 rounded-lg">
        GitHub contributions temporarily unavailable.
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto py-2 flex w-full justify-start [&_svg]:min-w-[700px] [&_svg]:max-w-full [&_svg]:h-auto dark:[&_svg]:invert dark:[&_svg]:hue-rotate-180 opacity-90 hover:opacity-100 transition-opacity"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
