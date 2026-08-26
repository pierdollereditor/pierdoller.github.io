"use client";

import { useEffect, useRef } from "react";

export default function LensingField({ className = "", color = "#8B0A1F" }: { className?: string; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let frame = 0;
    let isVisible = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!pointer.targetX) {
        pointer.x = pointer.targetX = bounds.width * 0.58;
        pointer.y = pointer.targetY = bounds.height * 0.48;
      }
    };

    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
    };

    const draw = () => {
      if (!isVisible) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      pointer.x += (pointer.targetX - pointer.x) * 0.09;
      pointer.y += (pointer.targetY - pointer.y) * 0.09;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 14;
      context.strokeStyle = color;
      context.globalAlpha = 0.38;

      const lineGap = Math.max(72, width / 17);
      const lensRadius = Math.min(width, height) * 0.24;
      for (let line = -3; line < width / lineGap + 4; line += 1) {
        context.beginPath();
        for (let y = -80; y <= height + 80; y += 18) {
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
      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        frame = requestAnimationFrame(draw);
      } else if (!entry.isIntersecting) {
        isVisible = false;
        cancelAnimationFrame(frame);
      }
    }, { rootMargin: "120px" });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [color]);

  return <canvas ref={canvasRef} className={`lensing-field ${className}`} aria-hidden="true" />;
}
