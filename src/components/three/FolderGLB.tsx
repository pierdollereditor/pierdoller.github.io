import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/worm_dossier_m.e.g_game_ready.glb");
  const { gl } = useThree();
  const cloned = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.9;
          material.roughness = Math.max(material.roughness, 0.72);
          material.normalScale.set(0.35, 0.35);
          if (material.map) {
            material.map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
            material.map.minFilter = THREE.LinearMipmapLinearFilter;
            material.map.magFilter = THREE.LinearFilter;
            material.map.generateMipmaps = true;
            material.map.needsUpdate = true;
          }
          material.needsUpdate = true;
        }
      });
    });
    return model;
  }, [gl, scene]);

  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!ref.current) return;
    target.current.x = THREE.MathUtils.lerp(
      target.current.x,
      state.pointer.x * 0.24,
      0.035,
    );
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      -state.pointer.y * 0.14,
      0.035,
    );
    ref.current.rotation.y =
      target.current.x + Math.sin(state.clock.elapsedTime * 0.35) * 0.07;
    ref.current.rotation.x = target.current.y;
  });

  return (
    <group ref={ref}>
      <primitive
        object={cloned}
        scale={4.2}
        position={[0, 0, 0]}
        rotation={[0, 1.047, 1.047]}
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
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={0.18} />
        <directionalLight position={[4, 6, 5]} intensity={1.8} castShadow />
        <directionalLight
          position={[-5, 1, -3]}
          intensity={1.25}
          color="#8B0A1F"
        />
        <spotLight
          position={[-1, 3, 5]}
          intensity={2}
          angle={0.42}
          penumbra={0.75}
          castShadow
        />
        <Environment preset="warehouse" environmentIntensity={0.58} />
        <Suspense fallback={null}>
          <Float speed={0.65} rotationIntensity={0.08} floatIntensity={0.16}>
            <Model />
          </Float>
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.7}
            scale={7}
            blur={2.2}
            far={4}
            color="#020202"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
