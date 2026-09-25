"use client";

import { AnimatePresence, motion } from "motion/react";
import { startTransition, useEffect, useRef, useState } from "react";
import { WORKS } from "../../data/works";
import { useCanvasVisibility } from "../../hooks/useCanvasVisibility";
import { useConstrainedRendering } from "../../hooks/useConstrainedRendering";
import ProjectRing from "../three/ProjectRing";
import LensingField from "../LensingField";

const AUTOPLAY_DELAY_MS = 4500;
const MAX_AUTOPLAY_FRAME_DELTA_MS = 100;
const AUTO_SNAP_DURATION_SECONDS = 1.45;
const DESKTOP_MANUAL_SNAP_DURATION_SECONDS = 1.1;
const MOBILE_MANUAL_SNAP_DURATION_SECONDS = 0.85;
const CONTENT_SWITCH_PROGRESS = 0.82;

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { isActive: isHeroActive } = useCanvasVisibility(heroRef, "0px");
  const isConstrained = useConstrainedRendering();
  const manualSnapDuration = isConstrained
    ? MOBILE_MANUAL_SNAP_DURATION_SECONDS
    : DESKTOP_MANUAL_SNAP_DURATION_SECONDS;
  const [position, setPosition] = useState(0);
  const [visiblePosition, setVisiblePosition] = useState(0);
  const [snapDuration, setSnapDuration] = useState(AUTO_SNAP_DURATION_SECONDS);
  const [isDragging, setIsDragging] = useState(false);
  const activeIndex = modulo(visiblePosition, WORKS.length);
  const activeWork = WORKS[activeIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startTransition(() => setVisiblePosition(position));
    }, snapDuration * CONTENT_SWITCH_PROGRESS * 1000);
    return () => window.clearTimeout(timer);
  }, [position, snapDuration]);

  useEffect(() => {
    if (!isHeroActive || isDragging) return;
    let frameId = 0;
    let elapsed = 0;
    let previousTime = 0;
    const tick = (time: number) => {
      if (previousTime > 0) {
        elapsed += Math.min(time - previousTime, MAX_AUTOPLAY_FRAME_DELTA_MS);
      }
      previousTime = time;
      if (elapsed >= AUTOPLAY_DELAY_MS) {
        setSnapDuration(AUTO_SNAP_DURATION_SECONDS);
        setPosition((current) => current + 1);
        return;
      }
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isHeroActive, isDragging, position]);

  const moveToIndex = (index: number) => {
    const currentIndex = modulo(position, WORKS.length);
    let delta = index - currentIndex;
    if (delta > WORKS.length / 2) delta -= WORKS.length;
    if (delta < -WORKS.length / 2) delta += WORKS.length;
    setSnapDuration(manualSnapDuration);
    setPosition((current) => current + delta);
  };

  const moveBy = (delta: number) => {
    setSnapDuration(manualSnapDuration);
    setPosition((current) => current + delta);
  };

  const handleRingPositionChange = (nextPosition: number) => {
    setSnapDuration(manualSnapDuration);
    setPosition(nextPosition);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="ape-hero"
      style={{ "--hero-accent": activeWork.accent, "--hero-backdrop": activeWork.backdrop } as React.CSSProperties}
    >
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-dot-grid" aria-hidden="true" />
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

      <div className="hero-mist-floor" aria-hidden="true" />

      <ProjectRing
        active={isHeroActive}
        position={position}
        snapDuration={snapDuration}
        fogColor={activeWork.backdrop}
        accentColor={activeWork.accent}
        onPositionChange={handleRingPositionChange}
        onDragChange={setIsDragging}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeWork.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="ape-project-copy"
        >
          <div className="ape-project-meta"><i /> Featured <span>{activeWork.category}</span></div>
          <h1>{activeWork.title}</h1>
          <p>{activeWork.subtitle}</p>
          <div className="ape-project-tags">
            <span>// {activeWork.category}</span>
            <span>YEAR: {activeWork.year}</span>
            <span>DURATION: {activeWork.duration}</span>
            <span className="is-verified">STATUS: VERIFIED</span>
          </div>
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
            <img
              src={work.poster}
              srcSet={`${work.posterMobile} 800w, ${work.poster} 2560w`}
              sizes="(max-width: 640px) 38px, 46px"
              alt=""
              draggable={false}
            />
          </button>
        ))}
      </div>

      <div className="ape-carousel-progress" aria-hidden="true">
        <motion.i key={position} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTOPLAY_DELAY_MS / 1000, ease: "linear" }} />
      </div>
    </section>
  );
}
