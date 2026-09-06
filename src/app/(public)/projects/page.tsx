import { ProjectCard } from "@/components/ui/ProjectCard";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();
  const category = (await searchParams).category;

  let query = supabase
    .from("projects")
    .select("*, project_images(url, is_hero)")
    .eq("is_published", true)
    .order("date", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data: dbProjects } = await query;

  // Fallback mock data if DB is empty
  const mockProjects = [
    {
      id: "1",
      title: "Fire Fighting Drone",
      category: "Drones",
      year: "2023",
      slug: "fire-fighting-drone",
      project_images: [{ url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800", is_hero: true }]
    },
    {
      id: "2",
      title: "Smart Mailbox",
      category: "IoT",
      year: "2024",
      slug: "smart-mailbox",
      project_images: [{ url: "https://images.unsplash.com/photo-1557264337-e8a93017fe92?auto=format&fit=crop&q=80&w=800", is_hero: true }]
    },
    {
      id: "3",
      title: "Robotic Arm Prototype",
      category: "Robotics",
      year: "2024",
      slug: "robotic-arm",
      project_images: [{ url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", is_hero: true }]
    },
  ];

  const projects = dbProjects?.length ? dbProjects : mockProjects;

  const categories = ["All", "Blender 3D", "SolidWorks", "Robotics", "Drones", "3D Printing", "IoT"];

  const getHeroImage = (images: any[]) => {
    if (!images || images.length === 0) return "";
    const hero = images.find((img) => img.is_hero);
    return hero ? hero.url : images[0].url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      <div className="mb-16">
        <h1 className="text-5xl font-bold mb-8">Projects</h1>
        
        {/* Filter Tabs - Velisse Style */}
        <div className="flex flex-wrap gap-8 border-b border-gray-200">
          {categories.map((cat) => {
            const isActive = category === cat || (!category && cat === "All");
            return (
              <Link
                key={cat}
                href={cat === "All" ? "/projects" : `/projects?category=${encodeURIComponent(cat)}`}
                className={`filter-tab pb-4 text-sm font-medium transition-colors ${
                  isActive 
                    ? "border-b-2 border-foreground text-foreground" 
                    : "text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-muted">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              year={project.year || "2024"}
              slug={project.slug}
              imageUrl={getHeroImage(project.project_images)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
