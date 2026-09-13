'use client';

import { useEffect, useState } from 'react';

interface ModelViewerProps {
  src: string;
  alt?: string;
}

export function ModelViewer({ src, alt }: ModelViewerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Dynamically import the web component so it only runs on the client
    import('@google/model-viewer').then(() => setIsMounted(true)).catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="w-full h-[400px] bg-[#111114] flex items-center justify-center border border-dashed border-white/15 rounded-xl">
        <span className="text-zinc-400 text-sm font-medium">Failed to load 3D viewer.</span>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-[#111114] animate-pulse flex items-center justify-center border border-white/10 rounded-xl">
        <span className="text-zinc-400 text-sm font-medium">Loading Interactive 3D Model...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-[#111114] border border-white/10 rounded-xl overflow-hidden relative group shadow-xl">
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-zinc-300 uppercase tracking-wider">
        Interactive 3D
      </div>
      {/* @ts-expect-error - Custom element not known to React types */}
      <model-viewer
        src={src}
        alt={alt || '3D Model'}
        auto-rotate
        camera-controls
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="0.5"
        environment-image="neutral"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          outline: 'none',
          filter: 'brightness(0.75) contrast(1.1) drop-shadow(0px 10px 20px rgba(0,0,0,0.25))',
        }}
      >
        {/* @ts-expect-error - Custom element closing tag not known to React */}
      </model-viewer>
      <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1.5 text-xs rounded-full pointer-events-none">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
