import { createClient } from "@/utils/supabase/server";
import type { Project } from "@/lib/types";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(id, url, is_hero, sort_order)")
    .order("created_at", { ascending: false });

  return <ProjectsTable initialProjects={(projects as Project[]) ?? []} />;
}
