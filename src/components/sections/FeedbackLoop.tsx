"use client";

import { useEffect, useRef } from "react";

const FEEDBACK = [
  { id: "01", message: "Great work", image: "/images/feedback/01.avif" },
  { id: "02", message: "Client feedback", image: "/images/feedback/02.avif" },
  { id: "03", message: "Result approved", image: "/images/feedback/03.avif" },
  { id: "04", message: "Final cut", image: "/images/feedback/04.avif" },
  { id: "05", message: "High retention", image: "/images/feedback/05.avif" },
  { id: "06", message: "Delivered", image: "/images/feedback/06.avif" },
];

const LOOP_SPEED = 18;
const INERTIA_DAMPING = 4.2;
const MAX_RELEASE_VELOCITY = 2200;

export default function FeedbackLoop() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let frame = 0;
    let position = -Math.min(viewport.clientWidth * 0.12, 180);
    let lastTime = performance.now();
    let lastPointerX = 0;
    let lastPointerTime = performance.now();
    let velocity = 0;
    let dragging = false;

    const wrap = () => {
      const firstCard = track.children[0] as HTMLElement | undefined;
      const repeatedFirstCard = track.children[FEEDBACK.length] as HTMLElement | undefined;
      const loopWidth = firstCard && repeatedFirstCard ? repeatedFirstCard.offsetLeft - firstCard.offsetLeft : 0;
      if (!loopWidth) return;
      while (position <= -loopWidth) position += loopWidth;
      while (position > 0) position -= loopWidth;
    };

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!dragging) {
        position += (velocity - LOOP_SPEED) * delta;
        velocity *= Math.exp(-INERTIA_DAMPING * delta);
      }
      wrap();
      track.style.transform = `translate3d(${position}px, 0, 0)`;
      frame = requestAnimationFrame(render);
    };

    const pointerDown = (event: PointerEvent) => {
      dragging = true;
      lastPointerX = event.clientX;
      lastPointerTime = performance.now();
      velocity = 0;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
    };

    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const time = performance.now();
      const elapsed = Math.max((time - lastPointerTime) / 1000, 0.001);
      const distance = event.clientX - lastPointerX;
      const nextVelocity = distance / elapsed;
      position += distance;
      velocity = velocity * 0.58 + nextVelocity * 0.42;
      lastPointerX = event.clientX;
      lastPointerTime = time;
      wrap();
    };

    const pointerUp = (event: PointerEvent) => {
      dragging = false;
      velocity = Math.max(-MAX_RELEASE_VELOCITY, Math.min(MAX_RELEASE_VELOCITY, velocity));
      viewport.releasePointerCapture(event.pointerId);
      viewport.classList.remove("is-dragging");
    };

    viewport.addEventListener("pointerdown", pointerDown);
    viewport.addEventListener("pointermove", pointerMove);
    viewport.addEventListener("pointerup", pointerUp);
    viewport.addEventListener("pointercancel", pointerUp);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("pointerdown", pointerDown);
      viewport.removeEventListener("pointermove", pointerMove);
      viewport.removeEventListener("pointerup", pointerUp);
      viewport.removeEventListener("pointercancel", pointerUp);
    };
  }, []);

  return (
    <div className="feedback-block">
      <div className="feedback-label">
        <span>Client transmissions</span>
        <span>Drag to inspect ↔</span>
      </div>
      <div ref={viewportRef} className="feedback-loop">
        <div ref={trackRef} className="feedback-track">
          {[...FEEDBACK, ...FEEDBACK].map((item, index) => (
            <article className="feedback-card" key={`${item.id}-${index}`}>
              <img src={item.image} alt="" onError={(event) => { event.currentTarget.hidden = true; }} draggable={false} />
              <div className="feedback-card-head">
                <span>Message / {item.id}</span>
                <i />
              </div>
              <strong>{item.message}</strong>
              <div className="feedback-card-foot">
                <span>Screenshot slot</span>
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
