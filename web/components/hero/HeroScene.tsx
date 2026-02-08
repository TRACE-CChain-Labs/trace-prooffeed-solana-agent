"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Environment, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, Mesh } from "three";

type Vec3 = [number, number, number];

function ParallaxCamera() {
  useFrame((state, delta) => {
    const camera = state.camera;
    const ease = 1 - Math.exp(-delta * 4);
    const targetX = state.pointer.x * 0.7;
    const targetY = state.pointer.y * 0.45;
    camera.position.x = MathUtils.lerp(camera.position.x, targetX, ease);
    camera.position.y = MathUtils.lerp(camera.position.y, targetY, ease);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function FloatingKnot({
  basePosition,
  color,
  speed,
  scale = 1,
  seed = 0,
}: {
  basePosition: Vec3;
  color: string;
  speed: number;
  scale?: number;
  seed?: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    const t = clock.elapsedTime * speed + seed;
    ref.current.position.x = basePosition[0] + Math.cos(t * 0.75) * 0.12;
    ref.current.position.y = basePosition[1] + Math.sin(t) * 0.2;
    ref.current.rotation.x += delta * 0.22;
    ref.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={ref} position={basePosition} scale={scale}>
      <torusKnotGeometry args={[0.42, 0.12, 84, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.24}
        metalness={0.62}
        roughness={0.18}
      />
    </mesh>
  );
}

function FloatingSphere({
  basePosition,
  color,
  speed,
  radius,
  seed = 0,
}: {
  basePosition: Vec3;
  color: string;
  speed: number;
  radius: number;
  seed?: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    const t = clock.elapsedTime * speed + seed;
    ref.current.position.y = basePosition[1] + Math.sin(t) * 0.16;
    ref.current.rotation.y += delta * 0.24;
  });

  return (
    <mesh ref={ref} position={basePosition}>
      <sphereGeometry args={[radius, 30, 30]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={0.32}
        roughness={0.25}
      />
    </mesh>
  );
}

function NeonScene() {
  return (
    <>
      <color attach="background" args={["#040711"]} />
      <fog attach="fog" args={["#040711", 6, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3.5, 3]} intensity={0.75} color="#67e8f9" />
      <pointLight position={[-4, -1.5, 2]} intensity={0.58} color="#93c5fd" />
      <pointLight position={[2, 1.5, -1]} intensity={0.45} color="#22d3ee" />

      <FloatingKnot basePosition={[-2.2, 0.65, -0.8]} color="#22d3ee" speed={0.54} seed={0.3} />
      <FloatingKnot basePosition={[0.2, -0.35, -1.3]} color="#38bdf8" speed={0.41} scale={0.82} seed={1.1} />
      <FloatingKnot basePosition={[2.3, 0.82, -0.6]} color="#67e8f9" speed={0.58} scale={0.95} seed={2.4} />

      <FloatingSphere basePosition={[-0.95, 1.15, 0.3]} color="#a5f3fc" speed={0.7} radius={0.34} seed={0.6} />
      <FloatingSphere basePosition={[1.6, -0.9, 0.5]} color="#7dd3fc" speed={0.65} radius={0.42} seed={1.5} />

      <Sparkles count={90} scale={[8, 4, 6]} size={1.8} speed={0.3} noise={0.25} color="#67e8f9" />
      <Environment preset="city" />
      <ParallaxCamera />

      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom
          intensity={0.33}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.34}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 5.6], fov: 50, near: 0.1, far: 30 }}
    >
      <NeonScene />
    </Canvas>
  );
}
