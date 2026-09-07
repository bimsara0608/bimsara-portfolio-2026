'use client';

import { Canvas } from '@react-three/fiber';
import { FlowLines } from './FlowLines';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function FluidBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Soft ambient lighting */}
        <ambientLight intensity={1.5} />

        {/* The procedural CFD simulation */}
        <FlowLines />

        {/* Post-processing: Add a subtle glow (bloom) to the high-velocity particles */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.2} radius={0.4} />
        </EffectComposer>
      </Canvas>

      {/* Optional gradient overlay to blend into the bottom/top of the site if needed */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
    </div>
  );
}
