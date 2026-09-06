'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Profile } from '@/lib/types';
import { Save, Loader2, User, Link2, FileText } from 'lucide-react';
import Image from 'next/image';

interface ProfileEditorProps {
  initialProfile: Profile | null;
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile>(
    initialProfile ?? {
      id: crypto.randomUUID(),
      name: 'Bimsara Gunawardana',
      title: 'Design Engineer',
      tagline: 'Design Engineer | Product Design & 3D Animation',
      bio: '',
      email: 'hello@bimsara.com',
      location: 'Colombo, Sri Lanka',
      linkedin_url: 'https://linkedin.com/in/bimsara',
      github_url: 'https://github.com/bimsara0608',
      grabcad_url: '',
      resume_url: '',
      avatar_url: '',
      stat_projects: '60+',
      stat_experience: '3+',
      stat_certification: 'CSWP',
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  const update = (key: keyof Profile, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const ext = file.name.split('.').pop();
    const { data, error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(`profile/avatar.${ext}`, file, { upsert: true });
    if (!uploadError && data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);
      update('avatar_url', publicUrl);
    }
    setAvatarUploading(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    const { data, error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload('profile/resume.pdf', file, { upsert: true });
    if (!uploadError && data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);
      update('resume_url', publicUrl);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    const { error: upsertError } = await supabase.from('profiles').upsert([profile]);
    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setIsSaving(false);
  };

  const fieldClass =
    'w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors font-medium rounded-lg';
  const labelClass = 'block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider';

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors disabled:opacity-70 ${
            saved ? 'bg-green-600 text-white' : 'bg-foreground text-background hover:opacity-90'
          }`}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Avatar */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-2">
          <User size={18} className="text-muted-foreground" />
          <h2 className="font-bold text-lg">Avatar & Identity</h2>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex-shrink-0 border-2 border-border">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {profile.name?.[0]}
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer bg-muted hover:bg-muted/80 border border-border px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
              {avatarUploading ? <Loader2 size={14} className="animate-spin" /> : null}
              {avatarUploading ? 'Uploading...' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Square image recommended. PNG, JPG, WEBP.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              value={profile.name ?? ''}
              onChange={(e) => update('name', e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Professional Title</label>
            <input
              value={profile.title ?? ''}
              onChange={(e) => update('title', e.target.value)}
              className={fieldClass}
              placeholder="Design Engineer"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Tagline</label>
          <input
            value={profile.tagline ?? ''}
            onChange={(e) => update('tagline', e.target.value)}
            className={fieldClass}
            placeholder="Design Engineer | Product Design & 3D Animation"
          />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Bio</label>
          <textarea
            value={profile.bio ?? ''}
            onChange={(e) => update('bio', e.target.value)}
            rows={4}
            className={`${fieldClass} resize-none`}
            placeholder="Tell visitors about yourself..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              value={profile.email ?? ''}
              onChange={(e) => update('email', e.target.value)}
              className={fieldClass}
              type="email"
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              value={profile.location ?? ''}
              onChange={(e) => update('location', e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-bold text-lg mb-4">Homepage Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Projects Stat</label>
            <input
              value={profile.stat_projects ?? ''}
              onChange={(e) => update('stat_projects', e.target.value)}
              className={fieldClass}
              placeholder="60+"
            />
          </div>
          <div>
            <label className={labelClass}>Experience Stat</label>
            <input
              value={profile.stat_experience ?? ''}
              onChange={(e) => update('stat_experience', e.target.value)}
              className={fieldClass}
              placeholder="3+"
            />
          </div>
          <div>
            <label className={labelClass}>Certification</label>
            <input
              value={profile.stat_certification ?? ''}
              onChange={(e) => update('stat_certification', e.target.value)}
              className={fieldClass}
              placeholder="CSWP"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={18} className="text-muted-foreground" />
          <h2 className="font-bold text-lg">Social Links</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              value={profile.linkedin_url ?? ''}
              onChange={(e) => update('linkedin_url', e.target.value)}
              className={fieldClass}
              type="url"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              value={profile.github_url ?? ''}
              onChange={(e) => update('github_url', e.target.value)}
              className={fieldClass}
              type="url"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className={labelClass}>GrabCAD URL</label>
            <input
              value={profile.grabcad_url ?? ''}
              onChange={(e) => update('grabcad_url', e.target.value)}
              className={fieldClass}
              type="url"
              placeholder="https://grabcad.com/..."
            />
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-muted-foreground" />
          <h2 className="font-bold text-lg">Resume / CV</h2>
        </div>
        {profile.resume_url && (
          <a
            href={profile.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline text-sm font-medium mb-3 inline-block"
          >
            View current resume →
          </a>
        )}
        <label className="cursor-pointer bg-muted hover:bg-muted/80 border border-border px-4 py-2.5 rounded-lg text-sm font-medium transition-colors inline-block">
          Upload PDF Resume
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="hidden"
          />
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          PDF format only. This will be available as a download link.
        </p>
      </div>
    </div>
  );
}
