import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/walkman_casete.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      state.mouse.x * 0.4 + state.clock.elapsedTime * 0.1,
      0.05,
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -state.mouse.y * 0.15,
      0.05,
    );
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload("/models/walkman_casete.glb");

export default function CassetteGLB({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight
          position={[-3, -2, 2]}
          intensity={0.5}
          color="#8B0A1F"
        />
        <Environment preset="studio" />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <Model />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
