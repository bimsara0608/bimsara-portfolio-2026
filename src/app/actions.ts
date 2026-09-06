"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// =============================================
// CONTACT FORM
// =============================================
export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const budget = formData.get("budget") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert([{
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || null,
    budget: budget?.trim() || null,
    message: message.trim(),
  }]);

  if (error) {
    console.error("Contact form error:", error);
    return { error: "Failed to submit message. Please try again later." };
  }

  return { success: true };
}

// =============================================
// NEWSLETTER SUBSCRIPTION
// =============================================
export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert([{ email: email.trim() }]);

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already subscribed!" };
    }
    return { error: "Failed to subscribe. Please try again." };
  }

  return { success: true };
}

// =============================================
// ADMIN: PROJECT ACTIONS
// =============================================
export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true };
}

export async function togglePublished(id: string, currentValue: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: !currentValue })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

// =============================================
// ADMIN: MESSAGE ACTIONS
// =============================================
export async function markMessageRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}
