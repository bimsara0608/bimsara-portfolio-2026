'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Certification } from '@/lib/types';
import {
  Award,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Upload,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import Image from 'next/image';

interface CertificationManagerProps {
  initialCertifications: Certification[];
}

const EMPTY_FORM = {
  title: '',
  issuer: '',
  issue_date: '',
  credential_id: '',
  credential_url: '',
  badge_url: '',
  skills: '',
  sort_order: 0,
  is_published: true,
};

export function CertificationManager({ initialCertifications }: CertificationManagerProps) {
  const supabase = createClient();
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [badgeUploading, setBadgeUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      sort_order: certifications.length,
    });
    setErrorMessage('');
    setShowForm(true);
  };

  const openEdit = (cert: Certification) => {
    setEditing(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issue_date,
      credential_id: cert.credential_id ?? '',
      credential_url: cert.credential_url ?? '',
      badge_url: cert.badge_url ?? '',
      skills: cert.skills ?? '',
      sort_order: cert.sort_order ?? 0,
      is_published: cert.is_published ?? true,
    });
    setErrorMessage('');
    setShowForm(true);
  };

  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBadgeUploading(true);
    setErrorMessage('');
    try {
      const ext = file.name.split('.').pop();
      const uid = crypto.randomUUID();
      const filename = `certifications/${uid}.${ext}`;
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filename, file, { upsert: true });

      if (uploadError) {
        setErrorMessage('Failed to upload badge to storage: ' + uploadError.message);
      } else if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);
        setForm((prev) => ({ ...prev, badge_url: publicUrl }));
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown upload error';
      setErrorMessage(errorMsg);
    } finally {
      setBadgeUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setErrorMessage('Certification title is required.');
      return;
    }
    if (!form.issuer.trim()) {
      setErrorMessage('Issuing organization is required.');
      return;
    }
    if (!form.issue_date.trim()) {
      setErrorMessage('Issue date is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('certifications')
          .update(form)
          .eq('id', editing.id)
          .select()
          .single();

        if (error) {
          if (error.message.includes("Could not find the table 'public.certifications'")) {
            setErrorMessage(
              "Table 'certifications' has not been created in your Supabase database yet. Please run the SQL migration query in your Supabase SQL Editor."
            );
          } else {
            setErrorMessage(error.message);
          }
        } else if (data) {
          setCertifications((prev) =>
            prev.map((item) => (item.id === editing.id ? (data as Certification) : item))
          );
          setShowForm(false);
        }
      } else {
        const id = crypto.randomUUID();
        const { data, error } = await supabase
          .from('certifications')
          .insert([{ ...form, id }])
          .select()
          .single();

        if (error) {
          if (error.message.includes("Could not find the table 'public.certifications'")) {
            setErrorMessage(
              "Table 'certifications' has not been created in your Supabase database yet. Please run the SQL migration query in your Supabase SQL Editor."
            );
          } else {
            setErrorMessage(error.message);
          }
        } else if (data) {
          setCertifications((prev) => [...prev, data as Certification]);
          setShowForm(false);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save certification';
      setErrorMessage(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await supabase.from('certifications').delete().eq('id', deleteTarget);
      setCertifications((prev) => prev.filter((item) => item.id !== deleteTarget));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublish = async (cert: Certification) => {
    const nextPublished = !cert.is_published;
    await supabase.from('certifications').update({ is_published: nextPublished }).eq('id', cert.id);
    setCertifications((prev) =>
      prev.map((item) => (item.id === cert.id ? { ...item, is_published: nextPublished } : item))
    );
  };

  const fieldClass =
    'w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground transition-colors font-sans text-sm rounded-lg';

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Certification Entry?"
        description="This certification record will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Licenses & Certifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage professional certifications, digital badges, and verification links displayed
              in the horizontal marquee on your portfolio.
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors self-start sm:self-auto"
          >
            <Plus size={16} />
            Add Certification
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/40">
            <Award size={36} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold text-base mb-1">No certifications in database</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              The public site is currently displaying fallback mock data (CSWP). Add your first
              certification here or run the SQL migration to seed it!
            </p>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Plus size={15} /> Add First Certification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-sm">
                    {cert.badge_url ? (
                      <Image
                        src={cert.badge_url}
                        alt={cert.title}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full p-1"
                      />
                    ) : (
                      <Award size={22} className="text-zinc-800" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base text-foreground leading-snug truncate">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground font-mono">
                      <span>{cert.issue_date}</span>
                      {cert.credential_id && (
                        <>
                          <span>•</span>
                          <span>ID: {cert.credential_id}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Sort: {cert.sort_order}</span>
                    </div>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 mt-2 font-medium transition-colors"
                      >
                        Show credential <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-border w-full md:w-auto justify-end">
                  <button
                    onClick={() => togglePublish(cert)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      cert.is_published
                        ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'border-border text-muted-foreground bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {cert.is_published ? (
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
                    onClick={() => openEdit(cert)}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                    title="Edit Certification"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cert.id)}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                    title="Delete Certification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {editing ? 'Edit Certification' : 'Add Certification'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Provide certificate credentials, digital badge, and verification links.
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

              {/* Title & Issuer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Certified SOLIDWORKS Professional (CSWP)"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={form.issuer}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    placeholder="e.g. Dassault Systèmes"
                    className={fieldClass}
                    required
                  />
                </div>
              </div>

              {/* Issue Date & Credential ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Issue Date *
                  </label>
                  <input
                    type="text"
                    value={form.issue_date}
                    onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                    placeholder="e.g. Issued May 2026"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={form.credential_id}
                    onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
                    placeholder="e.g. C-29RCXDMEHU"
                    className={fieldClass}
                  />
                </div>
              </div>

              {/* Credential URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={form.credential_url}
                  onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
                  placeholder="https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-29RCXDMEHU"
                  className={fieldClass}
                />
              </div>

              {/* Badge Image / Logo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Digital Badge / Logo Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-sm">
                    {form.badge_url ? (
                      <Image
                        src={form.badge_url}
                        alt="Badge Preview"
                        width={48}
                        height={48}
                        className="object-contain w-full h-full p-1"
                      />
                    ) : (
                      <Award size={24} className="text-zinc-800" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-lg text-xs font-medium border border-border transition-colors">
                      {badgeUploading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      Upload Badge Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBadgeUpload}
                        disabled={badgeUploading}
                      />
                    </label>
                    <input
                      type="text"
                      value={form.badge_url}
                      onChange={(e) => setForm({ ...form, badge_url: e.target.value })}
                      placeholder="Or enter direct image path / URL (e.g. /images/certifications/cswp.png)"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Associated Skills
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. 3D Modeling, CAD Design, Parametric Modeling"
                  className={fieldClass}
                />
              </div>

              {/* Sort Order & Visible */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-border">
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

                <div className="pt-4">
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
