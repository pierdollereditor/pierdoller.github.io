import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLanguage, T } from "../../store/useLanguage";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { lang } = useLanguage();
  const t = T[lang].hero;

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen overflow-hidden vignette"
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50 grayscale flicker"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/30 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Скрыли на мобилках (hidden md:block), чтобы не мешать таймеру REC */}
      <motion.div
        style={{ opacity }}
        className="hidden md:block absolute top-24 left-5 md:left-10 z-10 font-mono text-[10px] tracking-[0.3em] text-[#6A6660]"
      >
        TAPE — N°06.21
      </motion.div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen px-5 md:px-10 lg:px-20 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 mb-4 md:mb-6 font-mono text-[10px] md:text-[11px] tracking-[0.2em]"
        >
          <span className="text-[#8B0A1F]">▸</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0A1F] animate-pulse" />
          <span className="text-[#C0BDB3]/80 uppercase">{t.status}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`uppercase text-[42px] sm:text-[60px] md:text-[90px] lg:text-[110px] leading-[0.92] text-[#C0BDB3] ${
            lang === "ru"
              ? "font-['Montserrat',_sans-serif] font-black tracking-tight"
              : "font-stencil font-black tracking-tight"
          }`}
        >
          <div className="block">{t.title1}</div>
          <div className="block">{t.title2}</div>
          <div className="block text-[#8B0A1F]">{t.sells}</div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-6 md:mt-8 font-mono text-[12px] md:text-[15px] text-[#C0BDB3]/70 max-w-md leading-[1.8]"
        >
          {t.sub1} <span className="text-[#C0BDB3] font-bold">{t.sub2}</span>
          <br />
          {t.sub3} <span className="text-[#8B0A1F]">{t.buyers}</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href="#portfolio"
            className="group inline-flex items-center gap-3 border border-[#C0BDB3]/40 hover:border-[#8B0A1F] hover:bg-[#8B0A1F] hover:text-black px-5 py-3 md:px-6 md:py-4 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase transition-all"
          >
            <span className="text-[#8B0A1F] group-hover:text-black">▷</span>
            {t.viewPortfolio}
          </a>
          <a
            href="#contact"
            className="inline-block border border-[#C0BDB3]/20 hover:border-[#C0BDB3]/60 px-5 py-3 md:px-6 md:py-4 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase transition-all"
          >
            {t.getInTouch}
          </a>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#6A6660] flex flex-col items-center gap-2"
      >
        <span>{t.scroll}</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[#8B0A1F] to-transparent"
        />
      </motion.div>
    </section>
  );
}
