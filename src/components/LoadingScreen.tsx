"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { CRITICAL_MODELS, ModelAssetPreloader, useAssetLoader } from "../hooks/useAssetLoader";

const COMPLETE_HOLD_MS = 260;
const EXIT_DURATION_MS = 900;
const MIN_VISIBLE_MS = 900; // не мигать, если всё в кэше

export default function LoadingScreen() {
  const [canPreloadModels, setCanPreloadModels] = useState(false);
  const [loadedModels, setLoadedModels] = useState(0);
  const { progress, isReady } = useAssetLoader(loadedModels);
  const [displayed, setDisplayed] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const mountedAt = useRef(performance.now());
  const modelToLoad = CRITICAL_MODELS[loadedModels];
  const handleModelReady = useCallback(() => {
    setLoadedModels((current) => Math.min(current + 1, CRITICAL_MODELS.length));
  }, []);

  useEffect(() => setCanPreloadModels(true), []);

  // Замок скролла, пока идёт загрузка
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isVisible) document.body.style.overflow = "";
  }, [isVisible]);

  // Плавная интерполяция displayed → target (не дёргается)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setDisplayed((prev) => {
        const target = progress * 100;
        const next = prev + (target - prev) * 0.12;
        if (Math.abs(target - next) < 0.15) return target;
        raf = requestAnimationFrame(tick);
        return next;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  // Уход, когда ассеты готовы + минимальное время показа
  useEffect(() => {
    if (!isReady) return;
    const elapsed = performance.now() - mountedAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const exitTimer = window.setTimeout(() => setIsLeaving(true), wait + COMPLETE_HOLD_MS);
    const hideTimer = window.setTimeout(() => setIsVisible(false), wait + COMPLETE_HOLD_MS + EXIT_DURATION_MS);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isReady]);

  if (!isVisible) return null;

  const shown = Math.round(displayed);
  return (
    <>
      {canPreloadModels && modelToLoad && (
        <Suspense fallback={null}>
          <ModelAssetPreloader key={modelToLoad} src={modelToLoad} onReady={handleModelReady} />
        </Suspense>
      )}
      <div className={`loading-screen ${isLeaving ? "is-leaving" : ""}`}>
        <div
          className="loading-screen-main"
          role="progressbar"
          aria-label="Loading assets"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
        >
          <div className="loading-screen-brand">PIERDOLLER</div>
          <div className="loading-screen-value">{String(shown).padStart(3, "0")}<small>%</small></div>
          <div className="loading-screen-track"><i style={{ width: `${displayed}%` }} /></div>
        </div>
      </div>
    </>
  );
}
