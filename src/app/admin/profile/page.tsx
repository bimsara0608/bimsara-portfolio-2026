import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/lib/types";
import { ProfileEditor } from "@/components/admin/ProfileEditor";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").limit(1).single();
  return <ProfileEditor initialProfile={profile as Profile | null} />;
}
