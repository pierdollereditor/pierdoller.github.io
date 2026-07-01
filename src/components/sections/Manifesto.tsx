import { motion } from "motion/react";
import { useState } from "react";
import FolderGLB from "../three/FolderGLB";
import { useLanguage, T } from "../../store/useLanguage";

export default function Manifesto() {
  const { lang } = useLanguage();
  const t = T[lang].manifesto;

  return (
    <section
      id="manifesto"
      className="relative py-16 md:py-28 px-5 md:px-10 lg:px-20 overflow-hidden"
    >
      {/* Заменили grid на flex, чтобы жестко зафиксировать ширину на мобилках */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* 3D-модель: hidden lg:block скрывает её на всех экранах меньше 1024px */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="hidden lg:block relative h-[700px] w-full lg:w-[45%] shrink-0"
          style={{ filter: "brightness(0.55) contrast(1.1) saturate(0.7)" }}
        >
          <FolderGLB className="w-full h-full" />
        </motion.div>

        {/* Контейнер с текстом занимает 100% ширины экрана на мобилках */}
        <div className="w-full lg:w-[55%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[9px] md:text-[11px] tracking-[0.1em] md:tracking-[0.2em] text-[#8B0A1F] flex flex-wrap gap-x-3 gap-y-2 mb-4 uppercase"
          >
            <span>
              <span className="text-[#6A6660]">File:</span> N°06.21.26
            </span>
            <span>
              <span className="text-[#6A6660]">Subject:</span> P.D.
            </span>
            <span>
              <span className="text-[#6A6660]">Status:</span>{" "}
              <span className="text-[#6A8B5F]">Active</span>
            </span>
          </motion.div>

          <div className="h-px w-full bg-gradient-to-r from-[#8B0A1F]/60 via-[#C0BDB3]/10 to-transparent mb-6" />

          <h2
            className={`text-[46px] md:text-[88px] uppercase leading-[0.9] text-[#C0BDB3] ${
              lang === "ru"
                ? "font-[var(--font-cyrillic-display)] font-bold tracking-normal"
                : "font-stencil font-black tracking-tight"
            }`}
          >
            <span className="text-[#8B0A1F]">//</span> {t.title}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 md:mt-8 space-y-4 md:space-y-5 font-mono text-[13px] md:text-[14px] leading-[1.6] md:leading-[1.85] text-[#C0BDB3] break-words"
          >
            <p>
              {t.text1Pre} <Censored>{t.red1}</Censored>
              {t.text1Mid} <Censored>{t.red2}</Censored>
              {t.text1End} <span className="text-[#8B0A1F]">{t.tochno}</span>.
            </p>
            <p className="text-[#6A6660]">{t.text2}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Censored({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      className="relative inline-block cursor-pointer select-none align-baseline whitespace-nowrap"
      onClick={() => setRevealed(!revealed)}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      <span className="opacity-0 px-1">{children}</span>
      <span
        className={`absolute inset-0 bg-[#0A0807] border border-[#C0BDB3]/20 transition-opacity duration-300 pointer-events-none ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute inset-0 flex items-center justify-center px-1 text-[#8B0A1F] transition-opacity duration-300 pointer-events-none ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </span>
    </span>
  );
}
