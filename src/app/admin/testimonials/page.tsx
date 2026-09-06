import { createClient } from "@/utils/supabase/server";
import type { Testimonial } from "@/lib/types";
import { TestimonialManager } from "@/components/admin/TestimonialManager";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  return <TestimonialManager initialTestimonials={(testimonials as Testimonial[]) ?? []} />;
}
