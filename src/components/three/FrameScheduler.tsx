import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const MAX_FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / MAX_FRAME_RATE;

export default function FrameScheduler({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) return;
    invalidate();
    let frameId: number;
    let previousFrameTime = 0;

    const scheduleFrame = (time: number) => {
      const elapsed = time - previousFrameTime;
      if (previousFrameTime === 0 || elapsed >= FRAME_INTERVAL) {
        previousFrameTime = time - (elapsed % FRAME_INTERVAL);
        invalidate();
      }
      frameId = requestAnimationFrame(scheduleFrame);
    };

    frameId = requestAnimationFrame(scheduleFrame);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, invalidate]);

  return null;
}
