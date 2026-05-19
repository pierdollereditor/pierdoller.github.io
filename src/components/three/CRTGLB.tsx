import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/retro_crt_tv.glb");
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
        scale={3}
        position={[2.8, -1.8, 0]}
        rotation={[0, -2, 0.2]}
      />
    </group>
  );
}

useGLTF.preload("/models/retro_crt_tv.glb");

export default function CRTGLB({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <pointLight position={[0, 0, 3]} intensity={0.9} color="#A8A8B0" />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#8B0A1F" />
        <Environment preset="night" />
        <Suspense fallback={null}>
          <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.15}>
            <Model />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
