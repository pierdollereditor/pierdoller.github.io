"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { SOCIAL_LINKS } from "../data/socialLinks";
import FolderGLB from "./three/FolderGLB";

const WORDMARK = "PIERDOLLER";

const SOCIALS = [
  ["telegram", "Telegram", SOCIAL_LINKS.telegramChannel],
  ["telegram", "Telegram DM", SOCIAL_LINKS.telegramContact],
  ["instagram", "Instagram", SOCIAL_LINKS.instagram],
  ["youtube", "YouTube", SOCIAL_LINKS.youtube],
  ["tiktok", "TikTok", SOCIAL_LINKS.tiktok],
  ["x", "X / Twitter", SOCIAL_LINKS.x],
] as const;

export default function Footer() {
  const resetTimer = useRef(0);

  const settleLetters = (target: HTMLDivElement, delay = 110) => {
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      target.querySelectorAll<HTMLElement>(".footer-letter").forEach((letter) => {
        letter.style.setProperty("--split", "0");
        letter.style.setProperty("--shift", "0px");
        letter.style.transform = "none";
      });
    }, delay);
  };

  const distortLetters = (event: ReactPointerEvent<HTMLDivElement>) => {
    window.clearTimeout(resetTimer.current);
    const letters = event.currentTarget.querySelectorAll<HTMLElement>(".footer-letter");
    letters.forEach((letter, index) => {
      const bounds = letter.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / 230);
      letter.style.setProperty("--split", String(influence));
      letter.style.setProperty("--shift", `${influence * 13}px`);
      letter.style.transform = `translateY(${Math.sin(index * 1.7 + event.clientX * 0.018) * influence * 10}px) skewX(${dx * influence * -0.035}deg)`;
    });
    settleLetters(event.currentTarget);
  };

  const resetLetters = (event: ReactPointerEvent<HTMLDivElement>) => {
    settleLetters(event.currentTarget, 40);
  };

  return (
    <footer id="socials" className="cinematic-footer">
      <div className="footer-fog" aria-hidden="true" />
      <FolderGLB className="footer-folders" variant="footer" />

      <div className="footer-topline">
        <div className="footer-socials">
          {SOCIALS.map(([icon, label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
              <SocialIcon name={icon} />
            </a>
          ))}
        </div>
      </div>

      <div className="footer-wordmark" onPointerMove={distortLetters} onPointerUp={resetLetters} onPointerCancel={resetLetters} onPointerLeave={resetLetters} aria-label="PIERDOLLER">
        {WORDMARK.split("").map((letter, index) => (
          <span key={`${letter}-${index}`} className="footer-letter" data-char={letter}>{letter}</span>
        ))}
      </div>

      <div className="footer-bottomline">
        <span>Motion design · Editing · Visual systems</span>
        <a href={SOCIAL_LINKS.email}>contact@markelov-fx.pro</a>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: (typeof SOCIALS)[number][0] }) {
  const paths = {
    telegram: <path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.4-.1-.6-.6-.2L6 12.8l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20 2.7c.9-.3 1.7.2 1.6.7Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" /></>,
    youtube: <path d="M22 7.1a2.8 2.8 0 0 0-2-2C18.3 4.6 12 4.6 12 4.6s-6.3 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.5 12 29 29 0 0 0 2 16.9a2.8 2.8 0 0 0 2 2c1.7.5 8 .5 8 .5s6.3 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.9 29 29 0 0 0-.5-4.9ZM9.8 15.2V8.8L15.5 12l-5.7 3.2Z" />,
    tiktok: <path d="M15.7 3c.4 2.2 1.7 3.5 3.8 3.8v3a9 9 0 0 1-3.8-1.1v5.5a6 6 0 1 1-5.2-5.9v3.1a3 3 0 1 0 2.1 2.8V3h3.1Z" />,
    x: <path d="M17.6 3H21l-7.4 8.5L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L.7 3h6.8l4.7 6.2L17.6 3Zm-1.2 16h1.8L6.5 4.9h-2L16.4 19Z" />,
  } as const;
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}
