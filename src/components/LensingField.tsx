"use client";

import { useEffect, useRef } from "react";

const MAX_FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / MAX_FRAME_RATE;
const MAX_PIXEL_RATIO = 1;
const POINTER_FOLLOW_SPEED = 12;
const LINE_SAMPLE_STEP_PX = 28;
const MAX_FRAME_DELTA_SECONDS = 1 / 30;

export default function LensingField({ className = "", color = "#8B0A1F" }: { className?: string; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  const requestDrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    colorRef.current = color;
    requestDrawRef.current();
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const context = canvas.getContext("2d");
    if (!host || !context) return;
    const isConstrained = window.matchMedia("(pointer: coarse), (hover: none)").matches;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let frame = 0;
    let previousFrameTime = 0;
    let isVisible = false;
    let tabVisible =
      typeof document === "undefined" ? true : document.visibilityState !== "hidden";
    let cachedBounds: DOMRect | null = null;
    let drawWidth = 1;
    let drawHeight = 1;

    const clear = () => {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    };

    const readBounds = () => {
      if (!cachedBounds) cachedBounds = canvas.getBoundingClientRect();
      return cachedBounds;
    };
    const invalidateBounds = () => { cachedBounds = null; };

    const resize = () => {
      invalidateBounds();
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const bounds = canvas.getBoundingClientRect();
      cachedBounds = bounds;
      drawWidth = bounds.width;
      drawHeight = bounds.height;
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      if (!pointer.targetX) {
        pointer.x = pointer.targetX = bounds.width * 0.58;
        pointer.y = pointer.targetY = bounds.height * 0.48;
      }
      if (isVisible) startLoop();
    };

    const move = (event: PointerEvent) => {
      if (!isVisible) return;
      const bounds = readBounds();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      startLoop();
    };

    const reset = () => {
      const bounds = readBounds();
      pointer.targetX = bounds.width * 0.58;
      pointer.targetY = bounds.height * 0.48;
      startLoop();
    };

    const shouldRun = () => isVisible && tabVisible;

    const draw = (time: number) => {
      if (!shouldRun()) { frame = 0; return; }
      const elapsed = time - previousFrameTime;
      if (!isConstrained && previousFrameTime > 0 && elapsed + 0.5 < FRAME_INTERVAL) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const frameDelta = previousFrameTime > 0
        ? Math.min(elapsed / 1000, MAX_FRAME_DELTA_SECONDS)
        : 1 / MAX_FRAME_RATE;
      previousFrameTime = time - (elapsed % FRAME_INTERVAL);
      const width = drawWidth;
      const height = drawHeight;
      const pointerFollow = 1 - Math.exp(-POINTER_FOLLOW_SPEED * frameDelta);
      pointer.x += (pointer.targetX - pointer.x) * pointerFollow;
      pointer.y += (pointer.targetY - pointer.y) * pointerFollow;
      clear();
      context.lineWidth = 14;
      context.strokeStyle = colorRef.current;
      context.globalAlpha = 0.38;

      const lineGap = Math.max(72, width / 17);
      const lensRadius = Math.min(width, height) * 0.24;
      for (let line = -3; line < width / lineGap + 4; line += 1) {
        context.beginPath();
        for (let y = -80; y <= height + 80; y += LINE_SAMPLE_STEP_PX) {
          const baseX = line * lineGap + y * 0.22;
          const dx = baseX - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.max(28, Math.sqrt(dx * dx + dy * dy));
          const influence = Math.exp(-(distance * distance) / (lensRadius * lensRadius));
          const bend = influence * lensRadius * 0.48;
          const x = baseX + (dx / distance) * bend;
          const warpedY = y + (dy / distance) * bend * 0.24;
          if (y === -80) context.moveTo(x, warpedY);
          else context.lineTo(x, warpedY);
        }
        context.stroke();
      }
      const isMoving = Math.abs(pointer.targetX - pointer.x) > 0.1 || Math.abs(pointer.targetY - pointer.y) > 0.1;
      if (!isConstrained && isMoving) {
        frame = requestAnimationFrame(draw);
      } else {
        previousFrameTime = 0;
        frame = 0;
      }
    };

    const startLoop = () => {
      if (frame === 0 && shouldRun()) frame = requestAnimationFrame(draw);
    };
    requestDrawRef.current = startLoop;

    resize();
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startLoop();
      else {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        clear();
      }
    }, { rootMargin: "120px" });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const onVisibility = () => {
      tabVisible = document.visibilityState !== "hidden";
      if (tabVisible) startLoop();
      else {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        clear();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", invalidateBounds, { passive: true });
    if (!isConstrained) {
      host.addEventListener("pointermove", move, { passive: true });
      host.addEventListener("pointerleave", reset, { passive: true });
    }
    return () => {
      requestDrawRef.current = () => {};
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", invalidateBounds);
      if (!isConstrained) {
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", reset);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={`lensing-field ${className}`} aria-hidden="true" />;
}
