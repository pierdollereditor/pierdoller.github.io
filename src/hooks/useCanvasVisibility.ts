"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Observes whether a container is near the viewport.
 * Returns a boolean used to switch a R3F Canvas between
 * `frameloop="always"` (visible) and `frameloop="never"` (offscreen).
 *
 * Also reacts to document.visibilityState so that background tabs
 * do not keep spending GPU cycles.
 */
export function useCanvasVisibility(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "160px",
) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let inView = false;
    let tabVisible =
      typeof document === "undefined" ? true : document.visibilityState !== "hidden";

    const update = () => setIsActive(inView && tabVisible);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { rootMargin },
    );
    observer.observe(element);

    const onVisibility = () => {
      tabVisible = document.visibilityState !== "hidden";
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, rootMargin]);

  return isActive;
}
