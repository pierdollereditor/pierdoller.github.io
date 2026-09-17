"use client";

import { useEffect, useRef } from "react";
import { WORKS } from "../data/works";

const MAX_DPR = 1.25;
const POINTER_EASING = 0.08;
const SETTLE_THRESHOLD = 0.001;
const CARD_BLUR = "blur(2.5px)";

const CARD_LAYOUT = [
  { x: 0.01, y: 0.18, rotation: -0.13, depth: 0.55 },
  { x: 0.12, y: 0.68, rotation: 0.08, depth: 0.9 },
  { x: 0.84, y: 0.16, rotation: -0.06, depth: 0.7 },
  { x: 0.99, y: 0.55, rotation: 0.12, depth: 1 },
  { x: 0.84, y: 0.82, rotation: -0.04, depth: 0.4 },
] as const;

export default function FooterCollage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !footer || !context) return;

    const images = WORKS.map((work) => {
      const image = new Image();
      image.decoding = "async";
      image.src = work.poster;
      return image;
    });
    let width = 0;
    let height = 0;
    let loaded = false;
    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const drawCover = (image: HTMLImageElement, cardWidth: number, cardHeight: number) => {
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const cardRatio = cardWidth / cardHeight;
      const sourceWidth = imageRatio > cardRatio ? image.naturalHeight * cardRatio : image.naturalWidth;
      const sourceHeight = imageRatio > cardRatio ? image.naturalHeight : image.naturalWidth / cardRatio;
      const sourceX = (image.naturalWidth - sourceWidth) / 2;
      const sourceY = (image.naturalHeight - sourceHeight) / 2;
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (!loaded) return;
      const compact = width < 700;
      const cardWidth = compact ? Math.min(width * 0.58, 300) : Math.min(width * 0.27, 460);
      const cardHeight = cardWidth * (9 / 21);

      CARD_LAYOUT.forEach((layout, index) => {
        const image = images[index % images.length];
        if (!image.naturalWidth) return;
        const x = width * layout.x + currentX * layout.depth * 34;
        const y = height * layout.y + currentY * layout.depth * 24;
        context.save();
        context.translate(x, y);
        context.rotate(layout.rotation + currentX * layout.depth * 0.018);
        context.beginPath();
        context.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 4);
        context.clip();
        context.globalAlpha = compact ? 0.14 : 0.19;
        context.filter = CARD_BLUR;
        drawCover(image, cardWidth, cardHeight);
        context.filter = "none";
        context.fillStyle = "rgba(5, 5, 5, 0.28)";
        context.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
        context.restore();
      });
    };

    const animate = () => {
      currentX += (targetX - currentX) * POINTER_EASING;
      currentY += (targetY - currentY) * POINTER_EASING;
      draw();
      if (Math.abs(targetX - currentX) > SETTLE_THRESHOLD || Math.abs(targetY - currentY) > SETTLE_THRESHOLD) {
        frameId = requestAnimationFrame(animate);
      } else {
        currentX = targetX;
        currentY = targetY;
        frameId = 0;
        draw();
      }
    };

    const schedule = () => {
      if (frameId === 0) frameId = requestAnimationFrame(animate);
    };

    const resize = () => {
      const bounds = footer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = footer.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      targetY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
      schedule();
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    const imageReady = (image: HTMLImageElement) => new Promise<void>((resolve) => {
      if (image.complete) {
        resolve();
        return;
      }
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });

    Promise.all(images.map(imageReady)).then(() => {
      loaded = true;
      draw();
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(footer);
    footer.addEventListener("pointermove", handlePointerMove);
    footer.addEventListener("pointerleave", handlePointerLeave);
    resize();

    return () => {
      resizeObserver.disconnect();
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId !== 0) cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-collage" aria-hidden="true" />;
}
