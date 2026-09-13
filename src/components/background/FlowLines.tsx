import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const TUBE_COUNT = 96;
const SEGMENTS = 205;
const BOUNDS = 34;

// Analytical Aerodynamic CFD Flow field around the drone airframe
function getDroneAeroVelocity(x: number, y: number, z: number) {
  const U = 1.0;
  let vx = U;
  let vy = 0;
  let vz = 0;

  // Drone airframe center: centered at x = -0.1, y = 0.05, z = 0
  // Symmetrically and smoothly envelopes both the white canopy (top y=1.64)
  // and the lower cargo tank (bottom y=-1.51) with clean, laminar CFD clearance
  const fx = -0.1;
  const fy = 0.05;
  const dx = (x - fx) / 3.4;
  const dy = (y - fy) / 1.85;
  const dz = z / 2.6;
  const r_sq = dx * dx + dy * dy + dz * dz + 0.42;
  const r = Math.sqrt(r_sq);

  if (r < 5.0) {
    const r5 = r_sq * r_sq * r;
    const coef = 0.82;
    vx += (coef * (r_sq - 3 * dx * dx)) / r5;
    vy += (coef * (-3 * dx * dy)) / r5;
    vz += (coef * (-3 * dx * dz)) / r5;
  }

  // Smooth aerodynamic wake relaxation on the downstream side
  if (x > 1.5) {
    const wake = Math.min((x - 1.5) / 10.0, 1.0);
    vy += (y > fy ? 0.015 : -0.015) * wake;
  }

  // Strictly enforce forward flow (completely preventing loops)
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
  const distFromDrone = Math.sqrt((startY - 0.05) * (startY - 0.05) + startZ * startZ);

  for (let i = 0; i < SEGMENTS; i++) {
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
  const initRotY = isMobile ? 0.95 : 0.55;
  const initRotX = isMobile ? 0.03 : -0.065;
  const initPosX = isMobile ? 0.0 : 7.2;
  const initPosY = isMobile ? 0.72 : 0.0;
  const initPosZ = -(isMobile ? 12.5 : 4.6);

  const scrollYRef = useRef(0);
  const currentScrollRotY = useRef(initRotY);
  const currentScrollRotX = useRef(initRotX);
  const currentPosX = useRef(initPosX);
  const currentPosY = useRef(initPosY);
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
    const actualPosX = isMobile ? 0.0 : 7.2;
    const actualPosY = isMobile ? 0.72 : 0.0;
    const actualPosZ = -(isMobile ? 12.5 : 4.6);
    const actualRotY = isMobile ? 0.95 : 0.55;
    const actualRotX = isMobile ? 0.03 : -0.065;

    currentPosX.current = actualPosX;
    currentPosY.current = actualPosY;
    currentPosZ.current = actualPosZ;
    currentScrollRotY.current = actualRotY;
    currentScrollRotX.current = actualRotX;
    if (groupRef.current) {
      groupRef.current.position.x = actualPosX;
      groupRef.current.position.y = actualPosY;
      groupRef.current.position.z = actualPosZ;
      groupRef.current.rotation.y = actualRotY;
      groupRef.current.rotation.x = actualRotX;
      groupRef.current.rotation.z = 0;
    }

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

    const buildGeometries = () => {
      const geoms: THREE.TubeGeometry[] = [];
      for (let i = 0; i < TUBE_COUNT; i++) {
        const startX = -BOUNDS;
        let startY = 0;
        let startZ = 0;
        let isClosest = false;

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

        const geom = generateStreamlineGeometry(startX, startY, startZ, BOUNDS, isClosest);
        geoms.push(geom);
      }
      return geoms;
    };

    const initialGeometries = buildGeometries();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const posX = mobile ? 0.0 : 7.2;
      const posY = mobile ? 0.72 : 0.0;
      const posZ = -(mobile ? 12.5 : 4.6);
      const rotY = mobile ? 0.95 : 0.55;
      const rotX = mobile ? 0.03 : -0.065;
      currentPosX.current = posX;
      currentPosY.current = posY;
      currentPosZ.current = posZ;
      currentScrollRotY.current = rotY;
      currentScrollRotX.current = rotX;
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setGeometries(initialGeometries);
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      initialGeometries.forEach((g) => g.dispose());
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const isMobile = window.innerWidth < 768;
    // Location & angle:
    // Desktop: Yaw 0.55 rad (~31.5 deg), pitch -0.065 rad, posX 7.2, posY 0.0, posZ 4.6
    // Mobile: Pushed deeper into background (posZ 12.5, posY 0.72), rotated forward (Yaw 0.95 rad, pitch 0.03 rad)
    const maxRotY = isMobile ? 0.95 : 0.55;
    const maxRotX = isMobile ? 0.03 : -0.065;
    const maxPosX = isMobile ? 0.0 : 7.2;
    const maxPosZ = isMobile ? 12.5 : 4.6;
    const maxPosY = isMobile ? 0.72 : 0.0;

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
    currentPosY.current = THREE.MathUtils.lerp(currentPosY.current, targetPosY, delta * 5.0);
    currentPosZ.current = THREE.MathUtils.lerp(currentPosZ.current, targetPosZ, delta * 5.0);

    const time = performance.now() / 1000;
    const sway = 1 - 0.5 * (1 - scrollProgress);

    // Living aerodynamic fluid sway animation on the entire tunnel:
    groupRef.current.rotation.y = Math.sin(time * 0.25) * 0.06 * sway + currentScrollRotY.current;
    groupRef.current.rotation.x = Math.cos(time * 0.2) * 0.035 * sway + currentScrollRotX.current;
    groupRef.current.rotation.z = 0; // Streamlines strictly horizontal
    groupRef.current.position.y = currentPosY.current + Math.sin(time * 0.3) * 0.18 * sway;

    groupRef.current.position.z = currentPosZ.current;
    groupRef.current.position.x = currentPosX.current;

    // Gentle aerodynamic hovering and banking trim motion on the drone model:
    if (dronePivotRef.current) {
      dronePivotRef.current.position.y = -0.6 + Math.sin(time * 1.5) * 0.12 * sway;
      dronePivotRef.current.rotation.z = Math.sin(time * 1.1) * 0.025 * sway;
      dronePivotRef.current.rotation.x = Math.cos(time * 1.4) * 0.02 * sway;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[initPosX, initPosY, initPosZ]}
      rotation={[initRotX, initRotY, 0]}
    >
      {/* 3D Drone Model with natural 11 deg forward pitch into oncoming airflow */}
      {droneModel && (
        <group ref={dronePivotRef} position={[0, -0.6, 0]}>
          <primitive
            object={droneModel}
            scale={8.2}
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
            opacity={isMobile ? 0.7 : 1.0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
