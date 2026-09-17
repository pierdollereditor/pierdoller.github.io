import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function StaticShadows({ enabled }: { enabled: boolean }) {
  const gl = useThree((state) => state.gl);
  const initialized = useRef(false);

  useFrame(() => {
    if (!enabled || initialized.current) return;
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    initialized.current = true;
  });

  useEffect(() => () => {
    if (enabled) gl.shadowMap.autoUpdate = true;
  }, [enabled, gl]);

  return null;
}
