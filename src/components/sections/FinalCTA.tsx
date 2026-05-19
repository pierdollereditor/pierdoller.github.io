import { motion } from "motion/react";
import CRTGLB from "../three/CRTGLB";
import { useLanguage, T } from "../../store/useLanguage";

export default function FinalCTA() {
  const { lang } = useLanguage();
  const t = T[lang].cta;

  return (
    <section
      id="contact"
      className="relative pt-28 pb-16 md:py-28 px-5 md:px-10 lg:px-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(139,10,31,0.12)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="lg:max-w-[58%] w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] text-[#8B0A1F] mb-4 md:mb-6 uppercase"
          >
            {t.label}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`text-[46px] sm:text-[70px] md:text-[110px] lg:text-[130px] leading-[0.95] md:leading-[0.85] uppercase text-[#8B0A1F] ${
              lang === "ru"
                ? "font-['Bebas_Neue',_sans-serif] font-normal tracking-normal"
                : "font-stencil font-black tracking-tighter"
            }`}
          >
            {t.title1}
            <br />
            {t.title2} <span className="text-stroke">{t.now}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 md:mt-8 font-mono text-[12px] md:text-[14px] tracking-[0.05em] md:tracking-[0.1em] text-[#C0BDB3]/80 max-w-xl uppercase leading-[1.6] md:leading-[1.8]"
          >
            <span className="text-[#8B0A1F]">//</span> {t.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 md:mt-10 flex flex-wrap gap-3 w-full"
          >
            <Btn href="https://t.me/P1ERDOLLER" label="Telegram">
              <path d="M11.944 0A12 12 0 1 0 24 12.056A12.013 12.013 0 0 0 11.944 0ZM16.906 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.492-1.302.486c-.428-.008-1.252-.242-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635Z" />
            </Btn>
            <Btn href="https://x.com/pierdollerVFX" label="X / Twitter">
              <path d="M18.244 2H21.5l-7.12 8.137L22 22h-5.956l-4.664-6.104L6.04 22H2.782l7.616-8.703L2 2h6.107l4.216 5.522L18.244 2Zm-1.142 18h1.804L7.128 3.895H5.193L17.102 20Z" />
            </Btn>
            <Btn href="mailto:pierdoller.editor@gmail.com" label="Email">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                d="M2 4h20v16H2z M2 4l10 8 10-8"
              />
            </Btn>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[700px] pointer-events-none"
        >
          <CRTGLB className="w-full h-full" />
        </motion.div>
      </div>
    </section>
  );
}

function Btn({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center justify-center gap-3 border border-[#C0BDB3]/30 hover:border-[#8B0A1F] hover:bg-[#8B0A1F] hover:text-black px-4 py-3 md:px-6 md:py-4 font-mono text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.25em] uppercase transition-all flex-1 min-w-[140px]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 text-[#8B0A1F] group-hover:text-black shrink-0"
      >
        {children}
      </svg>
      {label}
    </a>
  );
}
