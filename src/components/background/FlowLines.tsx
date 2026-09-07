import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const TUBE_COUNT = 150;
const SEGMENTS = 80;
const BOUNDS = 20;

// Helper to calculate curl noise from 3D simplex noise
function computeCurl(
  x: number,
  y: number,
  z: number,
  noise3D: (x: number, y: number, z: number) => number
) {
  const eps = 0.0001;
  const eps2 = 2 * eps;

  const n1 = noise3D(x, y + eps, z);
  const n2 = noise3D(x, y - eps, z);
  const a = (n1 - n2) / eps2;

  const n3 = noise3D(x, y, z + eps);
  const n4 = noise3D(x, y, z - eps);
  const b = (n3 - n4) / eps2;

  const n5 = noise3D(x, y, z + eps);
  const n6 = noise3D(x, y, z - eps);
  const c = (n5 - n6) / eps2;

  const n7 = noise3D(x + eps, y, z);
  const n8 = noise3D(x - eps, y, z);
  const d = (n7 - n8) / eps2;

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

function generateStreamlineGeometry(
  noise3D: (x: number, y: number, z: number) => number,
  startX: number,
  startY: number,
  startZ: number
) {
  const points: THREE.Vector3[] = [];
  const velocities: number[] = [];

  const current = new THREE.Vector3(startX, startY, startZ);

  for (let i = 0; i < SEGMENTS; i++) {
    points.push(current.clone());

    const scale = 0.15;
    const vel = computeCurl(current.x * scale, current.y * scale, current.z * scale, noise3D);

    // Add base flow to ensure they move generally left-to-right like a wind tunnel
    vel.add(new THREE.Vector3(0.6, 0, 0));

    velocities.push(vel.length());

    // step forward
    const step = 0.25;
    current.add(vel.clone().multiplyScalar(step));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubularSegments = SEGMENTS;
  const radialSegments = 5; // Low poly tube for performance
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, 0.04, radialSegments, false);

  // Apply Vertex Colors based on velocity
  const count = (tubularSegments + 1) * (radialSegments + 1);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const velIndex = Math.floor(t * (velocities.length - 1));
    const color = getVelocityColor(velocities[velIndex]);

    for (let j = 0; j <= radialSegments; j++) {
      const idx = (i * (radialSegments + 1) + j) * 3;
      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;
    }
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export function FlowLines() {
  const groupRef = useRef<THREE.Group>(null);
  const [geometries, setGeometries] = useState<THREE.TubeGeometry[]>([]);

  // Generate geometries once on mount
  useEffect(() => {
    const noise3D = createNoise3D();
    const newGeometries: THREE.TubeGeometry[] = [];

    for (let i = 0; i < TUBE_COUNT; i++) {
      // Spread starting points across the left side of the bounding box
      const startX = (Math.random() - 0.5) * BOUNDS - BOUNDS / 2;
      const startY = (Math.random() - 0.5) * BOUNDS;
      const startZ = (Math.random() - 0.5) * BOUNDS;

      const geom = generateStreamlineGeometry(noise3D, startX, startY, startZ);
      newGeometries.push(geom);
    }

    // Defer state update to avoid cascading synchronous render in effect
    const timer = setTimeout(() => {
      setGeometries(newGeometries);
    }, 0);

    // Cleanup geometries on unmount
    return () => {
      clearTimeout(timer);
      newGeometries.forEach((g) => g.dispose());
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Slowly rotate the entire fluid simulation group to give it life
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.3;
    groupRef.current.rotation.x = Math.cos(time * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
