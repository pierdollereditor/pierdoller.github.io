import { motion } from "motion/react";

export default function Atmosphere() {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layered fog gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0807] via-[#1A1714] to-[#0A0807]" />
      <motion.div
        animate={{ x: ["-10%", "10%", "-10%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-x-20 top-0 h-full bg-[radial-gradient(ellipse_at_center,rgba(200,16,46,0.08)_0%,transparent_50%)]"
      />
      <motion.div
        animate={{ x: ["10%", "-10%", "10%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-x-20 top-1/4 h-3/4 bg-[radial-gradient(ellipse_at_center,rgba(232,228,220,0.04)_0%,transparent_60%)]"
      />

      {/* Dust particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-[#E8E4DC]/40 rounded-full"
          initial={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        />
      ))}

      {/* Noise */}
      <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
