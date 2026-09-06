'use client';

import { GitHubCalendar } from 'react-github-calendar';

export function GitHubCalendarClient({ username }: { username: string }) {
  return (
    <div className="overflow-x-auto">
      <GitHubCalendar username={username} colorScheme="light" blockSize={13} blockMargin={4} />
    </div>
  );
}
