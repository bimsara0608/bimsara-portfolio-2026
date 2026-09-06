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

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  category: z.string().min(2, "Please select a category"),
  date: z.string().min(1, "Date is required"),
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

interface UploadedImage {
  url: string;
  is_hero: boolean;
}

const CATEGORIES = ["Blender 3D", "SolidWorks", "3D Printing", "Drones", "Robotics", "IoT", "Product Design"];

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [modelUrl, setModelUrl] = useState("");
  const [projectId] = useState(() => crypto.randomUUID());

  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_published: false,
      featured: false,
      tools: [],
      date: new Date().toISOString().split("T")[0],
      year: new Date().getFullYear().toString(),
    },
  });

  const generateSlug = () => {
    const currentTitle = getValues("title");
    if (currentTitle) {
      const slug = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    setError("");

    // 1. Insert project
    const { error: insertError } = await supabase.from("projects").insert([{
      id: projectId,
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
    }]);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    // 2. Insert images
    if (images.length > 0) {
      const imageRows = images.map((img, idx) => ({
        id: crypto.randomUUID(),
        project_id: projectId,
        url: img.url,
        is_hero: img.is_hero,
        sort_order: idx,
      }));
      const { error: imgError } = await supabase.from("project_images").insert(imageRows);
      if (imgError) console.error("Image insert error:", imgError);
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

      <h1 className="text-3xl font-bold mb-8">Add New Project</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Basic Information</h2>

          <div>
            <label className={labelClass}>Project Title *</label>
            <input
              {...register("title")}
              className={fieldClass}
              placeholder="e.g. Fire Fighting Drone"
              onBlur={generateSlug}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>URL Slug *</label>
            <div className="flex gap-2">
              <input
                {...register("slug")}
                className={`${fieldClass} flex-1`}
                placeholder="e.g. fire-fighting-drone"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-3 bg-gray-100 border border-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Auto-generate
              </button>
            </div>
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select {...register("category")} className={fieldClass}>
                <option value="">Select...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className={errorClass}>{errors.category.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Date *</label>
              <input type="date" {...register("date")} className={fieldClass} />
              {errors.date && <p className={errorClass}>{errors.date.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Year Display</label>
              <input {...register("year")} className={fieldClass} placeholder="e.g. 2024" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Client / Company</label>
              <input {...register("client")} className={fieldClass} placeholder="e.g. MAS Holdings" />
            </div>
            <div>
              <label className={labelClass}>Timeline</label>
              <input {...register("timeline")} className={fieldClass} placeholder="e.g. 4 Weeks" />
            </div>
          </div>

          <div>
            <label className={labelClass}>External Link</label>
            <input
              {...register("external_url")}
              type="url"
              className={fieldClass}
              placeholder="https://grabcad.com/..."
            />
            {errors.external_url && <p className={errorClass}>{errors.external_url.message}</p>}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Project Content</h2>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className={`${fieldClass} resize-none`}
              placeholder="A brief overview of the project..."
            />
          </div>

          <div>
            <label className={labelClass}>The Challenge</label>
            <textarea
              {...register("challenge")}
              rows={4}
              className={`${fieldClass} resize-none`}
              placeholder="What problem did this project solve? What were the constraints?"
            />
          </div>

          <div>
            <label className={labelClass}>The Solution</label>
            <textarea
              {...register("solution")}
              rows={4}
              className={`${fieldClass} resize-none`}
              placeholder="How did you approach and solve the challenge?"
            />
          </div>

          <div>
            <label className={labelClass}>Tools Used</label>
            <Controller
              name="tools"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Project Images</h2>
          <p className="text-sm text-muted">The first image is set as the hero by default. Click &quot;Set Hero&quot; on any image to change it.</p>
          <ImageUploader
            projectId={projectId}
            onChange={setImages}
          />
        </div>

        {/* 3D Model */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">3D Model (Interactive Viewer)</h2>
          <p className="text-sm text-muted">Upload a .glb or .gltf file to enable the interactive 3D model viewer on this project page.</p>
          <FileUploader
            projectId={projectId}
            onChange={setModelUrl}
          />
        </div>

        {/* Publish Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Publish Settings</h2>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("is_published")}
              className="w-5 h-5 accent-accent rounded"
            />
            <div>
              <p className="font-bold group-hover:text-accent transition-colors">Publish publicly</p>
              <p className="text-sm text-muted">Make this project visible on your portfolio</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("featured")}
              className="w-5 h-5 accent-accent rounded"
            />
            <div>
              <p className="font-bold group-hover:text-accent transition-colors">Featured project</p>
              <p className="text-sm text-muted">Show on the homepage featured projects section</p>
            </div>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Link
            href="/admin/projects"
            className="px-6 py-3 border border-gray-200 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
