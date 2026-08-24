import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, ContactShadows, Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/walkman_casete.glb");
  const cloned = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.45;
          material.roughness = Math.max(material.roughness, 0.65);
          material.needsUpdate = true;
        }
      });
    });
    return model;
  }, [scene]);
  return <primitive object={cloned} position={[0, 0, 0]} rotation={[0, 0, -0.08]} />;
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
        camera={{ position: [0, 0, 5.4], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 0.62;
        }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={0.08} />
        <directionalLight position={[5, 6, 5]} intensity={1.05} castShadow />
        <directionalLight
          position={[-3, -2, 2]}
          intensity={0.65}
          color="#8B0A1F"
        />
        <Environment preset="studio" environmentIntensity={0.32} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.35}>
            <Float speed={0.55} rotationIntensity={0.04} floatIntensity={0.1}>
              <Model />
            </Float>
          </Bounds>
          <ContactShadows position={[0, -1.55, 0]} opacity={0.7} scale={7} blur={2.3} far={4} />
        </Suspense>
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.65}
          autoRotate
          autoRotateSpeed={0.55}
        />
      </Canvas>
    </div>
  );
}
