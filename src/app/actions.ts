"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!name || !email || !message) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();

  // Assuming you have a contact_messages table. If not, this will fail gracefully.
  const { error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message }]);

  if (error) {
    console.error("Error submitting contact form:", error);
    return { error: "Failed to submit message. Please try again later." };
  }

  return { success: true };
}
