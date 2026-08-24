import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Environment, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = new URL("../../../document_file_folder.glb", import.meta.url).href;
const CAMERA_POSITION = new THREE.Vector3(-5.1, 1.3, 7.6);
const CAMERA_DIRECTION = CAMERA_POSITION.clone().normalize();
const SCREEN_RIGHT = new THREE.Vector3(0, 1, 0).cross(CAMERA_DIRECTION).normalize();
const FACE_QUATERNION = new THREE.Quaternion().setFromUnitVectors(
  new THREE.Vector3(0, 1, 0),
  CAMERA_DIRECTION,
);
const MODEL_QUATERNION = FACE_QUATERNION
  .clone()
  .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(2, 1, -0.9), -0.50))
  .premultiply(new THREE.Quaternion().setFromAxisAngle(SCREEN_RIGHT, Math.PI / 6));
const POINTER_EULER = new THREE.Euler();
const POINTER_QUATERNION = new THREE.Quaternion();
const TARGET_QUATERNION = new THREE.Quaternion();

function Model() {
  const { scene, animations } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.7;
          material.needsUpdate = true;
        }
      });
    });
    return model;
  }, [scene]);
  const ref = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, ref);

  useEffect(() => {
    const action = actions.Anim;
    if (!action) return;
    action.reset().play();
    action.time = 1.25;
    action.paused = true;
    mixer.update(0);
    return () => {
      action.stop();
    };
  }, [actions, mixer]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 0.05, 0.035);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, state.pointer.y * 0.03, 0.035);
    POINTER_EULER.set(-state.pointer.y * 0.05, 0, -state.pointer.x * 0.08);
    POINTER_QUATERNION.setFromEuler(POINTER_EULER);
    TARGET_QUATERNION.copy(MODEL_QUATERNION).multiply(POINTER_QUATERNION);
    ref.current.quaternion.slerp(TARGET_QUATERNION, 0.035);
  });

  return (
    <group ref={ref} quaternion={MODEL_QUATERNION}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function HeroCharacter({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: 32 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 0.78;
        }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={0.16} />
        <directionalLight position={[-4, 6, 5]} intensity={1.7} color="#C0BDB3" castShadow />
        <pointLight position={[4, 1, 4]} intensity={12} distance={12} color="#8B0A1F" />
        <pointLight position={[-4, -2, 2]} intensity={7} distance={10} color="#3A030D" />
        <Environment preset="warehouse" environmentIntensity={0.42} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={0.27}>
            <Model />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
