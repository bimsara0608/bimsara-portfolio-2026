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
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
        <span className="text-muted">Failed to load 3D viewer.</span>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-900 animate-pulse flex items-center justify-center border border-gray-200 dark:border-gray-800">
        <span className="text-muted font-medium">Loading Interactive 3D Model...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-muted uppercase tracking-wider">
        Interactive 3D
      </div>
      {/* @ts-expect-error - Custom element not known to React types */}
      <model-viewer
        src={src}
        alt={alt || '3D Model'}
        auto-rotate
        camera-controls
        shadow-intensity="2"
        shadow-softness="1"
        exposure="0.8"
        environment-image="legacy"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent', outline: 'none' }}
      >
        {/* @ts-expect-error - Custom element closing tag not known to React */}
      </model-viewer>
      <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1.5 text-xs rounded-full pointer-events-none">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
