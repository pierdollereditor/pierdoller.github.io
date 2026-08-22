import { motion, useScroll, useTransform } from "motion/react";
import { useLanguage, T } from "../store/useLanguage";
import { SOCIAL_LINKS } from "../data/socialLinks";

export default function Header() {
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(5,5,5,0)", "rgba(5,5,5,0.92)"],
  );
  const { lang, setLang } = useLanguage();
  const t = T[lang].nav;

  return (
    <motion.header
      style={{ background: bg }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-[#C0BDB3]/5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-5 md:px-10 py-4">
        <a
          href="#hero"
          className="font-stencil font-black text-[18px] tracking-[0.3em] text-[#C0BDB3] hover:text-[#8B0A1F] transition-colors"
        >
          P.D.
        </a>

        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] tracking-[0.25em] uppercase">
          <a
            href="#portfolio"
            className="text-[#C0BDB3]/70 hover:text-[#8B0A1F] transition-colors"
          >
            {t.portfolio}
          </a>
          <a
            href="#manifesto"
            className="text-[#C0BDB3]/70 hover:text-[#8B0A1F] transition-colors"
          >
            {t.manifesto}
          </a>
          <a
            href="#contact"
            className="text-[#C0BDB3]/70 hover:text-[#8B0A1F] transition-colors"
          >
            {t.contact}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* LANG TOGGLE */}
          <div className="hidden md:flex items-center border border-[#C0BDB3]/20 text-[10px] font-mono">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 tracking-widest uppercase transition-colors ${
                lang === "en"
                  ? "bg-[#8B0A1F] text-[#E8E4DC]"
                  : "text-[#C0BDB3]/60 hover:text-[#C0BDB3]"
              }`}
            >
              🇬🇧 EN
            </button>
            <div className="w-px h-4 bg-[#C0BDB3]/20" />
            <button
              onClick={() => setLang("ru")}
              className={`px-2.5 py-1.5 tracking-widest uppercase transition-colors ${
                lang === "ru"
                  ? "bg-[#8B0A1F] text-[#E8E4DC]"
                  : "text-[#C0BDB3]/60 hover:text-[#C0BDB3]"
              }`}
            >
              🇷🇺 RU
            </button>
          </div>

          <a
            href={SOCIAL_LINKS.telegramContact}
            target="_blank"
            rel="noreferrer"
            className="border border-[#C0BDB3]/40 hover:border-[#8B0A1F] hover:text-[#8B0A1F] px-4 py-2 font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            [ {t.hire} ]
          </a>
        </div>
      </div>
    </motion.header>
  );
}
