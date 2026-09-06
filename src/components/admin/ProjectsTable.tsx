'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import type { Project } from '@/lib/types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface ProjectsTableProps {
  initialProjects: Project[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await supabase.from('projects').delete().eq('id', deleteTarget);
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget));
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const togglePublish = async (project: Project) => {
    setTogglingId(project.id);
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !project.is_published })
      .eq('id', project.id);
    if (!error) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_published: !p.is_published } : p))
      );
    }
    setTogglingId(null);
  };

  const getHeroImage = (images: Project['project_images']) => {
    if (!images || images.length === 0) return null;
    return images.find((i) => i.is_hero)?.url ?? images[0].url;
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project?"
        description="This action is permanent. All project images and data will be permanently deleted."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <Link
            href="/admin/projects/new"
            className="magnetic inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> New Project
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-foreground transition-colors font-medium"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-wider text-xs">
                  <th className="p-4 font-bold">Project</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((project) => {
                    const heroUrl = getHeroImage(project.project_images ?? []);
                    return (
                      <tr
                        key={project.id}
                        className="border-b border-border/50 hover:bg-muted transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {heroUrl ? (
                                <Image
                                  src={heroUrl}
                                  alt={project.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <ExternalLink size={16} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold">{project.title}</p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {project.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{project.category}</td>
                        <td className="p-4 text-muted-foreground text-sm">{project.date}</td>
                        <td className="p-4">
                          <button
                            onClick={() => togglePublish(project)}
                            disabled={togglingId === project.id}
                            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors disabled:opacity-50 ${
                              project.is_published
                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                : 'bg-muted text-muted-foreground hover:opacity-80'
                            }`}
                          >
                            {project.is_published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => togglePublish(project)}
                              disabled={togglingId === project.id}
                              title={project.is_published ? 'Unpublish' : 'Publish'}
                              className="p-2 text-muted-foreground hover:text-green-500 transition-colors rounded-lg hover:bg-green-500/10 disabled:opacity-50"
                            >
                              {project.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(project.id)}
                              className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      {search
                        ? `No projects matching "${search}"`
                        : 'No projects yet. Click "New Project" to add one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
              Showing {filtered.length} of {projects.length} project
              {projects.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
