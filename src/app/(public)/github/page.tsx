import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, GitBranch } from "lucide-react";
import type { GitHubRepo } from "@/lib/types";
import { GitHubCalendar } from "react-github-calendar";

async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch("https://api.github.com/users/bimsara0608/repos?sort=updated&per_page=8", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch {
    return [];
  }
}

async function getGitHubProfile() {
  try {
    const res = await fetch("https://api.github.com/users/bimsara0608", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return null;
  }
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  C: "#555555",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export default async function GitHubPage() {
  const [repos, ghProfile] = await Promise.all([getGitHubRepos(), getGitHubProfile()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 Code &amp; Scripts</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">GitHub Projects</h1>
        <p className="text-xl text-muted max-w-2xl">
          Open-source projects, hardware scripts, automation tools, and code experiments.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card p-8 mb-16 flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900">
        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-100 dark:border-gray-800">
          <Image
            src="https://github.com/bimsara0608.png"
            alt="Bimsara GitHub Avatar"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">
            {ghProfile?.name || "Bimsara Gunawardana"}
          </h2>
          <a
            href="https://github.com/bimsara0608"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground font-medium transition-colors"
          >
            @bimsara0608
          </a>
          {ghProfile?.bio && <p className="mt-2 text-muted">{ghProfile.bio}</p>}
          {ghProfile && (
            <div className="flex justify-center md:justify-start gap-6 mt-3 text-sm">
              <span><strong>{ghProfile.public_repos}</strong> <span className="text-muted">repos</span></span>
              <span><strong>{ghProfile.followers}</strong> <span className="text-muted">followers</span></span>
              <span><strong>{ghProfile.following}</strong> <span className="text-muted">following</span></span>
            </div>
          )}
        </div>
        <a
          href="https://github.com/bimsara0608"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent dark:bg-white text-white dark:text-accent px-6 py-3 font-bold hover:opacity-80 transition-opacity whitespace-nowrap rounded-full flex-shrink-0"
        >
          Follow on GitHub
        </a>
      </div>

      {/* Contribution Calendar */}
      <div className="card p-8 mb-16 bg-white dark:bg-gray-900 overflow-x-auto">
        <h3 className="text-xl font-bold mb-6">Contribution Activity</h3>
        <GitHubCalendar
          username="bimsara0608"
          colorScheme="light"
          blockSize={13}
          blockMargin={4}
        />
      </div>

      {/* Repos Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-8">Recent Repositories</h3>
        {repos.length === 0 ? (
          <div className="text-center py-20 text-muted border border-gray-200 border-dashed rounded-lg">
            Unable to fetch repositories at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-6 block group hover:-translate-y-1 transition-transform"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold group-hover:text-muted transition-colors truncate pr-4">
                    {repo.name}
                  </h4>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-accent transition-colors flex-shrink-0" />
                </div>
                <p className="text-muted text-sm mb-4 h-10 line-clamp-2">
                  {repo.description || "No description provided."}
                </p>
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {repo.topics.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-5 text-sm font-medium text-muted">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#888" }}
                      />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={14} /> {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch size={14} /> {repo.forks_count}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
