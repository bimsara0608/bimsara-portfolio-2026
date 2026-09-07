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

        {/* Glowing neon bloom matching Image 3 */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.18} mipmapBlur intensity={0.46} radius={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
