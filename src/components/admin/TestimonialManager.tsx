"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Testimonial } from "@/lib/types";
import { Star, Plus, Trash2, ToggleLeft, ToggleRight, Edit2 } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface TestimonialManagerProps {
  initialTestimonials: Testimonial[];
}

const EMPTY_FORM = { client_name: "", client_title: "", client_company: "", content: "", rating: 5, is_published: true };

export function TestimonialManager({ initialTestimonials }: TestimonialManagerProps) {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ client_name: t.client_name, client_title: t.client_title ?? "", client_company: t.client_company ?? "", content: t.content, rating: t.rating, is_published: t.is_published });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.client_name || !form.content) return;
    setIsSaving(true);
    if (editing) {
      const { data } = await supabase.from("testimonials").update(form).eq("id", editing.id).select().single();
      if (data) setTestimonials((prev) => prev.map((t) => t.id === editing.id ? data as Testimonial : t));
    } else {
      const { data } = await supabase.from("testimonials").insert([{ ...form, id: crypto.randomUUID(), sort_order: testimonials.length }]).select().single();
      if (data) setTestimonials((prev) => [...prev, data as Testimonial]);
    }
    setShowForm(false);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await supabase.from("testimonials").delete().eq("id", deleteTarget);
    setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget));
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const togglePublish = async (t: Testimonial) => {
    await supabase.from("testimonials").update({ is_published: !t.is_published }).eq("id", t.id);
    setTestimonials((prev) => prev.map((item) => item.id === t.id ? { ...item, is_published: !item.is_published } : item));
  };

  const fieldClass = "w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent transition-colors font-medium rounded-lg";

  return (
    <>
      <ConfirmModal isOpen={!!deleteTarget} title="Delete Testimonial?" description="This testimonial will be permanently deleted." confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isLoading={isDeleting} />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-bold rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={18} /> Add Testimonial
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
            <h2 className="font-bold text-lg">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className={fieldClass} placeholder="Client Name *" />
              <input value={form.client_title} onChange={(e) => setForm({ ...form, client_title: e.target.value })} className={fieldClass} placeholder="Job Title" />
              <input value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} className={fieldClass} placeholder="Company" />
            </div>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className={`${fieldClass} resize-none`} placeholder="Testimonial content *" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted uppercase tracking-wider">Rating:</span>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })} className={r <= form.rating ? "text-yellow-400" : "text-gray-200"}>
                    <Star size={20} fill="currentColor" />
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 accent-accent" />
                <span className="text-sm font-medium">Publish</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={isSaving} className="bg-accent text-white px-6 py-2.5 font-bold rounded-lg hover:bg-gray-800 disabled:opacity-70">
                {isSaving ? "Saving..." : editing ? "Update" : "Add Testimonial"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 font-medium rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        {/* Testimonial Cards */}
        {testimonials.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-muted">
            <Star size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg mb-1">No testimonials yet</p>
            <p className="text-sm">Add client testimonials to build social proof on your portfolio.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className={`bg-white border rounded-xl p-6 ${!t.is_published ? "opacity-60 border-dashed" : "border-gray-200"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <Star key={r} size={14} className={r <= t.rating ? "text-yellow-400" : "text-gray-200"} fill="currentColor" />
                      ))}
                      {!t.is_published && <span className="text-xs text-gray-400 font-medium ml-1">(Hidden)</span>}
                    </div>
                    <p className="text-muted mb-3 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                    <p className="font-bold">{t.client_name}</p>
                    {(t.client_title || t.client_company) && (
                      <p className="text-sm text-muted">{[t.client_title, t.client_company].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => togglePublish(t)} className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      {t.is_published ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => openEdit(t)} className="p-2 text-gray-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(t.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
