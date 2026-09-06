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
      className="overflow-x-auto py-4 flex justify-center w-full [&_svg]:max-w-full [&_svg]:h-auto [&_rect.day]:transition-colors"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
