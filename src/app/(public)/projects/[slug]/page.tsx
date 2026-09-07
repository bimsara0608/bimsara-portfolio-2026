import Image from 'next/image';
import Link from 'next/link';
import { PillBadge } from '@/components/ui/PillBadge';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Clock, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import type { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { ModelViewer } from '@/components/ui/ModelViewer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('title, description, category')
    .eq('slug', slug)
    .single();

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Bimsara Gunawardana`,
    description: project.description || `${project.category} project by Bimsara Gunawardana`,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const slug = (await params).slug;

  const { data: project } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .single();

  if (!project) notFound();

  const data = project as Project;
  const heroImage = data.project_images?.find((img) => img.is_hero) ?? data.project_images?.[0];
  const galleryImages = data.project_images?.filter((img) => !img.is_hero) ?? [];

  // Fetch prev/next projects for navigation
  const { data: allProjects } = await supabase
    .from('projects')
    .select('id, slug, title')
    .eq('is_published', true)
    .order('date', { ascending: false });

  const currentIndex = (allProjects ?? []).findIndex((p) => p.slug === slug);
  const nextProject = allProjects?.[currentIndex + 1];
  const prevProject = allProjects?.[currentIndex - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
      {/* Back Nav */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium mb-12 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 mb-6">
          <PillBadge label={data.category} />
          {data.year && <PillBadge label={data.year} />}
          {data.client && <PillBadge label={data.client} />}
        </div>
        <h1 className="text-fluid-h2 font-bold tracking-tight leading-tight">{data.title}</h1>
        {data.description && (
          <p className="text-xl text-muted-foreground mt-6 max-w-3xl leading-relaxed">
            {data.description}
          </p>
        )}
      </div>

      {/* Hero Image */}
      {heroImage && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted mb-20 rounded-xl">
          <Image
            src={heroImage.url}
            alt={data.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Interactive 3D Model */}
      {data.model_url && (
        <div className="mb-20">
          <ModelViewer src={data.model_url} alt={data.title} />
        </div>
      )}

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
        {/* Content */}
        <div className="md:col-span-8 space-y-12">
          {data.challenge && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-muted-foreground text-base font-normal uppercase tracking-widest">
                  /01
                </span>{' '}
                The Challenge
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">{data.challenge}</p>
            </div>
          )}
          {data.solution && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-muted-foreground text-base font-normal uppercase tracking-widest">
                  /02
                </span>{' '}
                The Solution
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">{data.solution}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          {/* Project Info */}
          <div className="glass-card p-6">
            {data.tools && data.tools.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-muted-foreground mb-3">
                  Tools Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.tools.map((tool) => (
                    <span key={tool} className="pill">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.timeline && (
              <div className="flex items-center gap-3 py-3 border-t border-border">
                <Clock size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Timeline
                  </p>
                  <p className="font-medium text-sm">{data.timeline}</p>
                </div>
              </div>
            )}

            {data.client && (
              <div className="flex items-center gap-3 py-3 border-t border-border">
                <User size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Client
                  </p>
                  <p className="font-medium text-sm">{data.client}</p>
                </div>
              </div>
            )}

            {data.date && (
              <div className="flex items-center gap-3 py-3 border-t border-border">
                <Calendar size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Date
                  </p>
                  <p className="font-medium text-sm">{data.year || data.date}</p>
                </div>
              </div>
            )}

            {data.external_url && (
              <div className="pt-3 border-t border-border">
                <a
                  href={data.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
                >
                  View Live / Download <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Hire CTA */}
          <div className="glass-card p-6" style={{ background: 'var(--fg)' }}>
            <p className="font-bold mb-1" style={{ color: 'var(--bg)' }}>
              Like what you see?
            </p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Let&apos;s build something together.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-background text-foreground px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity rounded-full"
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12">Project Gallery</h2>
          <ImageLightbox images={galleryImages} />
        </div>
      )}

      {/* Prev/Next Navigation */}
      <div className="border-t border-border pt-12 grid grid-cols-2 gap-8">
        {prevProject ? (
          <Link href={`/projects/${prevProject.slug}`} className="group text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
              <ArrowLeft size={12} /> Previous
            </p>
            <p className="font-bold group-hover:text-muted-foreground transition-colors line-clamp-2">
              {prevProject.title}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link href={`/projects/${nextProject.slug}`} className="group text-right ml-auto">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-end gap-1">
              Next <ArrowRight size={12} />
            </p>
            <p className="font-bold group-hover:text-muted-foreground transition-colors line-clamp-2">
              {nextProject.title}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
