import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { deviceTilt } from "../../hooks/useDeviceTilt";
import { MODEL_CANVAS_INTERACTION_MARGIN, MODEL_CANVAS_PRELOAD_MARGIN, useCanvasVisibility } from "../../hooks/useCanvasVisibility";
import { useConstrainedRendering } from "../../hooks/useConstrainedRendering";
import FrameScheduler from "./FrameScheduler";
import StaticShadows from "./StaticShadows";

type FolderVariant = "default" | "footer" | "mobile";

const POINTER_DAMPING = 6;
const MOTION_THRESHOLD = 0.0005;
const MAX_FRAME_DELTA_SECONDS = 1 / 30;

function Model({ variant, enableShadows, maxAnisotropy, interactive }: { variant: FolderVariant; enableShadows: boolean; maxAnisotropy: number; interactive: boolean }) {
  const { scene } = useGLTF("/models/worm_dossier_m.e.g_game_ready.glb");
  const { gl, invalidate } = useThree();
  const models = useMemo(() => {
    return Array.from({ length: 6 }, () => {
      const model = scene.clone(true);
      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.castShadow = enableShadows;
        child.receiveShadow = enableShadows;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = 0.9;
            material.roughness = Math.max(material.roughness, 0.72);
            material.normalScale.set(0.35, 0.35);
            if (material.map) {
              material.map.anisotropy = Math.min(maxAnisotropy, gl.capabilities.getMaxAnisotropy());
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
  }, [enableShadows, gl, maxAnisotropy, scene]);

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
    if (!interactive) return;
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight * 2 - 1);
      invalidate();
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [interactive, invalidate]);

  useFrame((state, delta) => {
    if (!interactive) return;
    const frameDelta = Math.min(delta, MAX_FRAME_DELTA_SECONDS);
    let isMoving = false;
    refs.current.forEach((folder, index) => {
      if (!folder) return;
      const config = folders[index];
      const depthFactor = Math.max(0.35, 1 + config.position[2] * 0.08);
      const inputX = Math.max(-1, Math.min(1, pointer.current.x + deviceTilt.x));
      const inputY = Math.max(-1, Math.min(1, pointer.current.y + deviceTilt.y));
      const targetRotationY = config.rotation[1] + inputX * config.response * depthFactor;
      const targetRotationX = config.rotation[0] - inputY * config.response * 0.7;
      const targetRotationZ = config.rotation[2] + inputX * config.response * 0.18;
      const targetX = config.position[0] + inputX * config.response * 0.18;
      const targetY = config.position[1] + inputY * config.response * 0.12;
      folder.rotation.y = THREE.MathUtils.damp(folder.rotation.y, targetRotationY, POINTER_DAMPING, frameDelta);
      folder.rotation.x = THREE.MathUtils.damp(folder.rotation.x, targetRotationX, POINTER_DAMPING, frameDelta);
      folder.rotation.z = THREE.MathUtils.damp(folder.rotation.z, targetRotationZ, POINTER_DAMPING, frameDelta);
      folder.position.x = THREE.MathUtils.damp(folder.position.x, targetX, POINTER_DAMPING, frameDelta);
      folder.position.y = THREE.MathUtils.damp(folder.position.y, targetY, POINTER_DAMPING, frameDelta);
      isMoving ||= Math.abs(folder.rotation.y - targetRotationY) > MOTION_THRESHOLD
        || Math.abs(folder.rotation.x - targetRotationX) > MOTION_THRESHOLD
        || Math.abs(folder.position.x - targetX) > MOTION_THRESHOLD
        || Math.abs(folder.position.y - targetY) > MOTION_THRESHOLD;
    });
    if (isMoving) state.invalidate();
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

export default function FolderGLB({ className = "", variant = "default" }: { className?: string; variant?: FolderVariant }) {
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
        camera={{ position: [0, 0, 3], fov: variant === "mobile" ? 22 : 40 }}
        gl={{ antialias: !isConstrained, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }}
        dpr={variant === "mobile" || isConstrained ? 1 : [1, 1.25]}
        shadows={!isConstrained}
        frameloop="demand"
      >
        <FrameScheduler enabled={shouldPreload && !isReady} />
        <StaticShadows enabled={!isConstrained} />
        <ambientLight intensity={0.27} />
        <fog attach="fog" args={["#050505", 5.5, 12]} />
        <directionalLight position={[4, 6, 5]} intensity={1.8} castShadow={!isConstrained} />
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
          castShadow={!isConstrained}
        />
        <Environment preset="warehouse" environmentIntensity={0.58} />
        <Suspense fallback={null}>
          <Model variant={variant} enableShadows={!isConstrained} maxAnisotropy={isConstrained ? 4 : 8} interactive={isInteractive} />
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.7}
            scale={7}
            blur={2.2}
            far={4}
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

/**
 * Рендерится внутри Suspense. Как только Suspense разрешился
 * (все useGLTF/Environment загрузились) — вызывает onReady на следующий кадр.
 */
function ReadyBeacon({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // ждём один кадр, чтобы GPU успел закомпилировать шейдеры/материалы
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
