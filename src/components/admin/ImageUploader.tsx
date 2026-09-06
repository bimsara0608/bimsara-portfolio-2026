'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Star, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface UploadedImage {
  url: string;
  is_hero: boolean;
}

interface ImageUploaderProps {
  projectId: string;
  existingImages?: UploadedImage[];
  onChange?: (images: UploadedImage[]) => void;
}

export function ImageUploader({ projectId, existingImages = [], onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const supabase = createClient();

  const uploadFile = useCallback(
    async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, { upsert: false });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);

      return publicUrl;
    },
    [projectId, supabase]
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const newImages: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const url = await uploadFile(file);
        newImages.push({ url, is_hero: images.length === 0 && newImages.length === 0 });
      }

      const updated = [...images, ...newImages];
      setImages(updated);
      onChange?.(updated);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const setHero = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, is_hero: i === index }));
    setImages(updated);
    onChange?.(updated);
  };

  const removeImage = async (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If removed image was hero, make first image the hero
    if (images[index].is_hero && updated.length > 0) {
      updated[0].is_hero = true;
    }
    setImages(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/50'
        }`}
        onClick={() => document.getElementById('image-input')?.click()}
      >
        <input
          id="image-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 size={32} className="animate-spin" />
            <p className="font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload size={32} />
            <p className="font-medium">Drag & drop images here, or click to select</p>
            <p className="text-sm">PNG, JPG, WEBP supported</p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group aspect-[4/3] bg-muted rounded-lg overflow-hidden border border-border"
            >
              <Image src={img.url} alt={`Upload ${idx + 1}`} fill className="object-cover" />

              {/* Hero Badge */}
              {img.is_hero && (
                <div className="absolute top-2 left-2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> Hero
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {!img.is_hero && (
                  <button
                    type="button"
                    onClick={() => setHero(idx)}
                    className="bg-background text-foreground text-xs font-bold px-3 py-1.5 rounded-full hover:bg-muted transition-colors flex items-center gap-1"
                  >
                    <Star size={12} /> Set Hero
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
