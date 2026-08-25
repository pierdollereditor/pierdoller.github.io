"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"default" | "drag">("default");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const moveCursor = (event: PointerEvent) => {
      setVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
      const target = event.target instanceof Element ? event.target : null;
      setMode(target?.closest(".ape-ring-canvas") ? "drag" : "default");
    };
    const press = () => setPressed(true);
    const release = () => setPressed(false);
    const hideCursor = () => {
      setVisible(false);
      setPressed(false);
    };
    const leaveWindow = (event: MouseEvent) => {
      if (!event.relatedTarget) hideCursor();
    };
    const handleVisibility = () => {
      if (document.hidden) hideCursor();
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("mouseout", leaveWindow, { passive: true });
    window.addEventListener("blur", hideCursor);
    document.documentElement.addEventListener("pointerleave", hideCursor);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("mouseout", leaveWindow);
      window.removeEventListener("blur", hideCursor);
      document.documentElement.removeEventListener("pointerleave", hideCursor);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor is-${mode} ${pressed ? "is-pressed" : ""} ${visible ? "" : "is-hidden"}`}
      aria-hidden="true"
    >
      {mode === "drag" ? (
        <svg viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="26" />
          <path d="M20 28l7-5v10zM36 28l-7-5v10z" fill="currentColor" stroke="none" />
        </svg>
      ) : (
        <svg viewBox="0 0 26 26">
          <path d="M4 4l18 11-10 2-5 7z" />
        </svg>
      )}
    </div>
  );
}
