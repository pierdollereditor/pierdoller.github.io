"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { WORKS } from "../../data/works";
import { deviceTilt } from "../../hooks/useDeviceTilt";

const RADIUS = 20;
const PANEL_ARC = Math.PI * 0.21;
const PANEL_HEIGHT = (RADIUS * PANEL_ARC) / (21 / 9);
const PANEL_SEGMENTS = 48;
const RING_WORKS = [...WORKS, ...WORKS];
const CARD_ANGLE = (Math.PI * 2) / RING_WORKS.length;
const DRAG_SNAP_DURATION_SECONDS = 0.7;
const DRAG_THRESHOLD_PX = 36;
const MAX_DRAG_ANGLE = THREE.MathUtils.degToRad(18);
const IDLE_DRIFT_SPEED = THREE.MathUtils.degToRad(1.7);
const MAX_IDLE_DRIFT = THREE.MathUtils.degToRad(12);
const DESKTOP_TILT_X = THREE.MathUtils.degToRad(-8);
const MOBILE_TILT_X = THREE.MathUtils.degToRad(-5);

type SnapAnimation = {
  active: boolean;
  from: number;
  to: number;
  elapsed: number;
  duration: number;
};

function createCurvedPanelGeometry() {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= 1; row += 1) {
    const y = (0.5 - row) * PANEL_HEIGHT;
    for (let segment = 0; segment <= PANEL_SEGMENTS; segment += 1) {
      const u = segment / PANEL_SEGMENTS;
      const angle = (u - 0.5) * PANEL_ARC;
      positions.push(Math.sin(angle) * RADIUS, y, Math.cos(angle) * RADIUS);
      uvs.push(u, 1 - row);
    }
  }

  for (let segment = 0; segment < PANEL_SEGMENTS; segment += 1) {
    const topLeft = segment;
    const topRight = segment + 1;
    const bottomLeft = segment + PANEL_SEGMENTS + 1;
    const bottomRight = bottomLeft + 1;
    indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function ProjectRing({ position, snapDuration, fogColor, onPositionChange }: { position: number; snapDuration: number; fogColor: string; onPositionChange: (position: number) => void }) {
  return (
    <div className="ape-ring-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 100 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Ring position={position} snapDuration={snapDuration} fogColor={fogColor} onPositionChange={onPositionChange} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Ring({ position, snapDuration, fogColor, onPositionChange }: { position: number; snapDuration: number; fogColor: string; onPositionChange: (position: number) => void }) {
  const outerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const currentRotation = useRef(-position * CARD_ANGLE);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const targetRotation = useRef(-position * CARD_ANGLE);
  const dragging = useRef(false);
  const pressedScale = useRef(1);
  const animation = useRef<SnapAnimation>({ active: false, from: 0, to: 0, elapsed: 0, duration: snapDuration });
  const geometry = useMemo(createCurvedPanelGeometry, []);
  const { camera, size, scene } = useThree();

  const startSnap = (target: number, duration = snapDuration) => {
    animation.current = {
      active: true,
      from: currentRotation.current,
      to: target,
      elapsed: 0,
      duration,
    };
  };

  useEffect(() => {
    targetRotation.current = -position * CARD_ANGLE;
    startSnap(targetRotation.current);
  }, [position, snapDuration]);

  useEffect(() => {
    scene.fog = new THREE.Fog(fogColor, 10, 39);
    return () => {
      scene.fog = null;
    };
  }, [fogColor, scene]);

  useEffect(() => () => {
    geometry.dispose();
  }, [geometry]);

  useFrame((state, delta) => {
    const mobile = size.width <= 640;
    const tablet = size.width <= 900;
    const cameraTarget = mobile ? 46.5 : tablet ? 35.2 : 26.8;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTarget, 5, delta);
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = mobile ? 34 : tablet ? 18 : 10;
      scene.fog.far = mobile ? 72 : tablet ? 52 : 39;
    }

    if (outerRef.current) {
      const targetX = mobile ? 0 : tablet ? 0.4 : 0.8;
      const targetY = mobile ? 1.2 : tablet ? -1.35 : -2.55;
      const tiltX = mobile ? MOBILE_TILT_X : DESKTOP_TILT_X;
      const motionX = Math.max(-1, Math.min(1, state.pointer.x + deviceTilt.x));
      const motionY = Math.max(-1, Math.min(1, state.pointer.y + deviceTilt.y));
      outerRef.current.position.x = THREE.MathUtils.damp(outerRef.current.position.x, targetX, 5, delta);
      outerRef.current.position.y = THREE.MathUtils.damp(outerRef.current.position.y, targetY, 5, delta);
      outerRef.current.rotation.x = THREE.MathUtils.damp(outerRef.current.rotation.x, tiltX + motionY * -0.04, 4, delta);
      outerRef.current.rotation.z = THREE.MathUtils.damp(outerRef.current.rotation.z, 0.11 + motionX * -0.025, 4, delta);
    }

    pressedScale.current = THREE.MathUtils.damp(pressedScale.current, dragging.current ? 0.94 : 1, 10, delta);
    if (outerRef.current) outerRef.current.scale.setScalar(pressedScale.current);

    if (!dragging.current && animation.current.active) {
      animation.current.elapsed += delta;
      const progress = Math.min(1, animation.current.elapsed / animation.current.duration);
      const eased = animation.current.duration <= 1
        ? 1 - Math.pow(1 - progress, 3)
        : progress < 0.68
          ? (progress / 0.68) * 0.2
          : 0.2 + 0.8 * (1 - Math.pow(1 - (progress - 0.68) / 0.32, 3));
      currentRotation.current = THREE.MathUtils.lerp(animation.current.from, animation.current.to, eased);
      if (progress === 1) {
        currentRotation.current = animation.current.to;
        animation.current.active = false;
      }
    } else if (!dragging.current) {
      currentRotation.current = Math.max(
        targetRotation.current - MAX_IDLE_DRIFT,
        currentRotation.current - IDLE_DRIFT_SPEED * delta,
      );
    }

    if (ringRef.current) ringRef.current.rotation.y = currentRotation.current;
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    dragging.current = true;
    animation.current.active = false;
    dragStartX.current = event.clientX;
    dragStartRotation.current = currentRotation.current;
    const target = event.target as EventTarget & { setPointerCapture?: (pointerId: number) => void };
    target?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const offset = event.clientX - dragStartX.current;
    const resistedAngle = Math.tanh(offset / 180) * MAX_DRAG_ANGLE;
    currentRotation.current = dragStartRotation.current + resistedAngle;
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const offset = event.clientX - dragStartX.current;
    const targetPosition = Math.abs(offset) >= DRAG_THRESHOLD_PX
      ? position + (offset < 0 ? 1 : -1)
      : position;
    dragging.current = false;
    onPositionChange(targetPosition);
    startSnap(-targetPosition * CARD_ANGLE, DRAG_SNAP_DURATION_SECONDS);
    const target = event.target as EventTarget & { releasePointerCapture?: (pointerId: number) => void };
    target?.releasePointerCapture?.(event.pointerId);
  };

  return (
    <group ref={outerRef}>
      <group ref={ringRef}>
        {RING_WORKS.map((work, index) => (
          <group key={`${work.id}-${index}`} rotation-y={index * CARD_ANGLE}>
            <Panel
              geometry={geometry}
              poster={work.poster}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          </group>
        ))}
      </group>
    </group>
  );
}

function Panel({ geometry, poster, onPointerDown, onPointerMove, onPointerUp }: {
  geometry: THREE.BufferGeometry;
  poster: string;
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void;
}) {
  const texture = useTexture(poster);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return (
    <mesh
      geometry={geometry}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} fog />
    </mesh>
  );
}
