import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function RecIndicator() {
  const [tc, setTc] = useState("00:00:00");
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [0, 1]);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const ms = Date.now() - start;
      const h = String(Math.floor(ms / 3600000) % 24).padStart(2, "0");
      const m = String(Math.floor(ms / 60000) % 60).padStart(2, "0");
      const s = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
      setTc(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div style={{ opacity }} className="fixed top-[68px] right-5 md:right-10 z-30 border border-[#8B0A1F]/60 px-2.5 py-1 font-mono text-[10px] md:text-[11px] tracking-widest text-[#8B0A1F] bg-black/40 backdrop-blur-sm flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8B0A1F] animate-pulse" />
      REC · {tc}
    </motion.div>
  );
}
