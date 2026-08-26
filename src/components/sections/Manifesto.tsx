import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import FolderGLB from "../three/FolderGLB";
import { CONTENT } from "../../data/content";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function Manifesto() {
  const t = CONTENT.manifesto;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section
      id="manifesto"
      className="relative py-24 md:py-36 px-5 md:px-10 lg:px-20 overflow-hidden cinematic-bg"
      style={{ "--section-bg": "url('/images/bg-approach.webp')" } as CSSProperties}
    >
      {/* Заменили grid на flex, чтобы жестко зафиксировать ширину на мобилках */}
      <div className="manifesto-inner max-w-7xl mx-auto min-h-[720px] flex items-center relative z-10">
        {isDesktop ? (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="model-stage absolute inset-[-9%] h-[118%] w-[118%] pointer-events-none opacity-75"
          >
            <FolderGLB className="w-full h-full" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 0.9, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9 }}
            className="approach-mobile-folder pointer-events-none"
          >
            <FolderGLB className="w-full h-full" variant="mobile" />
          </motion.div>
        )}

        {/* Контейнер с текстом занимает 100% ширины экрана на мобилках */}
        <div className="manifesto-copy w-full lg:w-[52%] lg:ml-auto relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[13px] md:text-[14px] tracking-[0.08em] md:tracking-[0.12em] text-[#8B0A1F] flex flex-wrap gap-x-3 gap-y-2 mb-4 uppercase"
          >
            <span>
              <span className="text-[#6A6660]">File:</span> N°06.21.26
            </span>
            <span>
              <span className="text-[#6A6660]">Subject:</span> PIERDOLLER
            </span>
            <span>
              <span className="text-[#6A6660]">Status:</span>{" "}
              <span className="text-[#6A8B5F]">Active</span>
            </span>
          </motion.div>
          <div className="h-px w-full bg-gradient-to-r from-[#8B0A1F]/60 via-[#C0BDB3]/10 to-transparent mb-6" />

          <h2 className="text-[46px] md:text-[88px] uppercase leading-[0.9] text-[#C0BDB3] font-stencil font-black tracking-tight">
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
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setRevealed(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setRevealed(false);
      }}
      role="button"
      tabIndex={0}
    >
      <span className="opacity-0 px-1">{children}</span>
      <span
        className={`absolute inset-0 bg-[#0A0807] border border-[#C0BDB3]/20 transition-opacity duration-300 pointer-events-none ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute inset-0 flex items-center justify-center border border-[#8B0A1F]/60 bg-[#8B0A1F]/20 px-1 text-[#D20D32] transition-opacity duration-300 pointer-events-none ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </span>
    </span>
  );
}
