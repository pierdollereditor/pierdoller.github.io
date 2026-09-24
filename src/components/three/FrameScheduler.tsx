import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function FrameScheduler({ enabled, maxFrameRate = 60 }: { enabled: boolean; maxFrameRate?: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) return;
    const frameInterval = 1000 / maxFrameRate;
    invalidate();
    let frameId: number;
    let previousFrameTime = 0;

    const scheduleFrame = (time: number) => {
      const elapsed = time - previousFrameTime;
      if (previousFrameTime === 0 || elapsed >= frameInterval) {
        previousFrameTime = time - (elapsed % frameInterval);
        invalidate();
      }
      frameId = requestAnimationFrame(scheduleFrame);
    };

    frameId = requestAnimationFrame(scheduleFrame);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, invalidate, maxFrameRate]);

  return null;
}
