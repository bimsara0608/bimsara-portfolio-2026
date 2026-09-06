"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2, Tag, ToggleLeft, Globe } from "lucide-react";

const DEFAULT_CATEGORIES = ["Blender 3D", "SolidWorks", "3D Printing", "Drones", "Robotics", "IoT", "Product Design"];

interface SiteSettingsEditorProps {
  initialCategories: string[];
  initialMaintenanceMode: boolean;
}

export function SiteSettingsEditor({ initialCategories, initialMaintenanceMode }: SiteSettingsEditorProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
    }
  };
  const removeCategory = (cat: string) => setCategories(categories.filter((c) => c !== cat));

  const handleSave = async () => {
    setIsSaving(true);
    await Promise.all([
      supabase.from("site_settings").upsert([
        { key: "project_categories", value: JSON.stringify(categories) },
        { key: "maintenance_mode", value: String(maintenanceMode) },
      ]),
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors disabled:opacity-70 ${
            saved ? "bg-green-600 text-white" : "bg-accent text-white hover:bg-gray-800"
          }`}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Project Categories */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={18} className="text-muted" />
          <h2 className="font-bold text-lg">Project Categories</h2>
        </div>
        <p className="text-sm text-muted mb-4">These categories appear in the project filter tabs and the &quot;New Project&quot; form.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <span key={cat} className="flex items-center gap-2 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded-full">
              {cat}
              <button onClick={() => removeCategory(cat)} className="text-gray-400 hover:text-red-500 transition-colors text-xs font-bold">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Add category..."
            className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 focus:outline-none focus:border-accent font-medium rounded-lg"
          />
          <button onClick={addCategory} className="bg-accent text-white px-5 py-2.5 font-bold rounded-lg hover:bg-gray-800 transition-colors">Add</button>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-muted" />
          <h2 className="font-bold text-lg">Site Status</h2>
        </div>
        <label className="flex items-center justify-between cursor-pointer group">
          <div>
            <p className="font-bold">Maintenance Mode</p>
            <p className="text-sm text-muted">When enabled, public visitors will see a &quot;Coming Soon&quot; page.</p>
          </div>
          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className="flex-shrink-0 ml-4"
          >
            <ToggleLeft
              size={40}
              className={`transition-colors ${maintenanceMode ? "text-accent" : "text-gray-300"}`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
