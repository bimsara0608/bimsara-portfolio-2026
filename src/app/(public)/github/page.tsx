import Link from "next/link";
import { ArrowRight, Star, GitBranch } from "lucide-react";

async function getGitHubRepos() {
  try {
    const res = await fetch("https://api.github.com/users/bimsara0608/repos?sort=updated&per_page=6", {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function GitHubPage() {
  const repos = await getGitHubRepos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      <div className="mb-16">
        <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 Code & Scripts</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">GitHub Projects</h1>
        <p className="text-xl text-muted max-w-2xl">
          A collection of my open-source projects, hardware scripts, and automation tools.
        </p>
      </div>

      {/* GitHub Profile Card */}
      <div className="card p-8 mb-16 flex flex-col md:flex-row items-center gap-8 bg-white">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img src="https://github.com/bimsara0608.png" alt="GitHub Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Bimsara Gunawardana</h2>
          <a href="https://github.com/bimsara0608" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground font-medium transition-colors">
            @bimsara0608
          </a>
          <p className="mt-2 text-muted">Design Engineer | Product Design & 3D Animation | SolidWorks, Blender</p>
        </div>
        <a 
          href="https://github.com/bimsara0608" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-accent text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          Follow on GitHub
        </a>
      </div>

      {/* Repositories Grid */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-8">Recent Repositories</h3>
        {repos.length === 0 ? (
          <div className="text-center py-20 text-muted border border-gray-200 border-dashed rounded-lg">
            Unable to fetch repositories at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo: any) => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card p-6 block hover:-translate-y-1 transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold truncate pr-4">{repo.name}</h4>
                  <ArrowRight size={20} className="text-gray-300" />
                </div>
                <p className="text-muted mb-6 h-12 line-clamp-2">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex items-center gap-6 text-sm font-medium text-muted">
                  {repo.language && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-accent"></span>
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={16} /> {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch size={16} /> {repo.forks_count}
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
