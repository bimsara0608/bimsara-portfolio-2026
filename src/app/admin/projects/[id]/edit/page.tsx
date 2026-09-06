import { createClient } from "@/utils/supabase/server";
import type { Project } from "@/lib/types";
import { notFound } from "next/navigation";
import { EditProjectForm } from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, project_images(id, url, is_hero, sort_order, alt_text)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return <EditProjectForm project={project as Project} />;
}
