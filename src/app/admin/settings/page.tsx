import { createClient } from "@/utils/supabase/server";
import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*");

  const settingsMap: Record<string, string> = {};
  (settings ?? []).forEach((s: { key: string; value: string }) => {
    settingsMap[s.key] = s.value;
  });

  let categories: string[] = [];
  try {
    categories = JSON.parse(settingsMap["project_categories"] ?? "[]");
  } catch { categories = []; }

  const maintenanceMode = settingsMap["maintenance_mode"] === "true";

  return (
    <SiteSettingsEditor
      initialCategories={categories.length > 0 ? categories : ["Blender 3D", "SolidWorks", "3D Printing", "Drones", "Robotics", "IoT", "Product Design"]}
      initialMaintenanceMode={maintenanceMode}
    />
  );
}
