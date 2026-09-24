"use client";

import { useSyncExternalStore } from "react";

const CONSTRAINED_RENDERING_QUERY = "(pointer: coarse), (hover: none)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const LOW_POWER_MAX_MEMORY_GB = 4;
const LOW_POWER_MAX_LOGICAL_CORES = 4;

type NavigatorWithDeviceMemory = Navigator & { deviceMemory?: number };

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

function subscribeLowPower(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getLowPowerSnapshot() {
  const navigatorWithMemory = navigator as NavigatorWithDeviceMemory;
  const hasLowMemory = navigatorWithMemory.deviceMemory !== undefined
    && navigatorWithMemory.deviceMemory <= LOW_POWER_MAX_MEMORY_GB;
  const hasFewCores = navigator.hardwareConcurrency > 0
    && navigator.hardwareConcurrency <= LOW_POWER_MAX_LOGICAL_CORES;

  return window.matchMedia(REDUCED_MOTION_QUERY).matches || hasLowMemory || hasFewCores;
}

export function useLowPowerRendering() {
  return useSyncExternalStore(subscribeLowPower, getLowPowerSnapshot, getServerSnapshot);
}
