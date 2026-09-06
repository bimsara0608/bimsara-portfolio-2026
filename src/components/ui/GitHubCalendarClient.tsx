'use client';

export function GitHubCalendarClient({ username }: { username: string }) {
  return (
    <div className="overflow-x-auto py-4 flex justify-center w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rshah.org/${username}`}
        alt={`${username}'s Github chart`}
        className="max-w-full opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
