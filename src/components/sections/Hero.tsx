import { motion } from "motion/react";
import HeroCharacter from "../three/HeroCharacter";
import { SOCIAL_LINKS } from "../../data/socialLinks";
import { CONTENT } from "../../data/content";

export default function Hero() {
  const t = CONTENT.hero;

  return (
    <section id="hero" className="hero-reference relative min-h-screen overflow-hidden">
      <div className="hero-reference-backdrop" aria-hidden="true" />
      <svg className="hero-dossier-line hidden lg:block" viewBox="0 0 1200 230" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="387,0 520,0 620,62 1170,62" />
        <circle cx="1170" cy="62" r="5" />
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 75 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, delay: 0.1 }}
        className="hero-object absolute top-[3%] bottom-[-12%] left-[17%] right-[14%]"
        aria-label="Responsive 3D character"
      >
        <HeroCharacter className="w-full h-full translate-x-[70px] md:translate-x-[170px] lg:translate-x-[300px]" />
        <span className="hero-object-label">Motion linked / cursor input</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="hero-dossier hidden lg:block"
        aria-label="Portfolio file details"
      >
        <div className="hero-dossier-data">
          <span className="hero-dossier-id">FILE INDEX / 06.21</span>
          <dl>
            <div><dt>FILE</dt><dd>PORTFOLIO</dd></div>
            <div><dt>STATUS</dt><dd><i /> AVAILABLE</dd></div>
            <div><dt>TOOLS</dt><dd>RESOLVE / FUSION / BLENDER</dd></div>
            <div><dt>BASED</dt><dd>REMOTE / UTC +5</dd></div>
          </dl>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.35 }}
        className="hero-reference-copy"
      >
        <div className="hero-original-status"><i /> {t.status}</div>
        <h1 aria-label="Video editing and motion that holds attention">
          <span>{t.title1}</span>
          <span>{t.title2}</span>
        </h1>
        <p>{t.sub1}</p>
      </motion.div>

      <nav className="hero-reference-actions" aria-label="Hero links">
        <a href="#manifesto">ABOUT</a>
        <a href="#portfolio">↗ VIEW WORK</a>
        <a href={SOCIAL_LINKS.telegramContact} target="_blank" rel="noreferrer">↗ HIRE P.D.</a>
      </nav>
    </section>
  );
}
