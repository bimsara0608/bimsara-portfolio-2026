'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

// Constants for our fluid simulation
const PARTICLE_COUNT = 3000;
const MAX_LIFETIME = 150; // frames
const BOUNDS = 15; // The box size they spawn in

// Helper to calculate curl noise from 3D simplex noise
function computeCurl(
  x: number,
  y: number,
  z: number,
  noise3D: (x: number, y: number, z: number) => number
) {
  const eps = 0.0001;
  const eps2 = 2 * eps;

  // Find rate of change in YZ plane
  const n1 = noise3D(x, y + eps, z);
  const n2 = noise3D(x, y - eps, z);
  const a = (n1 - n2) / eps2;

  const n3 = noise3D(x, y, z + eps);
  const n4 = noise3D(x, y, z - eps);
  const b = (n3 - n4) / eps2;

  // Find rate of change in XZ plane
  const n5 = noise3D(x, y, z + eps);
  const n6 = noise3D(x, y, z - eps);
  const c = (n5 - n6) / eps2;

  const n7 = noise3D(x + eps, y, z);
  const n8 = noise3D(x - eps, y, z);
  const d = (n7 - n8) / eps2;

  // Find rate of change in XY plane
  const n9 = noise3D(x + eps, y, z);
  const n10 = noise3D(x - eps, y, z);
  const e = (n9 - n10) / eps2;

  const n11 = noise3D(x, y + eps, z);
  const n12 = noise3D(x, y - eps, z);
  const f = (n11 - n12) / eps2;

  return new THREE.Vector3(a - b, c - d, e - f);
}

// Map velocity to CFD colors (Blue -> Green -> Yellow -> Red)
function getVelocityColor(velocity: number) {
  const v = Math.min(Math.max(velocity * 8, 0), 1); // Normalize velocity

  const c = new THREE.Color();
  if (v < 0.25) {
    c.lerpColors(new THREE.Color('#0000ff'), new THREE.Color('#00ffff'), v / 0.25);
  } else if (v < 0.5) {
    c.lerpColors(new THREE.Color('#00ffff'), new THREE.Color('#00ff00'), (v - 0.25) / 0.25);
  } else if (v < 0.75) {
    c.lerpColors(new THREE.Color('#00ff00'), new THREE.Color('#ffff00'), (v - 0.5) / 0.25);
  } else {
    c.lerpColors(new THREE.Color('#ffff00'), new THREE.Color('#ff0000'), (v - 0.75) / 0.25);
  }
  return c;
}

let particleData: {
  positions: Float32Array;
  colors: Float32Array;
  lifetimes: Float32Array;
  noise3D: (x: number, y: number, z: number) => number;
} | null = null;

function getParticleData() {
  if (particleData) return particleData;

  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const life = new Float32Array(PARTICLE_COUNT);
  const noise = createNoise3D();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * BOUNDS;
    pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS;
    pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS;

    col[i * 3] = 0;
    col[i * 3 + 1] = 0;
    col[i * 3 + 2] = 1; // start blue

    life[i] = Math.random() * MAX_LIFETIME;
  }

  particleData = { positions: pos, colors: col, lifetimes: life, noise3D: noise };
  return particleData;
}

// Pre-initialize data outside react render
getParticleData();

export function FlowLines() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current || !particleData) return;

    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = posAttr.array[i * 3];
      let y = posAttr.array[i * 3 + 1];
      let z = posAttr.array[i * 3 + 2];

      particleData.lifetimes[i]--;

      // Respawn particle if it dies or goes out of bounds
      if (
        particleData.lifetimes[i] <= 0 ||
        Math.abs(x) > BOUNDS ||
        Math.abs(y) > BOUNDS ||
        Math.abs(z) > BOUNDS
      ) {
        x = (Math.random() - 0.5) * BOUNDS;
        y = (Math.random() - 0.5) * BOUNDS;
        z = (Math.random() - 0.5) * BOUNDS;
        particleData.lifetimes[i] = MAX_LIFETIME;
      } else {
        // Calculate curl noise at this position
        // We multiply position by a frequency scale, and add time to animate it
        const scale = 0.2;
        const velocity = computeCurl(
          x * scale,
          y * scale,
          z * scale + time * 0.1,
          particleData.noise3D
        );

        // Add a base flow direction (e.g., flowing from left to right like a wind tunnel)
        velocity.add(new THREE.Vector3(0.5, 0, 0));

        // Update position
        const speedMultiplier = 0.03;
        x += velocity.x * speedMultiplier;
        y += velocity.y * speedMultiplier;
        z += velocity.z * speedMultiplier;

        // Update color based on speed magnitude
        const speed = velocity.length();
        const color = getVelocityColor(speed);
        colAttr.array[i * 3] = color.r;
        colAttr.array[i * 3 + 1] = color.g;
        colAttr.array[i * 3 + 2] = color.b;
      }

      posAttr.array[i * 3] = x;
      posAttr.array[i * 3 + 1] = y;
      posAttr.array[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Slow camera rotation
    pointsRef.current.rotation.y = Math.sin(time * 0.1) * 0.2;
    pointsRef.current.rotation.x = Math.cos(time * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          args={[particleData!.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          args={[particleData!.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
