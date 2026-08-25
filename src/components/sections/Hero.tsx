"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { WORKS } from "../../data/works";
import ProjectRing from "../three/ProjectRing";
import LensingField from "../LensingField";

const AUTOPLAY_DELAY_MS = 4500;
const AUTO_SNAP_DURATION_SECONDS = 0.95;
const MANUAL_SNAP_DURATION_SECONDS = 0.7;

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export default function Hero() {
  const [position, setPosition] = useState(0);
  const [snapDuration, setSnapDuration] = useState(AUTO_SNAP_DURATION_SECONDS);
  const activeIndex = modulo(position, WORKS.length);
  const activeWork = WORKS[activeIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSnapDuration(AUTO_SNAP_DURATION_SECONDS);
      setPosition((current) => current + 1);
    }, AUTOPLAY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [position]);

  const moveToIndex = (index: number) => {
    const currentIndex = modulo(position, WORKS.length);
    let delta = index - currentIndex;
    if (delta > WORKS.length / 2) delta -= WORKS.length;
    if (delta < -WORKS.length / 2) delta += WORKS.length;
    setSnapDuration(MANUAL_SNAP_DURATION_SECONDS);
    setPosition((current) => current + delta);
  };

  const moveBy = (delta: number) => {
    setSnapDuration(MANUAL_SNAP_DURATION_SECONDS);
    setPosition((current) => current + delta);
  };

  const handleRingPositionChange = (nextPosition: number) => {
    setSnapDuration(MANUAL_SNAP_DURATION_SECONDS);
    setPosition(nextPosition);
  };

  return (
    <section
      id="hero"
      className="ape-hero"
      style={{ "--hero-accent": activeWork.accent, "--hero-backdrop": activeWork.backdrop } as React.CSSProperties}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={activeWork.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="ape-hero-bg"
          style={{
            backgroundImage: `radial-gradient(circle at 68% 38%, ${activeWork.accent}b8 0%, ${activeWork.accent}66 28%, transparent 62%), radial-gradient(circle at 14% 76%, ${activeWork.accent}78 0%, transparent 46%), linear-gradient(118deg, ${activeWork.backdrop} 0%, ${activeWork.backdrop}e8 54%, #080808 100%)`,
          }}
        />
      </AnimatePresence>
      <LensingField color={activeWork.accent} />

      <ProjectRing position={position} snapDuration={snapDuration} fogColor={activeWork.backdrop} onPositionChange={handleRingPositionChange} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeWork.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="ape-project-copy"
        >
          <div className="ape-project-meta"><i /> Featured <span>{activeWork.category}</span></div>
          <h1>{activeWork.title}</h1>
          <p>{activeWork.subtitle}</p>
          <a href={activeWork.link} target="_blank" rel="noreferrer">Watch project</a>
        </motion.div>
      </AnimatePresence>

      <div className="ape-carousel-controls">
        <button type="button" onClick={() => moveBy(1)} aria-label="Next project">→</button>
        <button type="button" onClick={() => moveBy(-1)} aria-label="Previous project">←</button>
      </div>

      <div className="ape-carousel-thumbs" aria-label="Select project">
        {WORKS.map((work, index) => (
          <button
            type="button"
            key={work.id}
            onClick={() => moveToIndex(index)}
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Show ${work.title}`}
          >
            <img src={work.poster} alt="" draggable={false} />
          </button>
        ))}
      </div>

      <div className="ape-carousel-progress" aria-hidden="true">
        <motion.i key={position} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTOPLAY_DELAY_MS / 1000, ease: "linear" }} />
      </div>
    </section>
  );
}
