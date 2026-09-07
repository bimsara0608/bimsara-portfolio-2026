import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TUBE_COUNT = 90;
const SEGMENTS = 150;
const BOUNDS = 18;
const DEFAULT_SPHERE_RADIUS = 9.0;

// Analytical Potential Flow around a Sphere
function getVelocity(x: number, y: number, z: number, sphereRadius: number) {
  const U = 1.0;
  const r2 = x * x + y * y + z * z;
  const r = Math.sqrt(r2);

  // Safety check to prevent divide by zero
  if (r < 0.1) return new THREE.Vector3(U, 0, 0);

  const r5 = r2 * r2 * r;
  const coef = (U * Math.pow(sphereRadius, 3)) / 2.0;

  const vx = U + (coef * (r2 - 3 * x * x)) / r5;
  const vy = (coef * (-3 * x * y)) / r5;
  const vz = (coef * (-3 * x * z)) / r5;

  return new THREE.Vector3(vx, vy, vz);
}

// Full CFD Spectrum: Blue at screen corners (far edges), Red in the middle
function getXPositionColor(x: number, bounds: number) {
  const dist = Math.abs(x);
  const v = Math.min(Math.max(dist / bounds, 0), 1);

  const c = new THREE.Color();
  // Reverse mapping: v=0 (center) is Red, v=1 (edge) is Blue
  if (v < 0.25) {
    c.lerpColors(new THREE.Color('#ff0000'), new THREE.Color('#ffff00'), v / 0.25);
  } else if (v < 0.5) {
    c.lerpColors(new THREE.Color('#ffff00'), new THREE.Color('#00ff00'), (v - 0.25) / 0.25);
  } else if (v < 0.75) {
    c.lerpColors(new THREE.Color('#00ff00'), new THREE.Color('#00ffff'), (v - 0.5) / 0.25);
  } else {
    c.lerpColors(new THREE.Color('#00ffff'), new THREE.Color('#0000ff'), (v - 0.75) / 0.25);
  }
  return c;
}

function generateStreamlineGeometry(
  startX: number,
  startY: number,
  startZ: number,
  sphereRadius: number,
  bounds: number
) {
  const points: THREE.Vector3[] = [];
  const colorsArray: THREE.Color[] = [];
  const alphas: number[] = [];

  const current = new THREE.Vector3(startX, startY, startZ);

  for (let i = 0; i < SEGMENTS; i++) {
    // 1. CRITICAL FIX: Never let a point go inside the sphere, which causes 0 velocity and duplicate points (glitching CatmullRom)
    if (current.length() < sphereRadius) {
      current.normalize().multiplyScalar(sphereRadius + 0.1);
    }

    // 2. CRITICAL FIX: Ensure no duplicate points are pushed to CatmullRomCurve3
    const newPoint = current.clone();
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      if (newPoint.distanceTo(lastPoint) < 0.001) {
        newPoint.add(new THREE.Vector3(0.01, 0.01, 0.01)); // Tiny nudge to prevent explosion
      }
    }
    points.push(newPoint);

    const vel = getVelocity(current.x, current.y, current.z, sphereRadius);

    // Prevent massive jumps near singularity
    if (vel.length() > 2.0) {
      vel.setLength(2.0);
    }

    colorsArray.push(getXPositionColor(current.x, bounds));

    const distFromCenterXY = Math.sqrt(current.x * current.x + current.y * current.y);
    const centerFade = THREE.MathUtils.smoothstep(
      distFromCenterXY,
      sphereRadius * 0.5,
      sphereRadius * 1.1
    );
    const edgeFade = THREE.MathUtils.smoothstep(bounds - Math.abs(current.x), 0.0, 4.0);

    alphas.push(centerFade * edgeFade * 0.9); // max opacity 0.9

    const step = 0.35;
    current.add(vel.clone().multiplyScalar(step));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubularSegments = SEGMENTS - 1;
  const radialSegments = 8;
  const radius = 0.015;
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);

  const count = (tubularSegments + 1) * (radialSegments + 1);
  const colors = new Float32Array(count * 4); // RGBA

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const idxCurve = Math.min(Math.floor(t * SEGMENTS), SEGMENTS - 1);

    const color = colorsArray[idxCurve];
    const alpha = alphas[idxCurve];

    for (let j = 0; j <= radialSegments; j++) {
      const idx = (i * (radialSegments + 1) + j) * 4;
      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;
      colors[idx + 3] = alpha;
    }
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
  return geometry;
}

export function FlowLines() {
  const groupRef = useRef<THREE.Group>(null);
  const [geometries, setGeometries] = useState<THREE.TubeGeometry[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const actualTubeCount = isMobile ? 50 : TUBE_COUNT;
    const actualSphereRadius = isMobile ? DEFAULT_SPHERE_RADIUS * 0.5 : DEFAULT_SPHERE_RADIUS;
    const actualBounds = isMobile ? BOUNDS * 0.6 : BOUNDS;

    const newGeometries: THREE.TubeGeometry[] = [];

    for (let i = 0; i < actualTubeCount; i++) {
      const startX = -actualBounds;

      const r = Math.random() * (actualSphereRadius * 0.95);
      const theta = Math.random() * Math.PI * 2;
      const startY = r * Math.cos(theta) + (Math.random() - 0.5) * 0.1;
      const startZ = r * Math.sin(theta) + (Math.random() - 0.5) * 0.1;

      const geom = generateStreamlineGeometry(
        startX,
        startY,
        startZ,
        actualSphereRadius,
        actualBounds
      );
      newGeometries.push(geom);
    }

    const timer = setTimeout(() => {
      setGeometries(newGeometries);
    }, 0);

    return () => {
      clearTimeout(timer);
      newGeometries.forEach((g) => g.dispose());
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.15;
    groupRef.current.rotation.x = Math.cos(time * 0.1) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshStandardMaterial
            vertexColors
            transparent
            roughness={0.4}
            metalness={0.1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
