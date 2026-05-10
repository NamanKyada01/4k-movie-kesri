"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ── Gold & Black material palette ─────────────────────────────────────────
function useGoldMat() {
  return useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#D4A017"),
    metalness: 0.95,
    roughness: 0.12,
    envMapIntensity: 1.4,
  }), []);
}
function useDarkMat() {
  return useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0E0E0E"),
    metalness: 0.85,
    roughness: 0.25,
    envMapIntensity: 0.9,
  }), []);
}
function useLensMat() {
  return useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#050810"),
    metalness: 0.05,
    roughness: 0.02,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 2.0,
  }), []);
}
function useRimMat() {
  return useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#F5D76E"),
    metalness: 1.0,
    roughness: 0.05,
    envMapIntensity: 2.0,
  }), []);
}

// ── Cinema Camera Body ────────────────────────────────────────────────────
function CameraBody() {
  const gold = useGoldMat();
  const dark = useDarkMat();
  const lens = useLensMat();
  const rim  = useRimMat();

  return (
    <group>
      {/* Main body block */}
      <mesh material={dark} castShadow>
        <boxGeometry args={[2.2, 1.5, 1.4]} />
      </mesh>

      {/* Top handle */}
      <mesh position={[0, 1.05, 0]} material={dark} castShadow>
        <boxGeometry args={[1.6, 0.22, 0.8]} />
      </mesh>

      {/* Handle grip ridges */}
      {[-0.5, -0.2, 0.1, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 1.05, 0]} material={gold} castShadow>
          <boxGeometry args={[0.04, 0.24, 0.82]} />
        </mesh>
      ))}

      {/* Lens mount ring */}
      <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={gold} castShadow>
        <torusGeometry args={[0.62, 0.06, 16, 64]} />
      </mesh>

      {/* Lens barrel */}
      <mesh position={[-1.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={dark} castShadow>
        <cylinderGeometry args={[0.55, 0.6, 0.9, 48]} />
      </mesh>
      {/* Lens barrel front ring */}
      <mesh position={[-2.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={gold} castShadow>
        <torusGeometry args={[0.52, 0.045, 16, 64]} />
      </mesh>
      {/* Lens focus ring */}
      <mesh position={[-1.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={rim} castShadow>
        <torusGeometry args={[0.58, 0.03, 12, 64]} />
      </mesh>

      {/* Lens glass */}
      <mesh position={[-2.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={lens} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.04, 48]} />
      </mesh>
      {/* Inner lens elements */}
      <mesh position={[-1.96, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={lens} castShadow>
        <cylinderGeometry args={[0.35, 0.38, 0.12, 48]} />
      </mesh>

      {/* Viewfinder bump */}
      <mesh position={[0.6, 0.96, 0]} material={dark} castShadow>
        <boxGeometry args={[0.6, 0.28, 0.5]} />
      </mesh>
      <mesh position={[0.6, 1.12, 0]} material={gold} castShadow>
        <boxGeometry args={[0.58, 0.04, 0.48]} />
      </mesh>

      {/* Front logo plate */}
      <mesh position={[1.05, 0.2, 0]} material={gold} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.8]} />
      </mesh>

      {/* Shutter button */}
      <mesh position={[0.5, 0.78, 0.5]} material={gold} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 20]} />
      </mesh>

      {/* Mode dial */}
      <mesh position={[-0.3, 0.78, 0.52]} rotation={[Math.PI / 2, 0, 0]} material={dark} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
      </mesh>
      <mesh position={[-0.3, 0.78, 0.6]} rotation={[Math.PI / 2, 0, 0]} material={gold} castShadow>
        <torusGeometry args={[0.18, 0.02, 8, 12]} />
      </mesh>

      {/* Side grip texture lines */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((y, i) => (
        <mesh key={i} position={[1.12, y, -0.55]} material={gold} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.32]} />
        </mesh>
      ))}

      {/* Bottom plate */}
      <mesh position={[0, -0.78, 0]} material={gold} castShadow>
        <boxGeometry args={[2.18, 0.04, 1.38]} />
      </mesh>

      {/* Tripod mount */}
      <mesh position={[0, -0.86, 0]} material={gold} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 12]} />
      </mesh>

      {/* Lens hood rings — concentric decorative */}
      {[0.44, 0.36, 0.28].map((r, i) => (
        <mesh key={i} position={[-2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={i === 0 ? gold : dark} castShadow>
          <torusGeometry args={[r, 0.018, 8, 48]} />
        </mesh>
      ))}

      {/* Flash hotshoe */}
      <mesh position={[0, 1.17, -0.1]} material={gold} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.18]} />
      </mesh>

      {/* Corner chamfers — decorative gold strips */}
      {[
        [1.1, 0.75, 0.7], [-1.1, 0.75, 0.7],
        [1.1, 0.75, -0.7], [-1.1, 0.75, -0.7],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]} material={gold} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Animated Lens Flare Ring ──────────────────────────────────────────────
function LensFlare() {
  const ringRef = useRef<THREE.Mesh>(null!);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#F5D76E"),
    transparent: true,
    opacity: 0.0,
    side: THREE.FrontSide,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mat.opacity = 0.15 + Math.sin(t * 0.8) * 0.08;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);
    }
  });

  return (
    <mesh ref={ringRef} position={[-2.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat}>
      <torusGeometry args={[0.5, 0.01, 8, 64]} />
    </mesh>
  );
}

// ── Main Scene ────────────────────────────────────────────────────────────
interface CameraSceneProps {
  scrollY: number;       // 0-1
  mouseX: number;        // -1 to 1
  mouseY: number;        // -1 to 1
  isDragging: boolean;
  dragDelta: { x: number; y: number };
}

export function CameraScene({ scrollY, mouseX, mouseY, isDragging, dragDelta }: CameraSceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const timeRef  = useRef(0); // accumulated time — avoids deprecated THREE.Clock API

  // Target rotation accumulator
  const target = useRef({ rotY: 0.3, rotX: 0.1, posY: 0 });

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const g = groupRef.current;
    if (!g) return;

    // Float oscillation
    const floatY = Math.sin(t * 0.6) * 0.12;

    // Scroll drives rotation
    const scrollRotY = scrollY * Math.PI * 0.8;
    const scrollTiltZ = scrollY * -0.2;
    const scrollPosY  = scrollY * -0.6;

    // Mouse parallax
    const mouseRotY = mouseX * 0.3;
    const mouseRotX = mouseY * -0.15;

    // Drag override
    const dragRotY = isDragging ? dragDelta.x * 0.01 : 0;
    const dragRotX = isDragging ? dragDelta.y * -0.007 : 0;

    // Smooth lerp
    target.current.rotY += ((scrollRotY + mouseRotY + dragDelta.x * 0.008) - target.current.rotY) * 0.06;
    target.current.rotX += ((mouseRotX + dragDelta.y * -0.005) - target.current.rotX) * 0.08;
    target.current.posY += ((scrollPosY + floatY) - target.current.posY) * 0.05;

    g.rotation.y = target.current.rotY;
    g.rotation.x = target.current.rotX;
    g.rotation.z = scrollTiltZ;
    g.position.y = target.current.posY;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      {/* Key light — warm gold */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2.2}
        color="#F5D76E"
      />
      {/* Rim light — cool silver/blue */}
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#B0C4DE" />
      {/* Fill — subtle warm */}
      <pointLight position={[0, 3, 4]} intensity={0.6} color="#D4A017" distance={12} />

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Camera group */}
      <group ref={groupRef} rotation={[0.1, 0.3, 0]}>
        <CameraBody />
        <LensFlare />
      </group>

      {/* Subtle ground shadow plane */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#D4A017"
          transparent
          opacity={0.0}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
