'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Education } from '@/lib/types';
import {
  GraduationCap,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Upload,
  Loader2,
  Building2,
} from 'lucide-react';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import Image from 'next/image';

interface EducationManagerProps {
  initialEducation: Education[];
}

const EMPTY_FORM = {
  institution: '',
  degree: '',
  field_of_study: '',
  period: '',
  grade: '',
  activities: '',
  description: '',
  logo_url: '',
  sort_order: 0,
  is_published: true,
};

export function EducationManager({ initialEducation }: EducationManagerProps) {
  const supabase = createClient();
  const [educationList, setEducationList] = useState<Education[]>(initialEducation);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      sort_order: educationList.length,
    });
    setErrorMessage('');
    setShowForm(true);
  };

  const openEdit = (edu: Education) => {
    setEditing(edu);
    setForm({
      institution: edu.institution,
      degree: edu.degree ?? '',
      field_of_study: edu.field_of_study ?? '',
      period: edu.period ?? '',
      grade: edu.grade ?? '',
      activities: edu.activities ?? '',
      description: edu.description ?? '',
      logo_url: edu.logo_url ?? '',
      sort_order: edu.sort_order ?? 0,
      is_published: edu.is_published ?? true,
    });
    setErrorMessage('');
    setShowForm(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setErrorMessage('');
    try {
      const ext = file.name.split('.').pop();
      const uid = crypto.randomUUID();
      const filename = `education/${uid}.${ext}`;
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filename, file, { upsert: true });

      if (uploadError) {
        setErrorMessage('Failed to upload logo to storage: ' + uploadError.message);
      } else if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);
        setForm((prev) => ({ ...prev, logo_url: publicUrl }));
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown upload error';
      setErrorMessage(errorMsg);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.institution.trim()) {
      setErrorMessage('Institution name is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('education')
          .update(form)
          .eq('id', editing.id)
          .select()
          .single();

        if (error) {
          if (error.message.includes("Could not find the table 'public.education'")) {
            setErrorMessage(
              "Table 'education' has not been created in your Supabase database yet. Please run the SQL migration query in your Supabase SQL Editor."
            );
          } else {
            setErrorMessage(error.message);
          }
        } else if (data) {
          setEducationList((prev) =>
            prev.map((item) => (item.id === editing.id ? (data as Education) : item))
          );
          setShowForm(false);
        }
      } else {
        const id = crypto.randomUUID();
        const { data, error } = await supabase
          .from('education')
          .insert([{ ...form, id }])
          .select()
          .single();

        if (error) {
          if (error.message.includes("Could not find the table 'public.education'")) {
            setErrorMessage(
              "Table 'education' has not been created in your Supabase database yet. Please run the SQL migration query in your Supabase SQL Editor."
            );
          } else {
            setErrorMessage(error.message);
          }
        } else if (data) {
          setEducationList((prev) => [...prev, data as Education]);
          setShowForm(false);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save education record';
      setErrorMessage(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await supabase.from('education').delete().eq('id', deleteTarget);
      setEducationList((prev) => prev.filter((item) => item.id !== deleteTarget));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublish = async (edu: Education) => {
    const nextPublished = !edu.is_published;
    await supabase.from('education').update({ is_published: nextPublished }).eq('id', edu.id);
    setEducationList((prev) =>
      prev.map((item) => (item.id === edu.id ? { ...item, is_published: nextPublished } : item))
    );
  };

  const fieldClass =
    'w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground transition-colors font-sans text-sm rounded-lg';

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Education Entry?"
        description="This education record will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Education</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage institutions, degrees, certifications, and academic activities displayed in
              LinkedIn format.
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors self-start sm:self-auto"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>

        {educationList.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/40">
            <GraduationCap size={36} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold text-base mb-1">No education entries in database</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              The public site is currently displaying fallback mock data. Add your first verified
              entry here to automatically replace mock data!
            </p>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Plus size={15} /> Add First Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {edu.logo_url ? (
                      <Image
                        src={edu.logo_url}
                        alt={edu.institution}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full p-1"
                      />
                    ) : (
                      <GraduationCap size={22} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-base leading-snug">{edu.institution}</h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          edu.is_published
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                        }`}
                      >
                        {edu.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {edu.degree && (
                      <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                        {edu.degree}
                        {edu.field_of_study ? `, ${edu.field_of_study}` : ''}
                      </p>
                    )}

                    {edu.activities && (
                      <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-1">
                        {edu.activities}
                      </p>
                    )}

                    {edu.period && (
                      <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                        {edu.period}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => togglePublish(edu)}
                    title={edu.is_published ? 'Unpublish' : 'Publish'}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {edu.is_published ? (
                      <ToggleRight size={20} className="text-emerald-500" />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(edu)}
                    title="Edit"
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(edu.id)}
                    title="Delete"
                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-bold text-lg">{editing ? 'Edit Education' : 'Add Education'}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Institution */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  School / Institution <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={fieldClass}
                    placeholder="e.g. University of Colombo"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  />
                  <Building2
                    size={16}
                    className="absolute right-3 top-3 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>

              {/* Logo / Crest */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Institution Logo
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {form.logo_url ? (
                      <Image
                        src={form.logo_url}
                        alt="Logo preview"
                        width={40}
                        height={40}
                        className="object-contain w-full h-full p-1"
                      />
                    ) : (
                      <GraduationCap size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      className={fieldClass}
                      placeholder="Logo URL (or upload image below)"
                      value={form.logo_url}
                      onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded bg-background">
                        {logoUploading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Upload size={12} />
                        )}
                        <span>{logoUploading ? 'Uploading...' : 'Upload Logo File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                          disabled={logoUploading}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, logo_url: '/images/education/colombo.png' })
                        }
                        className="text-[11px] text-muted-foreground hover:text-foreground underline"
                      >
                        Use Colombo Crest
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, logo_url: '/images/education/nalanda.png' })
                        }
                        className="text-[11px] text-muted-foreground hover:text-foreground underline"
                      >
                        Use Nalanda Crest
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Degree
                </label>
                <input
                  type="text"
                  className={fieldClass}
                  placeholder="e.g. Bachelor of Engineering Technology Honours"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                />
              </div>

              {/* Field of study */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Field of Study
                </label>
                <input
                  type="text"
                  className={fieldClass}
                  placeholder="e.g. Instrumentation and Automation, Mechatronics"
                  value={form.field_of_study}
                  onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
                />
              </div>

              {/* Period */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Dates / Period
                </label>
                <input
                  type="text"
                  className={fieldClass}
                  placeholder="e.g. Jun 2022 – Jun 2026 or 2022 – Present"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                />
              </div>

              {/* Activities and Societies */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Activities and Societies
                </label>
                <input
                  type="text"
                  className={fieldClass}
                  placeholder="e.g. Activities and societies: Vice President, Aeronautical Society"
                  value={form.activities}
                  onChange={(e) => setForm({ ...form, activities: e.target.value })}
                />
              </div>

              {/* Description / Additional notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Description / Details (optional)
                </label>
                <textarea
                  rows={3}
                  className={fieldClass}
                  placeholder="Key coursework, achievements, or project details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    className={fieldClass}
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_published: !form.is_published })}
                    className="text-foreground"
                  >
                    {form.is_published ? (
                      <ToggleRight size={28} className="text-emerald-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || logoUploading}
                className="px-5 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : editing ? 'Update' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
