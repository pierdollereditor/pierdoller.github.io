import { useEffect } from "react";

export const deviceTilt = { x: 0, y: 0 };

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function useDeviceTilt() {
  useEffect(() => {
    if (!("DeviceOrientationEvent" in window)) return;

    let listening = false;
    let baseBeta: number | null = null;
    let baseGamma: number | null = null;

    const updateTilt = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      baseBeta ??= event.beta;
      baseGamma ??= event.gamma;
      deviceTilt.x = Math.max(-1, Math.min(1, (event.gamma - baseGamma) / 24));
      deviceTilt.y = Math.max(-1, Math.min(1, (event.beta - baseBeta) / 24));
    };

    const startListening = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("deviceorientation", updateTilt, { passive: true });
    };

    const enableTilt = async () => {
      const OrientationEvent = DeviceOrientationEvent as DeviceOrientationEventWithPermission;
      if (typeof OrientationEvent.requestPermission === "function") {
        const permission = await OrientationEvent.requestPermission().catch(() => "denied" as const);
        if (permission !== "granted") return;
      }
      startListening();
    };

    const OrientationEvent = DeviceOrientationEvent as DeviceOrientationEventWithPermission;
    if (typeof OrientationEvent.requestPermission === "function") {
      window.addEventListener("pointerdown", enableTilt, { once: true });
    } else {
      startListening();
    }

    return () => {
      window.removeEventListener("pointerdown", enableTilt);
      window.removeEventListener("deviceorientation", updateTilt);
      deviceTilt.x = 0;
      deviceTilt.y = 0;
    };
  }, []);
}
