import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TUBE_COUNT = 180;
const SEGMENTS = 100;
const BOUNDS = 25;
const SPHERE_RADIUS = 6.0;

// Analytical Potential Flow around a Sphere
// This gives perfectly smooth laminar CFD streamlines
function getVelocity(x: number, y: number, z: number) {
  const U = 1.0; // Free stream velocity
  const r2 = x * x + y * y + z * z;
  const r = Math.sqrt(r2);

  // Inside the object
  if (r < SPHERE_RADIUS * 0.99) {
    return new THREE.Vector3(0, 0, 0);
  }

  const r5 = r2 * r2 * r;
  const coef = (U * Math.pow(SPHERE_RADIUS, 3)) / 2.0;

  // Velocity field equations for flow past a sphere
  const vx = U + (coef * (r2 - 3 * x * x)) / r5;
  const vy = (coef * (-3 * x * y)) / r5;
  const vz = (coef * (-3 * x * z)) / r5;

  return new THREE.Vector3(vx, vy, vz);
}

// Map velocity to CFD colors (Blue -> Green -> Yellow -> Red)
function getVelocityColor(velocity: number) {
  // Potential flow max velocity is 1.5 * U at the equator
  const v = Math.min(Math.max(velocity / 1.5, 0), 1);

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

function generateStreamlineGeometry(startX: number, startY: number, startZ: number) {
  const points: THREE.Vector3[] = [];
  const velocities: number[] = [];
  const alphas: number[] = [];

  const current = new THREE.Vector3(startX, startY, startZ);

  for (let i = 0; i < SEGMENTS; i++) {
    points.push(current.clone());

    const vel = getVelocity(current.x, current.y, current.z);
    velocities.push(vel.length());

    // Alpha calculation to protect the text in the middle and avoid hard edges
    // Fade out near the center of the screen (x, y close to 0, in front of the sphere)
    const distFromCenter = Math.sqrt(current.x * current.x + current.y * current.y);
    let centerFade = 1.0;
    if (current.z > 0) {
      // Only fade the tubes passing in front of the text
      centerFade = THREE.MathUtils.smoothstep(distFromCenter, 3.0, 9.0);
    }

    // Fade at the extreme X edges so they smoothly appear/disappear
    const edgeFade = THREE.MathUtils.smoothstep(BOUNDS - Math.abs(current.x), 0.0, 5.0);

    alphas.push(centerFade * edgeFade * 0.9); // max opacity 0.9

    // Step forward along the velocity vector
    const step = 0.5;
    current.add(vel.clone().multiplyScalar(step));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubularSegments = SEGMENTS - 1;
  const radialSegments = 8; // High res tube to avoid boxy look
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, 0.05, radialSegments, false);

  // Apply RGBA Vertex Colors based on velocity and calculated alpha
  const count = (tubularSegments + 1) * (radialSegments + 1);
  const colors = new Float32Array(count * 4); // RGBA

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const idxCurve = Math.min(Math.floor(t * SEGMENTS), SEGMENTS - 1);

    const vel = velocities[idxCurve];
    const alpha = alphas[idxCurve];
    const color = getVelocityColor(vel);

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
    const newGeometries: THREE.TubeGeometry[] = [];

    for (let i = 0; i < TUBE_COUNT; i++) {
      // Start far upstream (left side of bounds)
      const startX = -BOUNDS;

      // Spread Y and Z in a circle upstream
      const r = Math.random() * (SPHERE_RADIUS + 8);
      const theta = Math.random() * Math.PI * 2;
      const startY = r * Math.cos(theta);
      const startZ = r * Math.sin(theta);

      const geom = generateStreamlineGeometry(startX, startY, startZ);
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
    // Slowly sway the entire wind tunnel to give it a dynamic feel
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.15;
    groupRef.current.rotation.x = Math.cos(time * 0.1) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          {/* Use MeshStandardMaterial with vertexColors for 3D high-res shading */}
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
