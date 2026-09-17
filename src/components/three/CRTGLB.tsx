import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_CANVAS_PRELOAD_MARGIN, useCanvasVisibility } from "../../hooks/useCanvasVisibility";
import { useConstrainedRendering } from "../../hooks/useConstrainedRendering";
import FrameScheduler from "./FrameScheduler";

function Model({ enableShadows }: { enableShadows: boolean }) {
  const { scene } = useGLTF("/models/retro_crt_tv.glb");
  const cloned = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = enableShadows;
      child.receiveShadow = enableShadows;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 1.5;
          material.needsUpdate = true;
        }
      });
    });
    return model;
  }, [enableShadows, scene]);

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

export default function CRTGLB({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isActive: shouldPreload } = useCanvasVisibility(containerRef, MODEL_CANVAS_PRELOAD_MARGIN);
  const isConstrained = useConstrainedRendering();
  const hasMountedRef = useRef(false);
  if (shouldPreload) hasMountedRef.current = true;
  const shouldRender = hasMountedRef.current;
  const [isReady, setIsReady] = useState(false);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        opacity: isReady ? 1 : 0,
        transition: "opacity 700ms ease-out",
      }}
    >
      {shouldRender && (
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: !isConstrained, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }}
        dpr={isConstrained ? 1 : [1, 1.5]}
        shadows={!isConstrained}
        frameloop="demand"
      >
        <FrameScheduler enabled={shouldPreload && !isReady} />
        <ambientLight intensity={0.16} />
        <directionalLight position={[4, 6, 5]} intensity={2.8} castShadow={!isConstrained} />
        <spotLight position={[1, 3, 6]} intensity={3.6} angle={0.38} penumbra={0.7} castShadow={!isConstrained} />
        <pointLight position={[0, 0, 4]} intensity={1.7} color="#c8d2dc" />
        <pointLight position={[-4, -1, 1]} intensity={2.2} color="#8B0A1F" />
        <Environment preset="night" environmentIntensity={0.9} />
        <Suspense fallback={null}>
          <Float speed={0.55} rotationIntensity={0.07} floatIntensity={0.12}>
            <Model enableShadows={!isConstrained} />
          </Float>
          <ContactShadows
            position={[2.2, -2.55, 0]}
            opacity={0.75}
            scale={8}
            blur={2.4}
            far={5}
            color="#020202"
            frames={1}
            resolution={isConstrained ? 256 : 512}
          />
          <ReadyBeacon onReady={() => setIsReady(true)} />
        </Suspense>
      </Canvas>
      )}
    </div>
  );
}

function ReadyBeacon({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let innerRaf = 0;
    const raf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(onReady);
    });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(innerRaf);
    };
  }, [onReady]);
  return null;
}
