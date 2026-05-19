import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/worm_dossier_m.e.g_game_ready.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!ref.current) return;
    target.current.x = THREE.MathUtils.lerp(
      target.current.x,
      state.mouse.x * 0.15,
      0.015,
    );
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      -state.mouse.y * 0.08,
      0.015,
    );
    ref.current.rotation.y =
      target.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    ref.current.rotation.x = target.current.y;
  });

  return (
    <group ref={ref}>
      <primitive
        object={cloned}
        scale={4} // ← подкрутишь от 1 до 5
        position={[0, 0, 0]} // ← [x, y, z]
        rotation={[0, 1.047, 1.047]} // ← в радианах! 0.5 ≈ 28°
      />
    </group>
  );
}

useGLTF.preload("/models/worm_dossier_m.e.g_game_ready.glb");

export default function FolderGLB({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} />
        <directionalLight
          position={[-4, -2, 2]}
          intensity={0.5}
          color="#8B0A1F"
        />
        <spotLight
          position={[0, 4, 3]}
          intensity={0.7}
          angle={0.5}
          penumbra={1}
        />
        <Environment preset="warehouse" />
        <Suspense fallback={null}>
          <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
            <Model />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
