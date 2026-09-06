"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  date: z.string().min(1, "Date is required"),
  is_published: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_published: false,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    setError("");

    // Generate UUID for project
    const id = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("projects")
      .insert([
        { 
          id,
          title: data.title,
          slug: data.slug,
          category: data.category,
          date: data.date,
          is_published: data.is_published
        }
      ]);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-muted hover:text-foreground font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Projects
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Project</h1>

      <div className="card p-8 bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Project Title</label>
            <input
              {...register("title")}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent font-medium"
              placeholder="e.g. Fire Fighting Drone"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">URL Slug</label>
            <input
              {...register("slug")}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent font-medium"
              placeholder="e.g. fire-fighting-drone"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Category</label>
              <select
                {...register("category")}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent font-medium"
              >
                <option value="">Select...</option>
                <option value="Drones">Drones</option>
                <option value="Robotics">Robotics</option>
                <option value="SolidWorks">SolidWorks</option>
                <option value="Blender 3D">Blender 3D</option>
                <option value="3D Printing">3D Printing</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Date</label>
              <input
                type="date"
                {...register("date")}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent font-medium"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 py-4 border-t border-gray-200">
            <input
              type="checkbox"
              id="is_published"
              {...register("is_published")}
              className="w-5 h-5 accent-accent"
            />
            <label htmlFor="is_published" className="font-bold cursor-pointer">
              Publish publicly
            </label>
          </div>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Save size={20} />
              {isSubmitting ? "Saving..." : "Save Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
