'use client';

import GitHubCalendar from 'react-github-calendar';

export function GitHubCalendarClient({ username }: { username: string }) {
  return (
    <div className="overflow-x-auto py-4">
      <GitHubCalendar username={username} blockSize={13} blockMargin={4} />
    </div>
  );
}
