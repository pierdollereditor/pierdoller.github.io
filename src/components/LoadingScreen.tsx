"use client";

import { useEffect, useState } from "react";

const LOAD_DURATION_MS = 3600;
const COMPLETE_HOLD_MS = 280;
const EXIT_DURATION_MS = 1000;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    let exitTimer = 0;
    let hideTimer = 0;

    const animate = (time: number) => {
      const elapsed = Math.min((time - startedAt) / LOAD_DURATION_MS, 1);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      setProgress(Math.min(100, eased * 100));
      if (elapsed < 1) {
        frame = requestAnimationFrame(animate);
        return;
      }
      exitTimer = window.setTimeout(() => setIsLeaving(true), COMPLETE_HOLD_MS);
      hideTimer = window.setTimeout(() => setIsVisible(false), COMPLETE_HOLD_MS + EXIT_DURATION_MS);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) document.body.style.overflow = "";
  }, [isVisible]);

  if (!isVisible) return null;

  const displayProgress = Math.round(progress);
  return (
    <div className={`loading-screen ${isLeaving ? "is-leaving" : ""}`}>
      <div
        className="loading-screen-main"
        role="progressbar"
        aria-label="Loading 3D models"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayProgress}
      >
        <div className="loading-screen-brand">PIERDOLLER</div>
        <div className="loading-screen-value">{String(displayProgress).padStart(3, "0")}<small>%</small></div>
        <div className="loading-screen-track"><i style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  );
}
