"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FileUploader } from "@/components/admin/FileUploader";
import type { Project } from "@/lib/types";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  category: z.string().min(2),
  date: z.string().min(1),
  year: z.string().optional(),
  timeline: z.string().optional(),
  client: z.string().optional(),
  external_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  model_url: z.string().optional().or(z.literal("")),
  description: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  tools: z.array(z.string()).optional(),
  is_published: z.boolean(),
  featured: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;
const CATEGORIES = ["Blender 3D", "SolidWorks", "3D Printing", "Drones", "Robotics", "IoT", "Product Design"];

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modelUrl, setModelUrl] = useState(project.model_url ?? "");
  const [images, setImages] = useState(
    (project.project_images ?? []).map((img) => ({ url: img.url, is_hero: img.is_hero }))
  );

  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      slug: project.slug,
      category: project.category,
      date: project.date,
      year: project.year ?? "",
      timeline: project.timeline ?? "",
      client: project.client ?? "",
      external_url: project.external_url ?? "",
      description: project.description ?? "",
      challenge: project.challenge ?? "",
      solution: project.solution ?? "",
      tools: project.tools ?? [],
      is_published: project.is_published,
      featured: project.featured,
    },
  });

  const generateSlug = () => {
    const currentTitle = getValues("title");
    if (currentTitle) {
      setValue("slug", currentTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    setError("");

    const { error: updateError } = await supabase.from("projects").update({
      title: data.title,
      slug: data.slug,
      category: data.category,
      date: data.date,
      year: data.year || new Date(data.date).getFullYear().toString(),
      timeline: data.timeline || null,
      client: data.client || null,
      external_url: data.external_url || null,
      model_url: modelUrl || null,
      description: data.description || null,
      challenge: data.challenge || null,
      solution: data.solution || null,
      tools: data.tools || [],
      is_published: data.is_published,
      featured: data.featured,
    }).eq("id", project.id);

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    // Sync images: delete old, insert new
    await supabase.from("project_images").delete().eq("project_id", project.id);
    if (images.length > 0) {
      await supabase.from("project_images").insert(
        images.map((img, idx) => ({
          id: crypto.randomUUID(),
          project_id: project.id,
          url: img.url,
          is_hero: img.is_hero,
          sort_order: idx,
        }))
      );
    }

    router.push("/admin/projects");
    router.refresh();
  };

  const fieldClass = "w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent transition-colors font-medium rounded-lg";
  const labelClass = "block text-sm font-bold text-muted mb-2 uppercase tracking-wider";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-muted hover:text-foreground font-medium mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Projects
      </Link>
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Basic Information</h2>
          <div>
            <label className={labelClass}>Project Title *</label>
            <input {...register("title")} className={fieldClass} onBlur={generateSlug} />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>URL Slug *</label>
            <div className="flex gap-2">
              <input {...register("slug")} className={`${fieldClass} flex-1`} />
              <button type="button" onClick={generateSlug} className="px-4 py-3 bg-gray-100 border border-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors">Auto-generate</button>
            </div>
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select {...register("category")} className={fieldClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date *</label>
              <input type="date" {...register("date")} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Year Display</label>
              <input {...register("year")} className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Client</label><input {...register("client")} className={fieldClass} /></div>
            <div><label className={labelClass}>Timeline</label><input {...register("timeline")} className={fieldClass} /></div>
          </div>
          <div>
            <label className={labelClass}>External Link</label>
            <input {...register("external_url")} type="url" className={fieldClass} />
            {errors.external_url && <p className={errorClass}>{errors.external_url.message}</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Project Content</h2>
          <div><label className={labelClass}>Description</label><textarea {...register("description")} rows={3} className={`${fieldClass} resize-none`} /></div>
          <div><label className={labelClass}>The Challenge</label><textarea {...register("challenge")} rows={4} className={`${fieldClass} resize-none`} /></div>
          <div><label className={labelClass}>The Solution</label><textarea {...register("solution")} rows={4} className={`${fieldClass} resize-none`} /></div>
          <div>
            <label className={labelClass}>Tools Used</label>
            <Controller name="tools" control={control} render={({ field }) => (
              <TagInput value={field.value ?? []} onChange={field.onChange} />
            )} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Project Images</h2>
          <ImageUploader projectId={project.id} existingImages={images} onChange={setImages} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">3D Model (Interactive Viewer)</h2>
          <p className="text-sm text-muted">Upload a .glb or .gltf file to enable the interactive 3D model viewer on this project page.</p>
          <FileUploader projectId={project.id} existingUrl={modelUrl} onChange={setModelUrl} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Publish Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("is_published")} className="w-5 h-5 accent-accent rounded" />
            <div><p className="font-bold">Publish publicly</p><p className="text-sm text-muted">Make visible on portfolio</p></div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-5 h-5 accent-accent rounded" />
            <div><p className="font-bold">Featured project</p><p className="text-sm text-muted">Show on homepage</p></div>
          </label>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="flex gap-3 justify-end">
          <Link href="/admin/projects" className="px-6 py-3 border border-gray-200 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70">
            <Save size={18} />{isSubmitting ? "Saving..." : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
