'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { FlowLines } from './FlowLines';
import { PreloaderOverlay, type PreloaderPhase } from './PreloaderOverlay';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Map the 4-state overlay phase down to the 3-state FlowLines phase
function toFlowPhase(phase: PreloaderPhase): 'loading' | 'flying' | 'done' {
  if (phase === 'loading') return 'loading';
  if (phase === 'flying') return 'flying';
  return 'done'; // settling + done both map to done
}

export function FluidBackground() {
  // Read sessionStorage synchronously via lazy initializer so we never render
  // an unnecessary loading frame on second visits (avoids calling setState in an effect).
  const [phase, setPhase] = useState<PreloaderPhase>(() => {
    if (typeof window === 'undefined') return 'loading';
    try {
      if (sessionStorage.getItem('preloader-played')) return 'done';
    } catch {
      // sessionStorage blocked (private browsing edge case) — just play it
    }
    return 'loading';
  });

  useEffect(() => {
    // If sessionStorage said 'done' from the start, nothing to schedule
    if (phase === 'done') return;

    // Sequence timings:
    //  0ms  → loading  (splines spin, drone hidden, black overlay)
    // 1000ms → flying   (drone flies in from right, splines settle)
    // 2200ms → settling (overlay fades out)
    // 2800ms → done     (overlay gone, normal scroll-driven hero)
    const t1 = setTimeout(() => setPhase('flying'), 1000);
    const t2 = setTimeout(() => setPhase('settling'), 2200);
    const t3 = setTimeout(() => {
      setPhase('done');
      try {
        sessionStorage.setItem('preloader-played', '1');
      } catch {}
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
