import { useEffect } from "react";
import Lenis from "lenis";

const SCROLL_DURATION_SECONDS = 1.35;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function useLenis() {
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse), (hover: none)").matches;

    const lenis = new Lenis({
      duration: SCROLL_DURATION_SECONDS,
      easing: easeOutCubic,
      smoothWheel: true,
      syncTouch: isTouch,
      syncTouchLerp: 0.075,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.15,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
