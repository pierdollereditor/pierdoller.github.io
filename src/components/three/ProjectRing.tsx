"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import AtmosphericHaze from "./AtmosphericHaze";
import { WORKS } from "../../data/works";
import { useCanvasVisibility } from "../../hooks/useCanvasVisibility";
import { useConstrainedRendering, useLowPowerRendering } from "../../hooks/useConstrainedRendering";

const BASE_RADIUS = 20;
const BASE_PANEL_ARC = Math.PI * 0.21;
const PANEL_WIDTH = BASE_RADIUS * BASE_PANEL_ARC;
const PANEL_ASPECT_RATIO = 21 / 9;
const CARD_ANGLE = (Math.PI * 2) / WORKS.length;
const MAX_PANEL_GAP = THREE.MathUtils.degToRad(14);
const PANEL_GAP = Math.min(MAX_PANEL_GAP, CARD_ANGLE * 0.25);
const PANEL_ARC = CARD_ANGLE - PANEL_GAP;
const RADIUS = PANEL_WIDTH / PANEL_ARC;
const PANEL_HEIGHT = PANEL_WIDTH / PANEL_ASPECT_RATIO;
const PANEL_SEGMENTS = 64;
const CAMERA_FOV_DEGREES = 50;
const DESKTOP_CAMERA_FIT_PADDING = 0.86;
const TABLET_CAMERA_FIT_PADDING = 1.05;
const MOBILE_CAMERA_FIT_PADDING = 1.2;
const DESKTOP_MAX_PIXEL_RATIO = 2.5;
const CONSTRAINED_MAX_PIXEL_RATIO = 2;
const LOW_POWER_MAX_PIXEL_RATIO = 1.5;
const DESKTOP_DRAG_RETURN_DURATION_SECONDS = 0.8;
const MOBILE_DRAG_RETURN_DURATION_SECONDS = 0.6;
const MOBILE_MIN_SNAP_DURATION_SECONDS = 0.85;
const DESKTOP_DRAG_THRESHOLD_PX = 60;
const MOBILE_DRAG_THRESHOLD_PX = 56;
const DESKTOP_DRAG_ROTATION_DISTANCE_PX = 200;
const MOBILE_DRAG_ROTATION_DISTANCE_PX = 210;
const DESKTOP_DRAG_FOLLOW_DAMPING = 30;
const MOBILE_DRAG_FOLLOW_DAMPING = 24;
const DRAG_RUBBER_BAND_EXTRA = 0.02;
const MAX_DRAG_ANGLE = CARD_ANGLE / 3;
const IDLE_DRIFT_SPEED = THREE.MathUtils.degToRad(2.2);
const DESKTOP_TILT_X = THREE.MathUtils.degToRad(-13);
const MOBILE_TILT_X = THREE.MathUtils.degToRad(-5);
const DESKTOP_RING_SCALE = 1.48;
const TABLET_RING_SCALE = 1.1;
const MAX_FRAME_DELTA_SECONDS = 1 / 30;

type SnapAnimation = {
  active: boolean;
  from: number;
  to: number;
  elapsed: number;
  duration: number;
};

function getClosestRotationTarget(current: number, target: number) {
  const fullTurn = Math.PI * 2;
  return target + Math.round((current - target) / fullTurn) * fullTurn;
}

function easeInOutSine(progress: number) {
  return (1 - Math.cos(Math.PI * progress)) / 2;
}

function rubberBandAngle(value: number, limit: number, extra: number) {
  const magnitude = Math.abs(value);
  if (magnitude <= limit) return value;
  const overflow = magnitude - limit;
  const stretched = extra * (1 - Math.exp(-overflow / (limit * 0.4)));
  return (value < 0 ? -1 : 1) * (limit + stretched);
}

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

export default function ProjectRing({
  active,
  position,
  snapDuration,
  fogColor,
  accentColor,
  onPositionChange,
  onDragChange,
}: {
  active: boolean;
  position: number;
  snapDuration: number;
  fogColor: string;
  accentColor: string;
  onPositionChange: (position: number) => void;
  onDragChange?: (dragging: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInView: shouldRender } = useCanvasVisibility(containerRef, "800px");
  const isConstrained = useConstrainedRendering();
  const isLowPower = useLowPowerRendering();
  const maxPixelRatio = isLowPower
    ? LOW_POWER_MAX_PIXEL_RATIO
    : isConstrained
      ? CONSTRAINED_MAX_PIXEL_RATIO
      : DESKTOP_MAX_PIXEL_RATIO;

  return (
    <div ref={containerRef} className="ape-ring-canvas" aria-hidden="true">
      {shouldRender && (
      <Canvas
        camera={{ position: [0, 1.2, 18], fov: CAMERA_FOV_DEGREES, near: 0.1, far: 110 }}
        dpr={[1, maxPixelRatio]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <AtmosphericHaze
            fogColor={fogColor}
            accentColor={accentColor}
            isMobile={isConstrained}
          />
          <Ring
            active={active}
            position={position}
            snapDuration={snapDuration}
            fogColor={fogColor}
            maxAnisotropy={16}
            onPositionChange={onPositionChange}
            onDragChange={onDragChange}
          />
        </Suspense>
      </Canvas>
      )}
    </div>
  );
}

function Ring({ active, position, snapDuration, fogColor, maxAnisotropy, onPositionChange, onDragChange }: { active: boolean; position: number; snapDuration: number; fogColor: string; maxAnisotropy: number; onPositionChange: (position: number) => void; onDragChange?: (dragging: boolean) => void }) {
  const outerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const currentRotation = useRef(-position * CARD_ANGLE);
  const dragTargetRotation = useRef(currentRotation.current);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const dragging = useRef(false);
  const animation = useRef<SnapAnimation>({ active: false, from: 0, to: 0, elapsed: 0, duration: snapDuration });
  const geometry = useMemo(createCurvedPanelGeometry, []);
  const { camera, gl, invalidate, size, scene } = useThree();

  const startSnap = (target: number, duration = snapDuration) => {
    animation.current = {
      active: true,
      from: currentRotation.current,
      to: target,
      elapsed: 0,
      duration,
    };
    invalidate();
  };

  useEffect(() => {
    const duration = size.width <= 640
      ? Math.max(snapDuration, MOBILE_MIN_SNAP_DURATION_SECONDS)
      : snapDuration;
    startSnap(getClosestRotationTarget(currentRotation.current, -position * CARD_ANGLE), duration);
  }, [position, size.width, snapDuration]);

  useEffect(() => {
    scene.fog = new THREE.Fog(fogColor, 20, 78);
    return () => {
      scene.fog = null;
    };
  }, [fogColor, scene]);

  useEffect(() => () => {
    geometry.dispose();
  }, [geometry]);

  useEffect(() => {
    const canvas = gl.domElement;
    const mobile = size.width <= 640;
    const dragDistance = mobile
      ? MOBILE_DRAG_ROTATION_DISTANCE_PX
      : DESKTOP_DRAG_ROTATION_DISTANCE_PX;
    const dragThreshold = mobile ? MOBILE_DRAG_THRESHOLD_PX : DESKTOP_DRAG_THRESHOLD_PX;
    const returnDuration = mobile
      ? MOBILE_DRAG_RETURN_DURATION_SECONDS
      : DESKTOP_DRAG_RETURN_DURATION_SECONDS;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging.current = true;
      animation.current.active = false;
      dragStartX.current = event.clientX;
      dragStartRotation.current = currentRotation.current;
      dragTargetRotation.current = currentRotation.current;
      onDragChange?.(true);
      if (event.pointerType === "mouse") canvas.setPointerCapture(event.pointerId);
      invalidate();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      if (event.pointerType === "mouse") event.stopPropagation();
      const offset = event.clientX - dragStartX.current;
      const dragAngle = rubberBandAngle(
        (offset / dragDistance) * MAX_DRAG_ANGLE,
        MAX_DRAG_ANGLE,
        MAX_DRAG_ANGLE * DRAG_RUBBER_BAND_EXTRA,
      );
      dragTargetRotation.current = dragStartRotation.current + dragAngle;
      invalidate();
    };

    const finishPointer = (event: PointerEvent, cancelled: boolean) => {
      if (!dragging.current) return;
      const offset = event.clientX - dragStartX.current;
      const targetPosition = !cancelled && Math.abs(offset) >= dragThreshold
        ? position + (offset < 0 ? 1 : -1)
        : position;
      dragging.current = false;
      onDragChange?.(false);
      if (targetPosition === position) {
        startSnap(
          getClosestRotationTarget(currentRotation.current, -position * CARD_ANGLE),
          returnDuration,
        );
      } else {
        onPositionChange(targetPosition);
      }
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    const handlePointerUp = (event: PointerEvent) => finishPointer(event, false);
    const handlePointerCancel = (event: PointerEvent) => finishPointer(event, true);

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [gl, invalidate, onPositionChange, onDragChange, position, size.width, snapDuration]);

  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, MAX_FRAME_DELTA_SECONDS);
    const mobile = size.width <= 640;
    const dragFollowDamping = mobile
      ? MOBILE_DRAG_FOLLOW_DAMPING
      : DESKTOP_DRAG_FOLLOW_DAMPING;
    const tablet = size.width <= 900;
    const viewportScale = mobile ? 1 : tablet ? TABLET_RING_SCALE : DESKTOP_RING_SCALE;
    const viewportAspect = size.width / size.height;
    const verticalFov = THREE.MathUtils.degToRad(CAMERA_FOV_DEGREES);
    const halfViewFactor = 2 * Math.tan(verticalFov / 2);
    const fitPadding = mobile
      ? MOBILE_CAMERA_FIT_PADDING
      : tablet
        ? TABLET_CAMERA_FIT_PADDING
        : DESKTOP_CAMERA_FIT_PADDING;
    const horizontalFit = PANEL_WIDTH / (halfViewFactor * viewportAspect) * fitPadding;
    const verticalFit = PANEL_HEIGHT / halfViewFactor * fitPadding;
    const targetCameraY = mobile ? 0 : tablet ? 0.7 : 1.35;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCameraY, 4, frameDelta);
    camera.position.z = (RADIUS + Math.max(horizontalFit, verticalFit)) * viewportScale;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = mobile ? 28 : tablet ? 24 : 20;
      scene.fog.far = mobile ? 78 : tablet ? 74 : 78;
    }

    if (outerRef.current) {
      const targetX = mobile || tablet ? 0 : 0.85;
      const targetY = mobile ? 0.4 : tablet ? -1.7 : -5.4;
      outerRef.current.position.x = THREE.MathUtils.damp(outerRef.current.position.x, targetX, 3, frameDelta);
      outerRef.current.position.y = THREE.MathUtils.damp(outerRef.current.position.y, targetY, 3, frameDelta);
      outerRef.current.scale.setScalar(viewportScale);
      if (!dragging.current) {
        const tiltX = mobile ? MOBILE_TILT_X : DESKTOP_TILT_X;
        outerRef.current.rotation.x = THREE.MathUtils.damp(outerRef.current.rotation.x, tiltX, 2.5, frameDelta);
        outerRef.current.rotation.z = THREE.MathUtils.damp(outerRef.current.rotation.z, 0.08, 2.5, frameDelta);
      }
    }

    if (dragging.current) {
      currentRotation.current = THREE.MathUtils.damp(
        currentRotation.current,
        dragTargetRotation.current,
        dragFollowDamping,
        frameDelta,
      );
    } else if (animation.current.active) {
      animation.current.elapsed += frameDelta;
      const progress = Math.min(1, animation.current.elapsed / animation.current.duration);
      const eased = easeInOutSine(progress);
      currentRotation.current = THREE.MathUtils.lerp(animation.current.from, animation.current.to, eased);
      if (progress === 1) {
        currentRotation.current = animation.current.to;
        animation.current.active = false;
      }
    } else if (active) {
      currentRotation.current -= IDLE_DRIFT_SPEED * frameDelta;
    }

    if (ringRef.current) ringRef.current.rotation.y = currentRotation.current;
  });

  return (
    <group ref={outerRef}>
      <group ref={ringRef}>
        {WORKS.map((work, index) => (
          <group key={`${work.id}-${index}`} rotation-y={index * CARD_ANGLE}>
            <Panel
              geometry={geometry}
              poster={work.poster}
              maxAnisotropy={maxAnisotropy}
            />
          </group>
        ))}
      </group>
    </group>
  );
}

function Panel({ geometry, poster, maxAnisotropy }: {
  geometry: THREE.BufferGeometry;
  poster: string;
  maxAnisotropy: number;
}) {
  const texture = useTexture(poster);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = maxAnisotropy;
    texture.needsUpdate = true;
  }, [maxAnisotropy, texture]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} fog />
    </mesh>
  );
}
