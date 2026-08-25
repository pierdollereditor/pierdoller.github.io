import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

const EXIT_DELAY_MS = 350;
const FALLBACK_DELAY_MS = 12000;

export default function LoadingScreen() {
  const { active, progress, loaded, total } = useProgress();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (total === 0 || active || progress < 100) return;
    const exitTimer = window.setTimeout(() => setIsLeaving(true), EXIT_DELAY_MS);
    const hideTimer = window.setTimeout(() => setIsVisible(false), EXIT_DELAY_MS + 550);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [active, progress, total]);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setIsLeaving(true);
      window.setTimeout(() => setIsVisible(false), 550);
    }, FALLBACK_DELAY_MS);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) document.body.style.overflow = "";
  }, [isVisible]);

  if (!isVisible) return null;

  const displayProgress = total === 0 ? 0 : Math.round(progress);

  return (
    <div className={`loading-screen ${isLeaving ? "is-leaving" : ""}`}>
      <div className="loading-screen-grid" aria-hidden="true" />
      <div className="loading-screen-top">
        <span>P.D.</span>
        <span>Archive boot / 06.21</span>
      </div>

      <div
        className="loading-screen-main"
        role="progressbar"
        aria-label="Loading 3D models"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayProgress}
      >
        <div className="loading-screen-status"><i /> Loading assets</div>
        <div className="loading-screen-value">{String(displayProgress).padStart(3, "0")}<small>%</small></div>
        <div className="loading-screen-track"><i style={{ width: `${displayProgress}%` }} /></div>
        <div className="loading-screen-meta">
          <span>Models / textures</span>
          <span>{String(loaded).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="loading-screen-bottom">
        <span>Do not close transmission</span>
        <span>Three.js / WebGL</span>
      </div>
    </div>
  );
}
