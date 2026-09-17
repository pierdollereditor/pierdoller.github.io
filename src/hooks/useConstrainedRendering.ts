"use client";

import { useSyncExternalStore } from "react";

const CONSTRAINED_RENDERING_QUERY = "(pointer: coarse), (hover: none)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(CONSTRAINED_RENDERING_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(CONSTRAINED_RENDERING_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useConstrainedRendering() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
