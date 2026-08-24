import { motion } from "motion/react";

export default function Marquee({
  text,
  variant = "blood",
  speed = 68,
  stackVariant = 0,
}: {
  text: string;
  variant?: "blood" | "ghost" | "caution";
  speed?: number;
  stackVariant?: 0 | 1 | 2;
}) {
  const phrase = `  ${text}  ★  `;
  const repeated = phrase.repeat(10);

  const styles =
    variant === "caution"
      ? "bg-[#F5C518] text-black border-y-2 border-black"
      : variant === "blood"
        ? "bg-[#8B0A1F] text-[#E8E4DC] border-y border-black/30"
        : "bg-transparent text-[#C0BDB3]/30 border-y border-[#C0BDB3]/10";

  return (
    <div className={`section-join caution-stack caution-variant-${stackVariant} relative w-full ${variant === "caution" ? "is-caution" : ""}`}>
      <div className={`relative w-full overflow-hidden py-2 md:py-2.5 ${styles}`}>
        {variant === "caution" && <div className="caution-stripes" />}
        <motion.div
          className="flex whitespace-nowrap font-mono text-[10px] md:text-[12px] font-black tracking-[0.25em] uppercase relative z-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        >
          <span>{repeated}</span>
          <span>{repeated}</span>
        </motion.div>
      </div>

      {variant === "caution" && (
        <>
          <div className="caution-overlap caution-overlap-left" aria-hidden="true">
            <motion.div
              className="caution-overlap-track"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: speed * 0.82, repeat: Infinity, ease: "linear" }}
            >
              <span>{repeated}</span><span>{repeated}</span>
            </motion.div>
          </div>
          <div className="caution-overlap caution-overlap-right" aria-hidden="true">
            <motion.div
              className="caution-overlap-track"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: speed * 1.08, repeat: Infinity, ease: "linear" }}
            >
              <span>{repeated}</span><span>{repeated}</span>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
