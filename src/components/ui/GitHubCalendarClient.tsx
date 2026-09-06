'use client';

export function GitHubCalendarClient({ username }: { username: string }) {
  return (
    <div className="overflow-x-auto py-4 flex flex-col md:flex-row items-center justify-center gap-4 w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa&icon_color=ffffff`}
        alt={`${username}'s Github Stats`}
        className="max-w-full opacity-90 hover:opacity-100 transition-opacity"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa`}
        alt={`${username}'s Top Languages`}
        className="max-w-full opacity-90 hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
