import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { deviceTilt } from "../../hooks/useDeviceTilt";

type FolderVariant = "default" | "footer" | "mobile";

function Model({ variant }: { variant: FolderVariant }) {
  const { scene } = useGLTF("/models/worm_dossier_m.e.g_game_ready.glb");
  const { gl } = useThree();
  const models = useMemo(() => {
    return Array.from({ length: 6 }, () => {
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
    });
  }, [gl, scene]);

  const refs = useRef<Array<THREE.Group | null>>([]);
  const pointer = useRef({ x: 0, y: 0 });

  const fullScene = [
    { model: models[3], scale: 1.7, position: [-3.65, 1.3, -4.65], rotation: [0, 1.05, 0.95], response: 0.14 },
    { model: models[4], scale: 1.55, position: [3.75, 1.55, -5.1], rotation: [-0.1, 1.18, 1.22], response: -0.12 },
    { model: models[5], scale: 2.05, position: [-2.75, -1.2, -3.25], rotation: [0.14, 0.82, 0.68], response: 0.17 },
    { model: models[1], scale: 1.85, position: [2.95, -1.25, -4.1], rotation: [0.08, 1.2, 1.12], response: -0.16 },
    { model: models[2], scale: 2.35, position: [1.45, 1.35, -2.35], rotation: [-0.06, 1.16, 0.94], response: -0.2 },
    {
      model: models[0],
      scale: variant === "footer" ? 1.85 : 2.9,
      position: variant === "footer" ? [0.35, -0.05, 0.05] as const : [-0.7, 0.3, 0.05] as const,
      rotation: [0, 1.047, 1.047],
      response: 0.27,
    },
  ] as const;
  const folders = variant === "mobile"
    ? [{ model: models[0], scale: 4.35, position: [0.15, 0.15, -1.8] as const, rotation: [0, 1.047, 1.047] as const, response: 0.22 }]
    : fullScene;

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight * 2 - 1);
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  useFrame((state, delta) => {
    refs.current.forEach((folder, index) => {
      if (!folder) return;
      const config = folders[index];
      const depthFactor = Math.max(0.35, 1 + config.position[2] * 0.08);
      const inputX = Math.max(-1, Math.min(1, pointer.current.x + deviceTilt.x));
      const inputY = Math.max(-1, Math.min(1, pointer.current.y + deviceTilt.y));
      folder.rotation.y = THREE.MathUtils.damp(folder.rotation.y, config.rotation[1] + inputX * config.response * depthFactor, 3.4, delta);
      folder.rotation.x = THREE.MathUtils.damp(folder.rotation.x, config.rotation[0] - inputY * config.response * 0.7, 3.4, delta);
      folder.rotation.z = THREE.MathUtils.damp(folder.rotation.z, config.rotation[2] + inputX * config.response * 0.18, 3.4, delta);
      folder.position.y = config.position[1] + Math.sin(state.clock.elapsedTime * (0.24 + index * 0.025) + index) * 0.08;
    });
  });

  return (
    <group>
      {folders.map((folder, index) => (
        <group
          key={index}
          ref={(node) => { refs.current[index] = node; }}
          position={folder.position}
          rotation={folder.rotation}
        >
          <primitive object={folder.model} scale={folder.scale} />
        </group>
      ))}
    </group>
  );
}

useGLTF.preload("/models/worm_dossier_m.e.g_game_ready.glb");

export default function FolderGLB({ className = "", variant = "default" }: { className?: string; variant?: FolderVariant }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: variant === "mobile" ? 22 : 40 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={0.27} />
        <fog attach="fog" args={["#050505", 5.5, 12]} />
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
            <Model variant={variant} />
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
