import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const TUBE_COUNT = 96;
const SEGMENTS = 205;
const BOUNDS = 34;

// Analytical Aerodynamic CFD Flow field around the drone (scaled to match drone)
function getDroneAeroVelocity(x: number, y: number, z: number) {
  const U = 1.0;
  let vx = U;
  let vy = 0;
  let vz = 0;

  // 1. Upper Canopy Deflection (centered at y = +1.4, front at x = -0.5)
  const cy = 1.4;
  const cx = -0.5;
  const dx1 = (x - cx) / 3.0;
  const dy1 = (y - cy) / 1.4;
  const dz1 = z / 2.6;
  const r1_sq = dx1 * dx1 + dy1 * dy1 + dz1 * dz1 + 0.3;
  const r1 = Math.sqrt(r1_sq);

  if (r1 < 4.5) {
    const r1_5 = r1_sq * r1_sq * r1;
    const coef1 = 0.45;
    vx += (coef1 * (r1_sq - 3 * dx1 * dx1)) / r1_5;
    vy += (coef1 * (-3 * dx1 * dy1)) / r1_5;
    vz += (coef1 * (-3 * dx1 * dz1)) / r1_5;
  }

  // 2. Lower Cargo, Battery & Landing Skids Deflection (centered at y = -0.8)
  const by = -0.8;
  const bx = 0.0;
  const dx2 = (x - bx) / 3.8;
  const dy2 = (y - by) / 1.8;
  const dz2 = z / 2.6;
  const r2_sq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2 + 0.3;
  const r2 = Math.sqrt(r2_sq);

  if (r2 < 4.5) {
    const r2_5 = r2_sq * r2_sq * r2;
    const coef2 = 0.42;
    vx += (coef2 * (r2_sq - 3 * dx2 * dx2)) / r2_5;
    vy += (coef2 * (-3 * dx2 * dy2)) / r2_5;
    vz += (coef2 * (-3 * dx2 * dz2)) / r2_5;
  }

  // 3. Four Rotor Arm Hubs at (±3.2, +0.6, ±3.2) with softened denominator to prevent loops
  const armX = 3.2;
  const armZ = 3.2;
  const motorPositions = [
    { x: -armX, y: 0.6, z: -armZ },
    { x: -armX, y: 0.6, z: armZ },
    { x: armX, y: 0.6, z: -armZ },
    { x: armX, y: 0.6, z: armZ },
  ];

  for (const pos of motorPositions) {
    const dxm = (x - pos.x) / 1.1;
    const dym = (y - pos.y) / 0.8;
    const dzm = (z - pos.z) / 1.1;
    const rm_sq = dxm * dxm + dym * dym + dzm * dzm + 0.5; // Softening factor prevents singularities
    const rm = Math.sqrt(rm_sq);
    if (rm < 3.0) {
      const rm5 = rm_sq * rm_sq * rm;
      const coefM = 0.06;
      vx += (coefM * (rm_sq - 3 * dxm * dxm)) / rm5;
      vy += (coefM * (-3 * dxm * dym)) / rm5;
      vz += (coefM * (-3 * dxm * dzm)) / rm5;
    }
  }

  // 4. Aerodynamic Wake Expansion on Downstream side (x > 0):
  // Keeps streamlines widely spaced and clearly visible on the right side
  if (x > 0.0) {
    const wakeFactor = Math.min(x / 14.0, 1.0);
    vy += (y > 0 ? 0.04 : -0.04) * wakeFactor;
    vz += (z > 0 ? 0.03 : -0.03) * wakeFactor;
  }

  // Strictly enforce forward flow (no negative vx, completely preventing loops)
  vx = Math.max(vx, 0.35);

  return new THREE.Vector3(vx, vy, vz);
}

// Authentic CFD Colormap:
// - Upstream Inflow (x < -10): Electric Blue into Radiant Cyan
// - Hero Text Area (-10 <= x < -4.5): Cyan into Neon Green
// - Drone Approach (-4.5 <= x < -1.8): Pure vivid Neon Green (shifted into yellow area)
// - Drone Fuselage (-1.8 <= x < 1.4): Golden Yellow contouring (close lines only); red stagnation point exclusively at nose impact; outer lines stay green
// - Wake (x >= 1.4): Green into Cyan and deep Blue downstream
function getStreamlinePointColor(
  x: number,
  distFromDrone: number,
  isClosest: boolean,
  bounds: number
): THREE.Color {
  const c = new THREE.Color();

  if (x < -10.0) {
    // 1. Far Upstream Inflow: Electric Blue into Cyan
    const t = Math.min((x - -bounds) / (bounds - 10.0), 1.0);
    c.lerpColors(new THREE.Color('#0044ff'), new THREE.Color('#00d4ff'), t);
  } else if (x < -4.5) {
    // 2. Upstream through Hero Text: Cyan into Neon Green
    const t = (x - -10.0) / 5.5;
    c.lerpColors(new THREE.Color('#00d4ff'), new THREE.Color('#00ff66'), t);
  } else if (x < -1.8) {
    // 3. Pre-Drone Approach: Pure luminous Neon Green (occupying yellow area)
    c.set('#00ff66');
  } else if (x < 1.4) {
    // 4. Drone Interaction Zone: controlled, tiny amount of yellow and red
    if (isClosest && x >= -1.0 && x <= -0.1) {
      // Tiny, crisp red stagnation accent right at the blunt nose leading edge
      const distToNose = Math.abs(x - -0.5);
      const redAmount = Math.max(0, 1.0 - distToNose / 0.45);
      c.lerpColors(new THREE.Color('#ffc800'), new THREE.Color('#ff2200'), redAmount * 0.9);
    } else {
      const t = (x - -1.8) / 3.2;
      const bellCurve = Math.sin(t * Math.PI);

      if (distFromDrone <= 2.5) {
        // Filaments close to the drone: radiant golden yellow
        const yellowFactor = THREE.MathUtils.clamp((2.5 - distFromDrone) / 1.6 + 0.4, 0.45, 1.0);
        c.lerpColors(
          new THREE.Color('#00ff66'),
          new THREE.Color('#ffd000'),
          bellCurve * yellowFactor
        );
      } else if (distFromDrone <= 3.6) {
        // Mid wind-tunnel streamlines: subtle warm chartreuse/lime
        c.lerpColors(new THREE.Color('#00ff66'), new THREE.Color('#88ff00'), bellCurve * 0.5);
      } else {
        // Distant wind-tunnel filaments: stay crisp Neon Green (zero yellow, zero red)
        c.lerpColors(new THREE.Color('#00ff66'), new THREE.Color('#44ff22'), bellCurve * 0.25);
      }
    }
  } else if (x < 7.0) {
    // 5. Downstream Wake: Neon Green into radiant Cyan
    const t = (x - 1.4) / 5.6;
    c.lerpColors(new THREE.Color('#00ff66'), new THREE.Color('#00e5ff'), t);
  } else {
    // 6. Far Downstream Exit: Radiant Cyan into Electric Blue
    const t = Math.min((x - 7.0) / (bounds - 7.0), 1.0);
    c.lerpColors(new THREE.Color('#00e5ff'), new THREE.Color('#0055ff'), t);
  }

  return c;
}

function generateStreamlineGeometry(
  startX: number,
  startY: number,
  startZ: number,
  bounds: number,
  isClosest: boolean
) {
  const points: THREE.Vector3[] = [];
  const colorsArray: THREE.Color[] = [];
  const alphas: number[] = [];

  const current = new THREE.Vector3(startX, startY, startZ);
  const distFromDrone = Math.sqrt((startY - 0.2) * (startY - 0.2) + startZ * startZ);

  for (let i = 0; i < SEGMENTS; i++) {
    // Surface contour hugging: deflect smoothly around scaled canopy
    const cy = 1.4;
    const cx = -0.5;
    const distCanopySq =
      ((current.x - cx) * (current.x - cx)) / (3.0 * 3.0) +
      ((current.y - cy) * (current.y - cy)) / (1.4 * 1.4) +
      (current.z * current.z) / (2.6 * 2.6);
    if (distCanopySq < 1.0) {
      const scaleFactor = 1.06 / Math.sqrt(distCanopySq);
      current.y = cy + (current.y - cy) * scaleFactor;
      current.z = current.z * scaleFactor;
    }

    // Surface contour hugging: deflect smoothly around scaled battery and skids
    const by = -0.8;
    const bx = 0.0;
    const distBatterySq =
      ((current.x - bx) * (current.x - bx)) / (3.8 * 3.8) +
      ((current.y - by) * (current.y - by)) / (1.8 * 1.8) +
      (current.z * current.z) / (2.6 * 2.6);
    if (distBatterySq < 1.0) {
      const scaleFactor = 1.06 / Math.sqrt(distBatterySq);
      current.y = by + (current.y - by) * scaleFactor;
      current.z = current.z * scaleFactor;
    }

    // Add point to streamline
    const newPoint = current.clone();
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      if (newPoint.distanceTo(lastPoint) < 0.001) {
        newPoint.add(new THREE.Vector3(0.01, 0.01, 0.01));
      }
    }
    points.push(newPoint);

    const vel = getDroneAeroVelocity(current.x, current.y, current.z);

    // Limit maximum step jump
    if (vel.length() > 2.0) {
      vel.setLength(2.0);
    }

    colorsArray.push(getStreamlinePointColor(current.x, distFromDrone, isClosest, bounds));

    // Smooth flow alpha: Far left upstream lines start with a clean opacity (0.50)
    // and smoothly ramp up to vibrant brilliance (0.98) over the drone and wake
    const flowProgress = THREE.MathUtils.smoothstep(current.x, -bounds, -4.0);
    const alphaFlow = THREE.MathUtils.lerp(0.5, 0.98, flowProgress);

    // Fade out smoothly at outer stream boundaries
    const edgeFade = THREE.MathUtils.smoothstep(bounds - Math.abs(current.x), 0.0, 2.5);

    // Atmospheric depth for distant wind-tunnel boundary streamlines
    const heightFade =
      distFromDrone > 4.5
        ? THREE.MathUtils.clamp(1.0 - ((distFromDrone - 4.5) / 5.0) * 0.35, 0.52, 1.0)
        : 1.0;

    alphas.push(alphaFlow * edgeFade * heightFade);

    const step = 0.35;
    // Strictly forward monotonic step: mathematically impossible to loop backwards
    const dx = Math.max(vel.x * step, 0.18);
    current.x += dx;
    current.y += vel.y * step;
    current.z += vel.z * step;
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubularSegments = SEGMENTS - 1;
  const radialSegments = 8;
  const radius = 0.013; // Finer, sleeker, razor-sharp neon CFD filaments
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
  const dronePivotRef = useRef<THREE.Group>(null);
  const [geometries, setGeometries] = useState<THREE.TubeGeometry[]>([]);
  const [droneModel, setDroneModel] = useState<THREE.Group | null>(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const initRotY = isMobile ? 0.38 : 0.55;
  const initRotX = -0.065;
  const initPosX = isMobile ? 0.0 : 7.2;
  const initPosZ = -(isMobile ? 2.6 : 4.6);

  const scrollYRef = useRef(0);
  const currentScrollRotY = useRef(initRotY);
  const currentScrollRotX = useRef(initRotX);
  const currentPosX = useRef(initPosX);
  const currentPosZ = useRef(initPosZ);

  // Load the Decimated 3D Drone Model from public/models/fyp-drone.glb
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/fyp-drone.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness, 0.25);
              mat.metalness = Math.min(mat.metalness, 0.5);
            }
          }
        });
        setDroneModel(model);
      },
      undefined,
      (err) => {
        console.error('Failed to load drone model:', err);
      }
    );
  }, []);

  useEffect(() => {
    // Scroll listener for the rotation effect
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const isMobile = window.innerWidth < 768;
    const actualTubeCount = isMobile ? 38 : TUBE_COUNT;
    const actualBounds = isMobile ? BOUNDS * 0.55 : BOUNDS;
    const actualPosX = isMobile ? 0.0 : 7.2;
    const actualPosZ = -(isMobile ? 2.6 : 4.6);
    const actualRotY = isMobile ? 0.38 : 0.55;

    currentPosX.current = actualPosX;
    currentPosZ.current = actualPosZ;
    currentScrollRotY.current = actualRotY;
    currentScrollRotX.current = initRotX;
    if (groupRef.current) {
      groupRef.current.position.x = actualPosX;
      groupRef.current.position.z = actualPosZ;
      groupRef.current.rotation.y = actualRotY;
      groupRef.current.rotation.x = initRotX;
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const posX = mobile ? 0.0 : 7.2;
      const posZ = -(mobile ? 2.6 : 4.6);
      const rotY = mobile ? 0.38 : 0.55;
      currentPosX.current = posX;
      currentPosZ.current = posZ;
      currentScrollRotY.current = rotY;
    };
    window.addEventListener('resize', handleResize);

    const newGeometries: THREE.TubeGeometry[] = [];

    // Expansive full-canvas CFD streamline seeding:
    // 1. 28 Upper wind-tunnel & atmospheric streamlines (Y: 2.0 to 7.6) -> sweeps through top-right corner
    // 2. 28 Lower wind-tunnel & floor streamlines (Y: -2.0 to -7.6) -> sweeps through bottom-right corner
    // 3. 18 Front canopy streamlines (hugging drone nose & canopy)
    // 4. 14 Front cargo & skid streamlines (hugging battery & skids)
    // 5. 8 Flank & outer streamlines (framing drone wings & arms)
    const topY = [
      2.0, 2.5, 3.0, 3.5, 4.0, 4.6, 5.2, 5.8, 6.4, 7.0, 7.6, 2.2, 2.7, 3.2, 3.8, 4.3, 4.9, 5.5, 6.1,
      6.7, 7.3, 2.4, 3.4, 4.4, 5.0, 5.9, 6.5, 7.1,
    ];
    const topZ = [
      0.0, -1.2, 1.2, -2.4, 2.4, -0.6, 0.6, -1.8, 1.8, -3.0, 3.0, 0.0, -1.0, 1.0, -2.0, 2.0, -2.8,
      2.8, -1.4, 1.4, 0.5, -0.5, 1.6, -1.6, 2.5, -2.5, 0.0, 1.0,
    ];

    const bottomY = [
      -2.0, -2.5, -3.0, -3.5, -4.0, -4.6, -5.2, -5.8, -6.4, -7.0, -7.6, -2.2, -2.7, -3.2, -3.8,
      -4.3, -4.9, -5.5, -6.1, -6.7, -7.3, -2.4, -3.4, -4.4, -5.0, -5.9, -6.5, -7.1,
    ];
    const bottomZ = [
      0.0, 1.2, -1.2, 2.4, -2.4, 0.6, -0.6, 1.8, -1.8, 3.0, -3.0, 0.0, 1.0, -1.0, 2.0, -2.0, 2.8,
      -2.8, 1.4, -1.4, -0.5, 0.5, -1.6, 1.6, -2.5, 2.5, 0.0, -1.0,
    ];

    const frontCanopyY = [
      0.4, 0.7, 1.0, 1.3, 1.6, 1.9, 0.55, 0.85, 1.15, 1.45, 1.75, 0.6, 0.9, 1.2, 0.5, 0.8, 1.1, 1.4,
    ];
    const frontCanopyZ = [
      0.0, -0.6, 0.6, -1.2, 1.2, -1.8, 1.8, -0.3, 0.3, -0.9, 0.9, 0.0, -1.5, 1.5, -0.4, 0.4, -0.8,
      0.8,
    ];

    const frontCargoY = [
      -0.2, -0.5, -0.8, -1.1, -1.4, -1.8, -0.35, -0.65, -0.95, -1.25, -1.6, -0.4, -0.7, -1.0,
    ];
    const frontCargoZ = [
      0.0, 0.6, -0.6, 1.2, -1.2, 1.8, -1.8, 0.3, -0.3, 0.9, -0.9, 0.0, 0.5, -0.5,
    ];

    const flankY = [0.0, 0.5, -0.4, 0.8, -0.6, 0.3, 1.0, -1.0];
    const flankZ = [-2.6, 2.6, -3.4, 3.4, -4.2, 4.2, -3.0, 3.0];

    for (let i = 0; i < actualTubeCount; i++) {
      const startX = -actualBounds;
      let startY = 0;
      let startZ = 0;
      let isClosest = false;

      if (isMobile) {
        // On mobile: strictly confine streamlines to the drone's aerodynamic envelope
        // (-0.85 <= Y <= +1.25, -1.6 <= Z <= +1.6) so flowlines stay 100% inside the center gap
        // and NEVER shoot upward behind the headline or downward behind the subtitle/stats.
        if (i < 16) {
          // Front canopy streamlines hugging white top fuselage & nose
          startY = frontCanopyY[i % frontCanopyY.length];
          startZ = frontCanopyZ[i % frontCanopyZ.length] * 0.75;
          if (Math.abs(startZ) <= 0.65 && startY >= 0.4 && startY <= 1.25) {
            isClosest = true;
          }
        } else if (i < 30) {
          // Front cargo & battery streamlines hugging payload & skids
          const idx = i - 16;
          startY = frontCargoY[idx % frontCargoY.length];
          startZ = frontCargoZ[idx % frontCargoZ.length] * 0.75;
          if (Math.abs(startZ) <= 0.55 && startY >= -0.6 && startY <= -0.15) {
            isClosest = true;
          }
        } else {
          // Flank streamlines framing drone quadcopter arms
          const idx = i - 30;
          startY = flankY[idx % flankY.length] * 0.6;
          startZ = flankZ[idx % flankZ.length] * 0.45;
        }
      } else {
        // Desktop: Full expansive 96-streamline CFD tunnel (100% UNCHANGED)
        if (i < 28) {
          startY = topY[i % topY.length];
          startZ = topZ[i % topZ.length];
        } else if (i < 56) {
          const idx = i - 28;
          startY = bottomY[idx % bottomY.length];
          startZ = bottomZ[idx % bottomZ.length];
        } else if (i < 74) {
          const idx = i - 56;
          startY = frontCanopyY[idx % frontCanopyY.length];
          startZ = frontCanopyZ[idx % frontCanopyZ.length];
          if (Math.abs(startZ) <= 0.65 && startY >= 0.4 && startY <= 1.25) {
            isClosest = true;
          }
        } else if (i < 88) {
          const idx = i - 74;
          startY = frontCargoY[idx % frontCargoY.length];
          startZ = frontCargoZ[idx % frontCargoZ.length];
          if (Math.abs(startZ) <= 0.55 && startY >= -0.6 && startY <= -0.15) {
            isClosest = true;
          }
        } else {
          const idx = i - 88;
          startY = flankY[idx % flankY.length];
          startZ = flankZ[idx % flankZ.length];
        }
      }

      const geom = generateStreamlineGeometry(startX, startY, startZ, actualBounds, isClosest);
      newGeometries.push(geom);
    }

    const timer = setTimeout(() => {
      setGeometries(newGeometries);
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      newGeometries.forEach((g) => g.dispose());
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const isMobile = window.innerWidth < 768;
    // At top (hero):
    // Desktop: Yaw 0.55 rad (~31.5 deg), pitch -0.065 rad, posX 7.2, posZ 4.6
    // Mobile: Yaw 0.38 rad (~21.8 deg), pitch -0.065 rad, posX 0.0 (dead center), posZ 2.6, posY 0.95 (centered in window)
    const maxRotY = isMobile ? 0.38 : 0.55;
    const maxRotX = -0.065;
    const maxPosX = isMobile ? 0.0 : 7.2;
    const maxPosZ = isMobile ? 2.6 : 4.6;
    const maxPosY = isMobile ? 0.6 : 0.0;

    // Smooth scroll interpolation: At About section (scrollProgress = 1), moves to (0,0,0) and rotation = 0
    const scrollProgress = Math.min(scrollYRef.current / 800, 1);
    const targetRotY = maxRotY * (1 - scrollProgress);
    const targetRotX = maxRotX * (1 - scrollProgress);
    const targetPosX = maxPosX * (1 - scrollProgress);
    const targetPosZ = -maxPosZ * (1 - scrollProgress);
    const targetPosY = maxPosY * (1 - scrollProgress);

    currentScrollRotY.current = THREE.MathUtils.lerp(
      currentScrollRotY.current,
      targetRotY,
      delta * 5.0
    );

    currentScrollRotX.current = THREE.MathUtils.lerp(
      currentScrollRotX.current,
      targetRotX,
      delta * 5.0
    );

    currentPosX.current = THREE.MathUtils.lerp(currentPosX.current, targetPosX, delta * 5.0);

    currentPosZ.current = THREE.MathUtils.lerp(currentPosZ.current, targetPosZ, delta * 5.0);

    const time = performance.now() / 1000;
    const sway = 1 - 0.5 * (1 - scrollProgress);

    // Living aerodynamic fluid sway animation on the entire tunnel:
    groupRef.current.rotation.y = Math.sin(time * 0.25) * 0.06 * sway + currentScrollRotY.current;
    groupRef.current.rotation.x = Math.cos(time * 0.2) * 0.035 * sway + currentScrollRotX.current;
    groupRef.current.position.y = targetPosY + Math.sin(time * 0.3) * 0.18 * sway;

    groupRef.current.position.z = currentPosZ.current;
    groupRef.current.position.x = currentPosX.current;

    // Gentle aerodynamic hovering and banking trim motion on the drone model:
    // On desktop: resting base Y is -0.6. On mobile: resting base Y is -0.15 (centred in gap)
    const baseDroneY = isMobile ? -0.15 : -0.6;
    if (dronePivotRef.current) {
      dronePivotRef.current.position.y = baseDroneY + Math.sin(time * 1.5) * 0.12 * sway;
      dronePivotRef.current.rotation.z = Math.sin(time * 1.1) * 0.025 * sway;
      dronePivotRef.current.rotation.x = Math.cos(time * 1.4) * 0.02 * sway;
    }
  });

  return (
    <group ref={groupRef} position={[initPosX, 0, initPosZ]} rotation={[initRotX, initRotY, 0]}>
      {/* 3D Drone Model with natural 11 deg forward pitch into oncoming airflow */}
      {droneModel && (
        <group ref={dronePivotRef} position={[0, isMobile ? 0.0 : -0.6, 0]}>
          <primitive
            object={droneModel}
            scale={isMobile ? 3.3 : 8.2}
            rotation={new THREE.Euler(11.0 * (Math.PI / 180), -Math.PI / 2, 0, 'YXZ')}
            position={[0, 0, 0]}
          />
        </group>
      )}

      {/* Clean, distinct CFD Streamlines */}
      {geometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={isMobile ? 0.72 : 1.0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
