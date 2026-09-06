import Image from "next/image";
import Link from "next/link";
import { PillBadge } from "@/components/ui/PillBadge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const slug = (await params).slug;

  const { data: project } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("slug", slug)
    .single();

  // Mock data for development
  const mockProject = {
    title: "Fire Fighting Drone",
    category: "Drones",
    year: "2023",
    description: "A custom-designed quadcopter capable of carrying and deploying fire-extinguishing payloads in hard-to-reach areas.",
    challenge: "Designing a drone chassis that is lightweight enough for 30 minutes of flight time while maintaining structural integrity to carry a 2kg payload.",
    solution: "Utilized generative design in SolidWorks to optimize the carbon fiber frame, and designed custom 3D printed brackets for the payload release mechanism.",
    tools: ["SolidWorks", "Blender", "3D Printing", "CFD Analysis"],
    project_images: [
      { url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1200", is_hero: true },
      { url: "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?auto=format&fit=crop&q=80&w=800", is_hero: false },
      { url: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800", is_hero: false }
    ]
  };

  const data = project || mockProject;

  const heroImage = data.project_images.find((img: any) => img.is_hero) || data.project_images[0];
  const galleryImages = data.project_images.filter((img: any) => !img.is_hero);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 w-full">
      <Link href="/projects" className="inline-flex items-center gap-2 text-muted hover:text-foreground font-medium mb-12 transition-colors">
        <ArrowLeft size={20} /> Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex gap-3 mb-6">
          <PillBadge label={data.category} />
          <PillBadge label={data.year || "2024"} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{data.title}</h1>
      </div>

      {/* Hero Image */}
      {heroImage && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-100 mb-20">
          <Image
            src={heroImage.url}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Challenge & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
        <div className="md:col-span-8">
          <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
          <p className="text-xl text-muted leading-relaxed mb-12">
            {data.challenge || data.description}
          </p>

          <h2 className="text-3xl font-bold mb-6">The Solution</h2>
          <p className="text-xl text-muted leading-relaxed">
            {data.solution || "Detailed solution description goes here."}
          </p>
        </div>

        <div className="md:col-span-4">
          <div className="border-t border-gray-200 pt-8">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-muted">Tools Used</h3>
            <ul className="space-y-2">
              {(data.tools || []).map((tool: string, idx: number) => (
                <li key={idx} className="font-medium">{tool}</li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-muted">Timeline</h3>
            <p className="font-medium">4 Weeks</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">From Concept to Reality</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryImages.map((img: any, idx: number) => (
              <div key={idx} className={`relative overflow-hidden bg-gray-100 ${idx === 0 ? "aspect-square" : "aspect-[4/3]"}`}>
                <Image
                  src={img.url}
                  alt={`${data.title} gallery image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Project CTA */}
      <div className="border-t border-gray-200 pt-16 text-center">
        <p className="text-muted font-bold tracking-widest uppercase mb-4 text-sm">Up Next</p>
        <Link href="/projects" className="group inline-flex items-center gap-4 text-4xl font-bold hover:text-muted transition-colors">
          Explore Similar Work <ArrowRight className="group-hover:translate-x-2 transition-transform" size={40} />
        </Link>
      </div>
    </div>
  );
}
