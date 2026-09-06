import Image from 'next/image';
import { ArrowRight, Star, GitBranch, ExternalLink } from 'lucide-react';
import type { GitHubRepo } from '@/lib/types';
import { GitHubCalendarClient } from '@/components/ui/GitHubCalendarClient';

async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      'https://api.github.com/users/bimsara0608/repos?sort=updated&per_page=8',
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

export default async function GitHubPage() {
  const [repos, ghProfile] = await Promise.all([getGitHubRepos(), getGitHubProfile()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-24 w-full">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
          /01 Code &amp; Scripts
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">GitHub Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Open-source projects, hardware scripts, automation tools, and code experiments.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
          <Image
            src="https://github.com/bimsara0608.png"
            alt="Bimsara GitHub Avatar"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {ghProfile?.name || 'Bimsara Gunawardana'}
          </h2>
          <a
            href="https://github.com/bimsara0608"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            @bimsara0608
          </a>
          {ghProfile?.bio && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ghProfile.bio}</p>
          )}
          {ghProfile && (
            <div className="flex justify-center md:justify-start gap-5 mt-4 text-sm">
              <span>
                <strong className="text-foreground font-bold">{ghProfile.public_repos}</strong>{' '}
                <span className="text-muted-foreground">repos</span>
              </span>
              <span>
                <strong className="text-foreground font-bold">{ghProfile.followers}</strong>{' '}
                <span className="text-muted-foreground">followers</span>
              </span>
              <span>
                <strong className="text-foreground font-bold">{ghProfile.following}</strong>{' '}
                <span className="text-muted-foreground">following</span>
              </span>
            </div>
          )}
        </div>
        <a
          href="https://github.com/bimsara0608"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2 text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          <ExternalLink size={14} /> Follow on GitHub
        </a>
      </div>

      <div className="glass-card p-8 mb-10">
        <h3 className="text-lg font-bold mb-6 text-foreground">Contribution Activity</h3>
        <GitHubCalendarClient username="bimsara0608" />
      </div>

      {/* Repos Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-8 text-foreground">Recent Repositories</h3>
        {repos.length === 0 ? (
          <div className="glass-card text-center py-20 text-muted-foreground">
            Unable to fetch repositories at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 block group hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-base font-bold text-foreground group-hover:text-muted-foreground transition-colors truncate pr-4">
                    {repo.name}
                  </h4>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {repo.topics.slice(0, 4).map((t) => (
                      <span key={t} className="pill">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: LANG_COLORS[repo.language] ?? '#888',
                        }}
                      />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={13} /> {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch size={13} /> {repo.forks_count}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Link to GitHub */}
      <div className="mt-10 text-center">
        <a
          href="https://github.com/bimsara0608"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          View all repositories on GitHub <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}
