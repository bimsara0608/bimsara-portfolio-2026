import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bimsara-portfolio-2026.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${baseUrl}/github`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  try {
    const supabase = await createClient();
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, date')
      .eq('is_published', true);

    const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: 'yearly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes];
  } catch (error) {
    return staticRoutes;
  }
}
