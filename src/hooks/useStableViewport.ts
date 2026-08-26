import { useEffect } from "react";

export function useStableViewport() {
  useEffect(() => {
    let viewportWidth = window.innerWidth;

    const updateHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    const handleResize = () => {
      if (window.innerWidth === viewportWidth) return;
      viewportWidth = window.innerWidth;
      updateHeight();
    };

    updateHeight();
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", updateHeight);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);
}
