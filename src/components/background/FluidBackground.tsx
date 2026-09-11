'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { FlowLines } from './FlowLines';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function FluidBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay slightly to let WebGL context initialize off-screen, then bloom smoothly
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[-1] pointer-events-none bg-background transition-opacity duration-1000 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Soft ambient lighting */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[10, 10, 10]} intensity={2.5} />
        <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#00aaff" />

        {/* The procedural CFD simulation */}
        <FlowLines />

        {/* Glowing neon bloom matching Image 3 */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.18} mipmapBlur intensity={0.46} radius={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
