'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, Tag, ToggleLeft, Globe } from 'lucide-react';

interface SiteSettingsEditorProps {
  initialCategories: string[];
  initialTechStack: string[];
  initialMaintenanceMode: boolean;
}

export function SiteSettingsEditor({
  initialCategories,
  initialTechStack,
  initialMaintenanceMode,
}: SiteSettingsEditorProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCategory, setNewCategory] = useState('');

  const [techStack, setTechStack] = useState<string[]>(initialTechStack);
  const [newTech, setNewTech] = useState('');

  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory('');
    }
  };
  const removeCategory = (cat: string) => setCategories(categories.filter((c) => c !== cat));

  const addTech = () => {
    const trimmed = newTech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setNewTech('');
    }
  };
  const removeTech = (tech: string) => setTechStack(techStack.filter((t) => t !== tech));

  const handleSave = async () => {
    setIsSaving(true);
    await Promise.all([
      supabase.from('site_settings').upsert([
        { key: 'project_categories', value: JSON.stringify(categories) },
        { key: 'tech_stack', value: JSON.stringify(techStack) },
        { key: 'maintenance_mode', value: String(maintenanceMode) },
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
          className={`magnetic inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-all disabled:opacity-70 ${
            saved ? 'bg-green-500 text-white' : 'bg-foreground text-background hover:opacity-90'
          }`}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Project Categories */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={18} className="text-muted-foreground" />
          <h2 className="font-bold text-lg">Project Categories</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          These categories appear in the project filter tabs and the &quot;New Project&quot; form.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-2 bg-muted text-sm font-medium px-3 py-1.5 rounded-full"
            >
              {cat}
              <button
                onClick={() => removeCategory(cat)}
                className="text-muted-foreground hover:text-red-500 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Add category..."
            className="flex-1 bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-medium rounded-lg transition-colors"
          />
          <button
            onClick={addCategory}
            className="magnetic bg-foreground text-background px-5 py-2.5 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>

      {/* Tech Stack Marquee Items */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={18} className="text-muted-foreground" />
          <h2 className="font-bold text-lg">Tech Stack (Marquee)</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          These items appear in the scrolling marquee on the homepage.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="flex items-center gap-2 bg-muted text-sm font-medium px-3 py-1.5 rounded-full"
            >
              {tech}
              <button
                onClick={() => removeTech(tech)}
                className="text-muted-foreground hover:text-red-500 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTech()}
            placeholder="Add tool/skill..."
            className="flex-1 bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-medium rounded-lg transition-colors"
          />
          <button
            onClick={addTech}
            className="magnetic bg-foreground text-background px-5 py-2.5 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-muted-foreground" />
          <h2 className="font-bold text-lg">Site Status</h2>
        </div>
        <label className="flex items-center justify-between cursor-pointer group">
          <div>
            <p className="font-bold group-hover:text-foreground transition-colors">
              Maintenance Mode
            </p>
            <p className="text-sm text-muted-foreground">
              When enabled, public visitors will see a &quot;Coming Soon&quot; page.
            </p>
          </div>
          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className="flex-shrink-0 ml-4"
          >
            <ToggleLeft
              size={40}
              className={`transition-colors ${maintenanceMode ? 'text-foreground' : 'text-muted'}`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
