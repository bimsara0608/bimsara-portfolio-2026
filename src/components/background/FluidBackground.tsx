'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { FlowLines } from './FlowLines';
import { PreloaderOverlay, type PreloaderPhase } from './PreloaderOverlay';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Module-level flag: resets on every hard page load, but persists for the
// lifetime of the SPA session (FluidBackground stays mounted in the layout).
let _preloaderDone = false;

// Map the 4-state overlay phase down to the 3-state FlowLines phase
function toFlowPhase(phase: PreloaderPhase): 'loading' | 'flying' | 'done' {
  if (phase === 'loading') return 'loading';
  if (phase === 'flying') return 'flying';
  return 'done';
}

export function FluidBackground() {
  const [phase, setPhase] = useState<PreloaderPhase>(_preloaderDone ? 'done' : 'loading');

  useEffect(() => {
    // Already done (SPA navigation re-mount edge case) — nothing to schedule
    if (_preloaderDone) return;

    // Sequence timings:
    //  0ms   → loading  (splines spin as a CFD vortex, drone hidden, black overlay)
    //  1000ms → flying   (drone flies in from the right, scene transitions to hero pose)
    //  2200ms → settling (black overlay fades out)
    //  2800ms → done     (overlay gone, normal scroll-driven hero takes over)
    const t1 = setTimeout(() => setPhase('flying'), 1000);
    const t2 = setTimeout(() => setPhase('settling'), 2200);
    const t3 = setTimeout(() => {
      setPhase('done');
      _preloaderDone = true;
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      {/* Three.js CFD canvas — fixed background, always below page content */}
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

          {/* The procedural CFD simulation — receives preload phase */}
          <FlowLines preloadPhase={toFlowPhase(phase)} />

          {/* Glowing neon bloom matching Image 3 */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.18} mipmapBlur intensity={0.46} radius={0.3} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Preloader overlay — sits on top of everything at z-[100] */}
      <PreloaderOverlay phase={phase} />
    </>
  );
}
