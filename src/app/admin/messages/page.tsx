import { createClient } from "@/utils/supabase/server";
import type { ContactMessage } from "@/lib/types";
import { MessagesInbox } from "@/components/admin/MessagesInbox";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return <MessagesInbox initialMessages={(messages as ContactMessage[]) ?? []} />;
}
