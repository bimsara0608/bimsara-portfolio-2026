'use client';

import { useState } from 'react';
import { Upload, X, Loader2, FileBox } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface FileUploaderProps {
  projectId: string;
  existingUrl?: string;
  onChange?: (url: string) => void;
  accept?: string;
  label?: string;
}

export function FileUploader({
  projectId,
  existingUrl = '',
  onChange,
  accept = '.glb,.gltf',
  label = '3D Model File',
}: FileUploaderProps) {
  const [url, setUrl] = useState<string>(existingUrl);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const supabase = createClient();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // Only accept 1 file for now
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/model_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, { upsert: false });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);

      setUrl(publicUrl);
      onChange?.(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setDragOver(false);
    }
  };

  const removeFile = () => {
    setUrl('');
    onChange?.('');
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-foreground text-background rounded-lg">
              <FileBox size={20} />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-foreground">Uploaded {label}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[400px]">
                {url}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
            aria-label="Remove file"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/50'
          }`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 size={32} className="animate-spin" />
              <p className="font-medium">Uploading {label}...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload size={32} />
              <p className="font-medium">Drag & drop {label} here, or click to select</p>
              <p className="text-sm">Accepts {accept.toUpperCase()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
