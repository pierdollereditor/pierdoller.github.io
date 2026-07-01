import { motion } from "motion/react";

export default function Marquee({
  text,
  variant = "blood",
  speed = 35,
}: {
  text: string;
  variant?: "blood" | "ghost" | "caution";
  speed?: number;
}) {
  const phrase = `  ${text}  ★  `;
  const repeated = phrase.repeat(10);

  const styles =
    variant === "caution"
      ? "bg-[#F5C518] text-black border-y-4 border-black"
      : variant === "blood"
        ? "bg-[#8B0A1F] text-[#E8E4DC] border-y border-black/30"
        : "bg-transparent text-[#C0BDB3]/30 border-y border-[#C0BDB3]/10";

  return (
    <div
      className={`section-join relative w-full overflow-hidden py-2.5 md:py-3 ${styles}`}
      style={{
        transform: "rotate(-2deg) scale(1.05)",
        transformOrigin: "center",
      }}
    >
      {/* Diagonal black stripes for caution feel */}
      {variant === "caution" && (
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 14px, #000 14px, #000 28px)",
          }}
        />
      )}

      <motion.div
        className="flex whitespace-nowrap font-mono text-[11px] md:text-[13px] font-black tracking-[0.25em] uppercase relative z-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        <span>{repeated}</span>
        <span>{repeated}</span>
      </motion.div>
    </div>
  );
}
