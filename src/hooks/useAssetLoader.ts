"use client";

import { useEffect, useRef, useState } from "react";
import { useEnvironment, useGLTF } from "@react-three/drei";
import { WORKS } from "../data/works";

const CRITICAL_IMAGES = Array.from(new Set([
  ...WORKS.map((work) => work.poster),
  "/images/bg-approach.webp",
]));

export const CRITICAL_MODELS = [
  "/models/worm_dossier_m.e.g_game_ready.glb",
  "/models/retro_crt_tv.glb",
];

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function ModelAssetPreloader({ src, onReady }: { src: string; onReady: () => void }) {
  useGLTF(src);
  const reported = useRef(false);
  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    onReady();
  }, [onReady]);
  return null;
}

export function useAssetLoader(loadedModels: number) {
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    useEnvironment.preload({ preset: "warehouse" });
    useEnvironment.preload({ preset: "night" });

    if (CRITICAL_IMAGES.length === 0) {
      return;
    }

    let cancelled = false;

    const bump = () => {
      if (cancelled) return;
      setLoadedImages((current) => current + 1);
    };

    CRITICAL_IMAGES.forEach((src) => preloadImage(src).then(bump));

    return () => {
      cancelled = true;
    };
  }, []);

  const completedModels = Math.min(loadedModels, CRITICAL_MODELS.length);
  const totalAssets = CRITICAL_IMAGES.length + CRITICAL_MODELS.length;
  const progress = (Math.min(loadedImages, CRITICAL_IMAGES.length) + completedModels) / totalAssets;
  const isReady = loadedImages >= CRITICAL_IMAGES.length && completedModels >= CRITICAL_MODELS.length;

  return { progress, isReady };
}
