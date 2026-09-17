import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const MAX_FRAME_RATE = 60;

export default function FrameScheduler({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) return;
    invalidate();
    const interval = window.setInterval(invalidate, 1000 / MAX_FRAME_RATE);
    return () => window.clearInterval(interval);
  }, [enabled, invalidate]);

  return null;
}
