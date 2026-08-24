import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/retro_crt_tv.glb");
  const cloned = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 1.5;
          material.needsUpdate = true;
        }
      });
    });
    return model;
  }, [scene]);

  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!ref.current) return;
    target.current.x = THREE.MathUtils.lerp(
      target.current.x,
      state.pointer.x * 0.07,
      0.03,
    );
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      -state.pointer.y * 0.04,
      0.03,
    );
    ref.current.rotation.y =
      target.current.x + Math.sin(state.clock.elapsedTime * 0.32) * 0.022;
    ref.current.rotation.x = target.current.y;
  });

  return (
    <group ref={ref}>
      <primitive
        object={cloned}
        scale={3.6}
        position={[3.2, -2.15, 0]}
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
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={0.16} />
        <directionalLight position={[4, 6, 5]} intensity={2.8} castShadow />
        <spotLight position={[1, 3, 6]} intensity={3.6} angle={0.38} penumbra={0.7} castShadow />
        <pointLight position={[0, 0, 4]} intensity={1.7} color="#c8d2dc" />
        <pointLight position={[-4, -1, 1]} intensity={2.2} color="#8B0A1F" />
        <Environment preset="night" environmentIntensity={0.9} />
        <Suspense fallback={null}>
          <Float speed={0.55} rotationIntensity={0.07} floatIntensity={0.12}>
            <Model />
          </Float>
          <ContactShadows
            position={[2.2, -2.55, 0]}
            opacity={0.75}
            scale={8}
            blur={2.4}
            far={5}
            color="#020202"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
