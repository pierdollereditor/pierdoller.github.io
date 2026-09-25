"use client";

import { useEffect, useState } from "react";
import { WORKS } from "../data/works";

const DESKTOP_CRITICAL_IMAGES = Array.from(new Set(WORKS.map((work) => work.poster)));
const MOBILE_CRITICAL_IMAGES = Array.from(new Set(WORKS.map((work) => work.posterMobile)));

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function useAssetLoader() {
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    const criticalImages = DESKTOP_CRITICAL_IMAGES;
    if (criticalImages.length === 0) {
      return;
    }

    let cancelled = false;

    const bump = () => {
      if (cancelled) return;
      setLoadedImages((current) => current + 1);
    };

    criticalImages.forEach((src) => preloadImage(src).then(bump));

    return () => {
      cancelled = true;
    };
  }, []);

  const progress = Math.min(loadedImages, WORKS.length) / WORKS.length;
  const isReady = loadedImages >= WORKS.length;

  return { progress, isReady };
}
