import { motion } from "motion/react";
import { useLanguage } from "../../store/useLanguage";

const DATA = {
  en: {
    label: "// REVIEWS / CASE FILES //",
    title1: "Witness",
    title2: "Statements",
    statement: "STATEMENT",
    verified: "✓ VERIFIED",
    reviews: [
      {
        author: "Tourist's Life",
        role: "Travel YouTube",
        text: "Retention tripled. Channel views jumped from 50k to 200k per video.",
        rotate: -3,
      },
      {
        author: "Cryptomnenie",
        role: "Crypto YouTube",
        text: "Subscribers recognize the channel from the very first second. Top tier work.",
        rotate: 2,
      },
      {
        author: "A. Petrov",
        role: "Documentary Director",
        text: "One of the few who feels the rhythm of the story instead of just cutting the timeline.",
        rotate: -2,
      },
      {
        author: "Studio M.",
        role: "Brand Agency",
        text: "Delivered three projects strictly on deadline. Exceeded expectations on every single one.",
        rotate: 4,
      },
    ],
  },
  ru: {
    label: "// ОТЗЫВЫ / АРХИВ ДЕЛ //",
    title1: "Показания",
    title2: "Свидетелей",
    statement: "ЗАЯВЛЕНИЕ",
    verified: "✓ ПОДТВЕРЖДЕНО",
    reviews: [
      {
        author: "Tourist's Life",
        role: "Travel YouTube",
        text: "Удержание выросло в 3 раза. Канал прыгнул с 50к до 200к за ролик.",
        rotate: -3,
      },
      {
        author: "Cryptomnenie",
        role: "Crypto YouTube",
        text: "Подписчики узнают канал по первой секунде. Это уровень.",
        rotate: 2,
      },
      {
        author: "А. Петров",
        role: "Документалист",
        text: "Один из тех, кто слышит ритм истории, а не просто режет таймлайн.",
        rotate: -2,
      },
      {
        author: "Studio M.",
        role: "Brand Agency",
        text: "Сдал три проекта в срок, превзошёл ожидания на каждом.",
        rotate: 4,
      },
    ],
  },
};

export default function Reviews() {
  const { lang } = useLanguage();
  const t = DATA[lang];

  return (
    <section
      id="reviews"
      className="relative py-32 px-5 md:px-10 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[11px] tracking-widest text-[#C8102E] mb-2 uppercase"
        >
          {t.label}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`text-[48px] md:text-[72px] uppercase ${
            lang === "ru"
              ? "font-[var(--font-cyrillic-display)] font-bold tracking-normal"
              : "font-stencil font-black tracking-tight"
          }`}
        >
          {t.title1} <span className="text-[#C8102E]">{t.title2}</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.reviews.map((r, i) => (
            <motion.div
              key={r.author}
              initial={{ opacity: 0, y: 40, rotate: r.rotate * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: r.rotate }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="bg-[#E8E4DC] text-[#0A0807] p-6 md:p-8 shadow-2xl relative"
            >
              <div className="absolute -top-3 left-6 bg-[#C8102E] text-[#E8E4DC] font-mono text-[9px] tracking-widest px-2 py-1 uppercase">
                {t.statement} N°{String(i + 1).padStart(2, "0")}
              </div>

              <p className="font-body text-[15px] md:text-[17px] leading-relaxed">
                "{r.text}"
              </p>

              <div className="mt-6 pt-4 border-t border-[#0A0807]/20 flex items-baseline justify-between">
                <div>
                  <div
                    className={`text-[18px] uppercase tracking-wide ${
                      lang === "ru"
                        ? "font-[var(--font-cyrillic-display)] font-bold tracking-normal"
                        : "font-stencil font-black"
                    }`}
                  >
                    {r.author}
                  </div>
                  <div className="font-mono text-[10px] text-[#0A0807]/60 uppercase tracking-wider mt-0.5">
                    {r.role}
                  </div>
                </div>
                <div className="font-mono text-[9px] text-[#C8102E]">
                  {t.verified}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
