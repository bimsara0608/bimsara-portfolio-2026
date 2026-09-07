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
  bounds: number,
  fadeBoxWidth: number,
  fadeBoxHeight: number
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

    // Rectangular bounding box fade!
    // This perfectly matches the shape of the text without making the whole screen dark.
    // It calculates the distance from a rounded rectangle.
    const dx = Math.max(0, Math.abs(current.x) - fadeBoxWidth);
    const dy = Math.max(0, Math.abs(current.y) - fadeBoxHeight);
    const distFromBox = Math.sqrt(dx * dx + dy * dy);

    // Fade over 5 units outside the box, restoring original brightness levels
    const centerFade = THREE.MathUtils.smoothstep(distFromBox, 0.5, 5.5);

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
  const scrollYRef = useRef(0);
  const currentScrollRot = useRef(0);

  useEffect(() => {
    // Scroll listener for the rotation effect
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const isMobile = window.innerWidth < 768;
    const actualTubeCount = isMobile ? 50 : TUBE_COUNT;
    const actualSphereRadius = isMobile ? DEFAULT_SPHERE_RADIUS * 0.5 : DEFAULT_SPHERE_RADIUS;
    const actualBounds = isMobile ? BOUNDS * 0.6 : BOUNDS;

    // Adapt the dark area exactly to the shape of the text.
    // Desktop text is wide and short. Mobile text is narrower and taller.
    const fadeBoxWidth = isMobile ? 3.0 : 7.0;
    const fadeBoxHeight = isMobile ? 3.0 : 1.5;

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
        actualBounds,
        fadeBoxWidth,
        fadeBoxHeight
      );
      newGeometries.push(geom);
    }

    const timer = setTimeout(() => {
      setGeometries(newGeometries);
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      newGeometries.forEach((g) => g.dispose());
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const maxRotation = Math.PI / 3;

    // REVERSED: at scroll=0 splines are pushed RIGHT. As user scrolls they come to center.
    // targetScrollRot goes from +maxRotation (scroll=0, right) to 0 (fully scrolled)
    const scrollProgress = Math.min(scrollYRef.current / 800, 1);
    const targetScrollRot = maxRotation * (1 - scrollProgress);

    currentScrollRot.current = THREE.MathUtils.lerp(
      currentScrollRot.current,
      targetScrollRot,
      delta * 5.0
    );

    const time = performance.now() / 1000;
    // Combine idle sway with the scroll rotation
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.15 + currentScrollRot.current;
    groupRef.current.rotation.x = Math.cos(time * 0.1) * 0.05;

    // Push back slightly to prevent clipping at extremes
    groupRef.current.position.z = -Math.abs(currentScrollRot.current) * 8.0;
    // At top: shift right (+x). At center: return to 0.
    groupRef.current.position.x = currentScrollRot.current * 2.5;
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
