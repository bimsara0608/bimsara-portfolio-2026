import Image from 'next/image';
import { ArrowRight, Star, GitBranch, ExternalLink } from 'lucide-react';
import type { GitHubRepo } from '@/lib/types';
import { GitHubCalendarServer } from '@/components/ui/GitHubCalendarServer';

async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      'https://api.github.com/users/bimsara0608/repos?sort=updated&per_page=6',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return [];
  }
}

async function getGitHubProfile() {
  try {
    const res = await fetch('https://api.github.com/users/bimsara0608', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  } catch {
    return null;
  }
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  C: '#555555',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

export async function GitHubSection() {
  const [repos, ghProfile] = await Promise.all([getGitHubRepos(), getGitHubProfile()]);

  // Clean professional bio fallback (override outdated undergraduate bio from raw GH API if present)
  const displayBio =
    ghProfile?.bio && !ghProfile.bio.toLowerCase().includes('undergraduate')
      ? ghProfile.bio
      : 'Design Engineer specializing in Parametric CAD, Robotics Automation, and Embedded Systems.';

  return (
    <section id="github" className="w-full py-24 md:py-32 px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div>
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium tracking-widest uppercase text-white/80 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              OPEN SOURCE &amp; CODE
            </span>
            <h2 className="text-fluid-h2 text-white tracking-tight mb-4">
              Engineering Code &amp; Repositories.{' '}
              <span className="text-zinc-400 block md:inline">
                Firmware, algorithms &amp; CAD tools.
              </span>
            </h2>
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Open-source development spanning robotics control, automation algorithms, computer
              vision, and computational modeling.
            </p>
          </div>

          {/* Profile card */}
          <div className="card p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#111114] border-white/[0.08] shadow-lg">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/15 bg-zinc-950">
              <Image
                src="https://github.com/bimsara0608.png"
                alt="Bimsara Gunawardana GitHub Avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-white">
                  {ghProfile?.name || 'Bimsara Gunawardana'}
                </h3>
                <span className="text-xs font-mono text-zinc-400">(@bimsara0608)</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">{displayBio}</p>
              {ghProfile && (
                <div className="flex justify-center md:justify-start gap-6 mt-4 text-xs font-mono">
                  <span>
                    <strong className="text-white font-semibold">{ghProfile.public_repos}</strong>{' '}
                    <span className="text-zinc-400">public repos</span>
                  </span>
                  <span>
                    <strong className="text-white font-semibold">{ghProfile.followers}</strong>{' '}
                    <span className="text-zinc-400">followers</span>
                  </span>
                  <span>
                    <strong className="text-white font-semibold">{ghProfile.following}</strong>{' '}
                    <span className="text-zinc-400">following</span>
                  </span>
                </div>
              )}
            </div>
            <a
              href="https://github.com/bimsara0608"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.04] text-white px-4 py-2 text-xs font-mono font-medium rounded-lg hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap flex-shrink-0"
            >
              <ExternalLink size={13} /> View GitHub Profile
            </a>
          </div>

          {/* Contribution calendar */}
          <div className="card p-6 md:p-8 mb-6 overflow-x-auto bg-[#111114] border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Git Commit Activity</h3>
              <span className="text-[11px] font-mono text-zinc-400">Last 12 Months</span>
            </div>
            <GitHubCalendarServer username="bimsara0608" />
          </div>

          {/* Repos grid */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Selected Public Repositories</h3>
            <span className="text-xs font-mono text-zinc-400">Synced via GitHub API</span>
          </div>

          {repos.length === 0 ? (
            <div className="card text-center py-14 text-zinc-400 text-sm bg-[#111114] border-white/[0.08]">
              Unable to fetch repositories at the moment. View directly on GitHub.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 block group bg-[#111114] border-white/[0.08] hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-mono font-semibold text-white group-hover:text-cyan-400 transition-colors truncate pr-3">
                      {repo.name}
                    </h4>
                    <ArrowRight
                      size={14}
                      className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 mb-3 h-8 line-clamp-2 leading-relaxed">
                    {repo.description || 'Automation and software engineering repository.'}
                  </p>
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {repo.topics.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.08]">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#888' }}
                        />
                        <span className="text-zinc-300">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star size={12} /> {repo.stargazers_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch size={12} /> {repo.forks_count}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="https://github.com/bimsara0608"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-white transition-colors"
            >
              Explore all repositories on GitHub <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
