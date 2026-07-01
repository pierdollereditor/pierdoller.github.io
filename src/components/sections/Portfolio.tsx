import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WORKS, CATEGORIES, type Category } from "../../data/works";
import { useLanguage, T } from "../../store/useLanguage";

function getYouTubeEmbed(url: string): string | null {
  if (!url) return null;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short)
    return `https://www.youtube.com/embed/${short[1]}?autoplay=1&rel=0`;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch)
    return `https://www.youtube.com/embed/${watch[1]}?autoplay=1&rel=0`;
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts)
    return `https://www.youtube.com/embed/${shorts[1]}?autoplay=1&rel=0`;
  const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed)
    return `https://www.youtube.com/embed/${embed[1]}?autoplay=1&rel=0`;
  return null;
}

export default function Portfolio() {
  const [filter, setFilter] = useState<Category>("ALL");
  const [active, setActive] = useState<(typeof WORKS)[number] | null>(null);
  const list =
    filter === "ALL" ? WORKS : WORKS.filter((w) => w.category === filter);
  const { lang } = useLanguage();
  const t = T[lang].portfolio;

  const labels: Record<Category, string> = {
    ALL: t.all,
    REELS: t.reels,
    LONGFORM: t.longform,
    COMMERCIAL: t.commercial,
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <section
      id="portfolio"
      className="relative py-20 md:py-28 px-5 md:px-10 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[11px] tracking-[0.3em] text-[#8B0A1F] mb-3 uppercase"
        >
          {t.label}
        </motion.div>

        <h2
          className={`text-[56px] md:text-[100px] uppercase leading-[0.9] text-[#C0BDB3] ${
            lang === "ru"
              ? "font-[var(--font-cyrillic-display)] font-normal tracking-normal"
              : "font-stencil font-black tracking-tight"
          }`}
        >
          {t.title}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((c) => {
            const isActive = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase px-3 py-2 border transition-all ${
                  isActive
                    ? "border-[#8B0A1F] text-[#8B0A1F] bg-[#8B0A1F]/10"
                    : "border-[#C0BDB3]/20 text-[#C0BDB3]/60 hover:border-[#C0BDB3]/60 hover:text-[#C0BDB3]"
                }`}
              >
                [ {labels[c.key]} ]
              </button>
            );
          })}
        </motion.div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {list.map((w, i) => (
              <motion.button
                layout
                key={w.id}
                type="button"
                onClick={() => setActive(w)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                whileHover={{ y: -4 }}
                className="group block text-left w-full bg-transparent border-0 p-0 cursor-pointer"
              >
                <div className="relative aspect-video bg-[#1A1714] overflow-hidden border border-[#C0BDB3]/10 group-hover:border-[#8B0A1F]/60 transition-all duration-500">
                  <img
                    src={w.poster}
                    alt={w.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />

                  <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#8B0A1F] z-10" />
                  <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#8B0A1F] z-10" />
                  <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#8B0A1F] z-10" />
                  <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#8B0A1F] z-10" />

                  <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-[#E8E4DC] bg-black/80 px-2 py-1 z-10">
                    [ {w.category} ] · {w.duration}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
                    <div className="w-14 h-14 rounded-full border border-[#8B0A1F] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-[#8B0A1F] text-[18px] ml-1">▶</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B0A1F] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div
                      className={`text-[18px] md:text-[22px] uppercase leading-tight text-[#C0BDB3] group-hover:text-[#8B0A1F] transition-colors truncate ${
                        lang === "ru"
                          ? "font-[var(--font-cyrillic-display)] font-normal tracking-normal"
                          : "font-stencil font-black tracking-tight"
                      }`}
                    >
                      {w.title}
                    </div>
                    <div className="font-mono text-[10px] text-[#6A6660] mt-1">
                      {w.subtitle}
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-[#6A6660] whitespace-nowrap mt-2">
                    N°{w.year}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              <div className="flex items-center justify-between mb-3 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
                <div className="text-[#8B0A1F]">
                  [ {active.category} ] · {active.duration} ·{" "}
                  <span className="text-[#6A6660]">N°{active.year}</span>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="text-[#C0BDB3]/70 hover:text-[#8B0A1F] transition-colors"
                >
                  [ CLOSE × ]
                </button>
              </div>

              <div className="relative aspect-video bg-black border border-[#8B0A1F]/40 overflow-hidden">
                {active.videoUrl ? (
                  getYouTubeEmbed(active.videoUrl) ? (
                    <iframe
                      key={active.id}
                      src={getYouTubeEmbed(active.videoUrl)!}
                      title={active.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <video
                      key={active.id}
                      src={active.videoUrl}
                      poster={active.poster}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#6A6660] font-mono text-[12px] tracking-widest uppercase">
                    <span>// NO VIDEO SOURCE //</span>
                    <span className="text-[10px] opacity-60">
                      Source link will be attached soon
                    </span>
                  </div>
                )}

                <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#8B0A1F] pointer-events-none z-10" />
                <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#8B0A1F] pointer-events-none z-10" />
                <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#8B0A1F] pointer-events-none z-10" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#8B0A1F] pointer-events-none z-10" />
              </div>

              <div className="mt-4">
                <div
                  className={`text-[24px] md:text-[32px] uppercase leading-tight text-[#C0BDB3] ${
                    lang === "ru"
                      ? "font-[var(--font-cyrillic-display)] font-normal tracking-normal"
                      : "font-stencil font-black tracking-tight"
                  }`}
                >
                  {active.title}
                </div>
                <div className="font-mono text-[11px] text-[#6A6660] mt-1">
                  {active.subtitle}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
