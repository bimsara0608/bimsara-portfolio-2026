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

  return (
    <section id="github" className="w-full py-24 md:py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heavy dark frosted glass backdrop */}
        <div className="rounded-3xl bg-black/70 backdrop-blur-xl border border-white/8 p-8 md:p-12">
          {/* Header */}
          <div className="mb-12">
            <span className="section-label">Open Source</span>
            <h2 className="text-fluid-h2 text-foreground">GitHub Activity</h2>
          </div>

          {/* Profile card */}
          <div className="card p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-border">
              <Image
                src="https://github.com/bimsara0608.png"
                alt="Bimsara GitHub Avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-base font-semibold text-foreground mb-0.5">
                {ghProfile?.name || 'Bimsara Gunawardana'}
              </h3>
              <a
                href="https://github.com/bimsara0608"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                @bimsara0608
              </a>
              {ghProfile?.bio && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">
                  {ghProfile.bio}
                </p>
              )}
              {ghProfile && (
                <div className="flex justify-center md:justify-start gap-5 mt-3 text-sm">
                  <span>
                    <strong className="text-foreground font-medium">
                      {ghProfile.public_repos}
                    </strong>{' '}
                    <span className="text-muted-foreground">repos</span>
                  </span>
                  <span>
                    <strong className="text-foreground font-medium">{ghProfile.followers}</strong>{' '}
                    <span className="text-muted-foreground">followers</span>
                  </span>
                  <span>
                    <strong className="text-foreground font-medium">{ghProfile.following}</strong>{' '}
                    <span className="text-muted-foreground">following</span>
                  </span>
                </div>
              )}
            </div>
            <a
              href="https://github.com/bimsara0608"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-border text-foreground px-4 py-2 text-sm font-medium rounded-[10px] hover:bg-muted transition-colors whitespace-nowrap flex-shrink-0"
            >
              <ExternalLink size={13} /> View on GitHub
            </a>
          </div>

          {/* Contribution calendar */}
          <div className="card p-6 md:p-8 mb-6 overflow-x-auto">
            <h3 className="text-sm font-medium text-foreground mb-5">Contribution Activity</h3>
            <GitHubCalendarServer username="bimsara0608" />
          </div>

          {/* Repos grid */}
          <h3 className="text-base font-medium text-foreground mb-5">Recent Repositories</h3>
          {repos.length === 0 ? (
            <div className="card text-center py-14 text-muted-foreground text-sm">
              Unable to fetch repositories at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 block group"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <h4 className="text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors truncate pr-3">
                      {repo.name}
                    </h4>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 h-8 line-clamp-2 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {repo.topics.slice(0, 3).map((t) => (
                        <span key={t} className="pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#888' }}
                        />
                        {repo.language}
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
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all repositories on GitHub <ArrowRight size={14} />
            </a>
          </div>
        </div>
        {/* end frosted glass */}
      </div>
    </section>
  );
}
