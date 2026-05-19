import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WORKS, CATEGORIES, type Category } from "../../data/works";
import { useLanguage, T } from "../../store/useLanguage";

export default function Portfolio() {
  const [filter, setFilter] = useState<Category>("ALL");
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
              ? "font-['Bebas_Neue',_sans-serif] font-normal tracking-normal"
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
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase px-3 py-2 border transition-all ${
                  active
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
              <motion.a
                layout
                key={w.id}
                href="#"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                whileHover={{ y: -4 }}
                className="group block"
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

                  {w.videoUrl && (
                    <video
                      src={w.videoUrl}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) =>
                        (e.currentTarget as HTMLVideoElement).play()
                      }
                      onMouseLeave={(e) => {
                        const v = e.currentTarget as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />

                  <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#8B0A1F] z-10" />
                  <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#8B0A1F] z-10" />
                  <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#8B0A1F] z-10" />
                  <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#8B0A1F] z-10" />

                  <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-[#E8E4DC] bg-black/80 px-2 py-1 z-10">
                    [ {w.category} ] · {w.duration}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B0A1F] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div
                      className={`text-[18px] md:text-[22px] uppercase leading-tight text-[#C0BDB3] group-hover:text-[#8B0A1F] transition-colors truncate ${
                        lang === "ru"
                          ? "font-['Bebas_Neue',_sans-serif] font-normal tracking-normal"
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
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
