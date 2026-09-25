import { useEffect } from "react";

const MOBILE_VIEWPORT_QUERY = "(pointer: coarse), (hover: none)";
const ORIENTATION_UPDATE_DELAY_MS = 300;

export function useStableViewport() {
  useEffect(() => {
    if (!window.matchMedia(MOBILE_VIEWPORT_QUERY).matches) return;

    let orientationTimer = 0;

    const updateHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };
    const handleOrientationChange = () => {
      window.clearTimeout(orientationTimer);
      orientationTimer = window.setTimeout(updateHeight, ORIENTATION_UPDATE_DELAY_MS);
    };

    updateHeight();
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.clearTimeout(orientationTimer);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.documentElement.style.removeProperty("--app-height");
    };
  }, []);
}
