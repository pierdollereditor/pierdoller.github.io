import { useEffect } from "react";
import Lenis from "lenis";

const MAX_FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / MAX_FRAME_RATE;

export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (max-width: 900px)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    let previousFrameTime = 0;
    function raf(time: number) {
      const elapsed = time - previousFrameTime;
      if (previousFrameTime === 0 || elapsed + 0.5 >= FRAME_INTERVAL) {
        previousFrameTime = time - (elapsed % FRAME_INTERVAL);
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
