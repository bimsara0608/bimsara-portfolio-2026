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
        <ambientLight intensity={2.0} />
        <directionalLight position={[10, 10, 10]} intensity={2.5} />
        <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#00aaff" />

        {/* The procedural CFD simulation */}
        <FlowLines />

        {/* Restore subtle bloom as requested */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.5} radius={0.3} />
        </EffectComposer>
      </Canvas>

      {/* Optional gradient overlay to blend into the bottom/top of the site if needed */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background pointer-events-none" />
    </div>
  );
}
