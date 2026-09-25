"use client";

import { useEffect, useRef } from "react";

const MAX_DPR = 1.25;
const POINTER_EASING = 0.06;

interface Sphere {
  baseX: number; // 0 to 1 normalized
  baseY: number; // 0 to 1 normalized
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  depth: number;
  opacity: number;
  phase: number;
  pulseSpeed: number;
}

export default function FooterBlackSpheres() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !footer || !context) return;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Generate balanced set of dark glowing spheres:
    // 5 large ambient dark spheres, 8 medium orbs, 9 floating motes
    const spheres: Sphere[] = [];
    const count = 22;

    for (let i = 0; i < count; i++) {
      let radius: number;
      let depth: number;
      let opacity: number;

      if (i < 5) {
        // Large ambient glow spheres
        radius = 160 + Math.random() * 120;
        depth = 0.35 + Math.random() * 0.3;
        opacity = 0.18 + Math.random() * 0.12;
      } else if (i < 13) {
        // Medium glow orbs
        radius = 70 + Math.random() * 70;
        depth = 0.6 + Math.random() * 0.4;
        opacity = 0.28 + Math.random() * 0.18;
      } else {
        // Floating crisp motes
        radius = 24 + Math.random() * 32;
        depth = 0.9 + Math.random() * 0.5;
        opacity = 0.38 + Math.random() * 0.22;
      }

      spheres.push({
        baseX: Math.random(),
        baseY: Math.random(),
        x: 0,
        y: 0,
        radius,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.22,
        depth,
        opacity,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.001 + Math.random() * 0.0015,
      });
    }

    const resize = () => {
      const bounds = footer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize pixel coordinates
      spheres.forEach((s) => {
        if (s.x === 0 && s.y === 0) {
          s.x = s.baseX * width;
          s.y = s.baseY * height;
        }
      });
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      currentX += (targetX - currentX) * POINTER_EASING;
      currentY += (targetY - currentY) * POINTER_EASING;

      context.clearRect(0, 0, width, height);

      spheres.forEach((sphere, index) => {
        // Organic sinusoidal drift
        sphere.x += sphere.vx * 60 * dt + Math.sin(time * 0.0012 + sphere.phase) * 0.25;
        sphere.y += sphere.vy * 60 * dt + Math.cos(time * 0.001 + sphere.phase) * 0.22;

        // Wrap boundaries smoothly
        const pad = sphere.radius;
        if (sphere.x < -pad) sphere.x = width + pad;
        if (sphere.x > width + pad) sphere.x = -pad;
        if (sphere.y < -pad) sphere.y = height + pad;
        if (sphere.y > height + pad) sphere.y = -pad;

        // Mouse parallax based on depth
        const drawX = sphere.x + currentX * sphere.depth * 45;
        const drawY = sphere.y + currentY * sphere.depth * 35;

        // Breathing pulse
        const pulse = 1 + Math.sin(time * sphere.pulseSpeed + sphere.phase) * 0.08;
        const currentRadius = sphere.radius * pulse;

        // Draw soft black glow sphere
        const grad = context.createRadialGradient(
          drawX,
          drawY,
          0,
          drawX,
          drawY,
          currentRadius
        );

        const alpha = sphere.opacity;
        grad.addColorStop(0, `rgba(8, 8, 8, ${alpha * 0.75})`);
        grad.addColorStop(0.22, `rgba(15, 15, 15, ${alpha * 0.5})`);
        grad.addColorStop(0.52, `rgba(25, 25, 25, ${alpha * 0.18})`);
        grad.addColorStop(0.8, `rgba(35, 35, 35, ${alpha * 0.04})`);
        grad.addColorStop(1, "rgba(35, 35, 35, 0)");

        context.fillStyle = grad;
        context.beginPath();
        context.arc(drawX, drawY, currentRadius, 0, Math.PI * 2);
        context.fill();

        // Extra subtle core highlight for smaller motes
        if (index >= 13) {
          context.fillStyle = `rgba(8, 8, 8, ${alpha * 0.3})`;
          context.beginPath();
          context.arc(drawX, drawY, currentRadius * 0.22, 0, Math.PI * 2);
          context.fill();
        }
      });

      frameId = requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = footer.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      targetY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(footer);
    footer.addEventListener("pointermove", handlePointerMove);
    footer.addEventListener("pointerleave", handlePointerLeave);
    resize();
    frameId = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId !== 0) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}
