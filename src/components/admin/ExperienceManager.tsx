'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Experience } from '@/lib/types';
import {
  Briefcase,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface ExperienceManagerProps {
  initialExperiences: Experience[];
}

const EMPTY_FORM = {
  title: '',
  company: '',
  period: '',
  desc: '',
  active: false,
  sort_order: 0,
  is_published: true,
};

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const supabase = createClient();
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      sort_order: experiences.length,
    });
    setErrorMessage('');
    setShowForm(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      desc: exp.desc,
      active: exp.active ?? false,
      sort_order: exp.sort_order ?? 0,
      is_published: exp.is_published ?? true,
    });
    setErrorMessage('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setErrorMessage('Role / Title is required.');
      return;
    }
    if (!form.company.trim()) {
      setErrorMessage('Company / Organization is required.');
      return;
    }
    if (!form.period.trim()) {
      setErrorMessage('Period / Date is required.');
      return;
    }
    if (!form.desc.trim()) {
      setErrorMessage('Description is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('experiences')
          .update(form)
          .eq('id', editing.id)
          .select()
          .single();

        if (error) {
          if (error.message.includes("Could not find the table 'public.experiences'")) {
            setErrorMessage(
              "Table 'experiences' has not been created in your Supabase database yet. Please run the SQL migration query in your Supabase SQL Editor."
            );
          } else {
            setErrorMessage(error.message);
          }
        } else if (data) {
          setExperiences((prev) =>
            prev.map((item) => (item.id === editing.id ? (data as Experience) : item))
          );
          setShowForm(false);
        }
      } else {
        const id = crypto.randomUUID();
        const { data, error } = await supabase
          .from('experiences')
          .insert([{ ...form, id }])
          .select()
          .single();

        if (error) {
          if (error.message.includes("Could not find the table 'public.experiences'")) {
            setErrorMessage(
              "Table 'experiences' has not been created in your Supabase database yet. Please run the SQL migration query in your Supabase SQL Editor."
            );
          } else {
            setErrorMessage(error.message);
          }
        } else if (data) {
          setExperiences((prev) => [...prev, data as Experience]);
          setShowForm(false);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save experience record';
      setErrorMessage(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await supabase.from('experiences').delete().eq('id', deleteTarget);
      setExperiences((prev) => prev.filter((item) => item.id !== deleteTarget));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublish = async (exp: Experience) => {
    const nextPublished = !exp.is_published;
    await supabase.from('experiences').update({ is_published: nextPublished }).eq('id', exp.id);
    setExperiences((prev) =>
      prev.map((item) => (item.id === exp.id ? { ...item, is_published: nextPublished } : item))
    );
  };

  const fieldClass =
    'w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground transition-colors font-sans text-sm rounded-lg';

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Experience Entry?"
        description="This experience record will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Verified Experience</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage professional roles, companies, timeframes, and project descriptions displayed
              in the About section.
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors self-start sm:self-auto"
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>

        {experiences.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/40">
            <Briefcase size={36} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold text-base mb-1">No experience entries in database</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              The public site is currently displaying fallback mock data. Run the Supabase SQL
              migration or add your first verified experience here!
            </p>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Plus size={15} /> Add First Experience
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg border border-border bg-muted/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase size={18} className="text-foreground/70" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-base text-foreground truncate">
                        {exp.title}
                      </h3>
                      {exp.active && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={11} /> Current Role
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/80">{exp.company}</span>
                      <span>•</span>
                      <span className="font-mono">{exp.period}</span>
                      <span>•</span>
                      <span>Sort: {exp.sort_order}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed text-justify line-clamp-3">
                      {exp.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-border w-full md:w-auto justify-end">
                  <button
                    onClick={() => togglePublish(exp)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      exp.is_published
                        ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'border-border text-muted-foreground bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {exp.is_published ? (
                      <>
                        <ToggleRight size={14} /> Published
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={14} /> Draft
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openEdit(exp)}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                    title="Edit Experience"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(exp.id)}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                    title="Delete Experience"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Experience Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {editing ? 'Edit Experience' : 'Add Experience'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the professional experience details below.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              {errorMessage && (
                <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs leading-relaxed">
                  {errorMessage}
                </div>
              )}

              {/* Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Design Engineer"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Freelance or MAS Bodyline"
                    className={fieldClass}
                    required
                  />
                </div>
              </div>

              {/* Period & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Period / Timeframe *
                  </label>
                  <input
                    type="text"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="e.g. 2023 – Present or Process Innovation"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })
                    }
                    placeholder="0"
                    className={fieldClass}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Lower numbers appear first.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Summarize key responsibilities, deliverables, and engineering highlights..."
                  className={fieldClass}
                  required
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  This text will automatically be justified across screen sizes on the public site.
                </p>
              </div>

              {/* Flags: Current role & Published */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="font-medium text-foreground">Current / Ongoing Role</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="font-medium text-foreground">Visible on Public Site</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-xs font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isSaving && <Loader2 size={13} className="animate-spin" />}
                {editing ? 'Save Changes' : 'Create Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
