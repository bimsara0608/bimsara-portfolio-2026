import Image from "next/image";
import Link from "next/link";
import { StatItem } from "@/components/ui/StatItem";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Safe fetch for featured projects
  const { data: featuredProjects, error } = await supabase
    .from("projects")
    .select("*, project_images(url, is_hero)")
    .eq("is_published", true)
    // .eq("featured", true) // Assuming you add a featured flag later
    .limit(4);

  // Fallback mock data if DB is empty/unconfigured
  const projects = featuredProjects?.length ? featuredProjects : [
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
  ];

  const getHeroImage = (images: any[]) => {
    if (!images || images.length === 0) return "";
    const hero = images.find((img) => img.is_hero);
    return hero ? hero.url : images[0].url;
  };

  const services = [
    { title: "3D Modeling and Rendering", desc: "High-fidelity visualization for products and concepts using Blender and SolidWorks." },
    { title: "Product Design and Prototyping", desc: "End-to-end design engineering from initial sketches to functional prototypes." },
    { title: "CAD Engineering", desc: "Precision CAD modeling optimized for manufacturing (CSWP Certified)." },
    { title: "Custom 3D Printing", desc: "Rapid prototyping and custom part fabrication using advanced 3D printing techniques." },
  ];

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-48 w-full flex flex-col md:flex-row gap-16 items-center justify-between">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium bg-white shadow-sm">
            Available for freelance work
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Design Engineer,<br />
            Product Design &<br />
            3D Animation
          </h1>
          <p className="text-xl text-muted max-w-2xl">
            Certified SOLIDWORKS Professional (CSWP) helping businesses and creators turn ideas into visually impactful physical and digital products.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/projects" className="bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Explore Work
            </Link>
            <Link href="/contact" className="bg-white text-accent px-8 py-4 rounded-full font-medium border border-gray-200 hover:border-gray-300 transition-colors">
              Let&apos;s Talk
            </Link>
          </div>
        </div>
        
        {/* Profile Image - Glass frame */}
        <div className="relative w-64 h-64 md:w-96 md:h-96">
          <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden border-8 border-white shadow-2xl glass z-10">
            {/* Placeholder for real portrait */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted">
              Portrait Photo
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-200 to-transparent rounded-full blur-3xl -z-10 opacity-50"></div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="60+" label="Projects Completed" />
            <StatItem value="3+" label="Years Experience" />
            <StatItem value="CSWP" label="Certified" />
            <StatItem value="120+" label="Satisfaction" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4">
            <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 Service</h2>
            <h3 className="text-4xl font-bold leading-tight">What Can I Help With</h3>
          </div>
          
          <div className="md:col-span-8 flex flex-col">
            {services.map((service, index) => (
              <div key={index} className="group border-b border-gray-200 py-8 first:pt-0 flex justify-between items-center hover:pr-4 transition-all">
                <div>
                  <h4 className="text-2xl font-bold mb-2">{service.title}</h4>
                  <p className="text-muted max-w-lg">{service.desc}</p>
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-accent transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/02 Portfolio</h2>
            <h3 className="text-4xl font-bold">Featured Projects</h3>
          </div>
          <Link href="/projects" className="text-accent font-medium flex items-center gap-2 hover:underline">
            View All Work <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </section>
    </div>
  );
}
