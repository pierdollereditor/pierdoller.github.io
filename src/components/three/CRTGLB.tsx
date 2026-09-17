import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_CANVAS_INTERACTION_MARGIN, MODEL_CANVAS_PRELOAD_MARGIN, useCanvasVisibility } from "../../hooks/useCanvasVisibility";
import { useConstrainedRendering } from "../../hooks/useConstrainedRendering";
import FrameScheduler from "./FrameScheduler";
import StaticShadows from "./StaticShadows";

const POINTER_DAMPING = 7;
const MOTION_THRESHOLD = 0.0005;
const MAX_FRAME_DELTA_SECONDS = 1 / 30;

function Model({ enableShadows, interactive }: { enableShadows: boolean; interactive: boolean }) {
  const { scene } = useGLTF("/models/retro_crt_tv.glb");
  const invalidate = useThree((state) => state.invalidate);
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

  useEffect(() => {
    if (!interactive) return;
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.current.x = (event.clientX / window.innerWidth * 2 - 1) * 0.09;
      target.current.y = -(event.clientY / window.innerHeight * 2 - 1) * 0.055;
      invalidate();
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [interactive, invalidate]);

  useFrame((state, delta) => {
    if (!interactive || !ref.current) return;
    const frameDelta = Math.min(delta, MAX_FRAME_DELTA_SECONDS);
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, target.current.x, POINTER_DAMPING, frameDelta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, target.current.y, POINTER_DAMPING, frameDelta);
    if (
      Math.abs(ref.current.rotation.y - target.current.x) > MOTION_THRESHOLD
      || Math.abs(ref.current.rotation.x - target.current.y) > MOTION_THRESHOLD
    ) state.invalidate();
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
  const { isActive: isInteractive } = useCanvasVisibility(containerRef, MODEL_CANVAS_INTERACTION_MARGIN);
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
        dpr={isConstrained ? 1 : [1, 1.25]}
        shadows={!isConstrained}
        frameloop="demand"
      >
        <FrameScheduler enabled={shouldPreload && !isReady} />
        <StaticShadows enabled={!isConstrained} />
        <ambientLight intensity={0.16} />
        <directionalLight position={[4, 6, 5]} intensity={2.8} castShadow={!isConstrained} />
        <spotLight position={[1, 3, 6]} intensity={3.6} angle={0.38} penumbra={0.7} castShadow={!isConstrained} />
        <pointLight position={[0, 0, 4]} intensity={1.7} color="#c8d2dc" />
        <pointLight position={[-4, -1, 1]} intensity={2.2} color="#8B0A1F" />
        <Environment preset="night" environmentIntensity={0.9} />
        <Suspense fallback={null}>
          <Model enableShadows={!isConstrained} interactive={isInteractive} />
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
