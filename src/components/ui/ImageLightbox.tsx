'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageInfo {
  url: string;
  alt_text?: string | null;
}

interface ImageLightboxProps {
  images: ImageInfo[];
}

export function ImageLightbox({ images }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  const openLightbox = (idx: number) => {
    setCurrentIndex(idx);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((c) => (c + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((c) => (c - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden bg-muted cursor-pointer group rounded-xl ${
              idx === 0 ? 'md:col-span-2 aspect-[16/7]' : 'aspect-[4/3]'
            }`}
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={img.url}
              alt={img.alt_text || `Gallery image ${idx + 1}`}
              fill
              sizes={idx === 0 ? '100vw' : '50vw'}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all bg-white/90 text-black p-3 rounded-full shadow-lg">
                <Maximize2 size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-4 z-50"
                onClick={prev}
                aria-label="Previous image"
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-4 z-50"
                onClick={next}
                aria-label="Next image"
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-6xl h-[80vh] mx-12 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt_text || `Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest uppercase">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
