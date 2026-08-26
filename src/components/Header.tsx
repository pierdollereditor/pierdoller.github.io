"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SOCIAL_LINKS } from "../data/socialLinks";
import LensingField from "./LensingField";

type MenuKey = "socials" | "projects" | "contact";

const MENU_ITEMS: Array<{ key: MenuKey; label: string }> = [
  { key: "socials", label: "Socials" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const MENU_CONTENT: Record<MenuKey, Array<{ title: string; actions: Array<{ label: string; href: string; external?: boolean }>; sublink?: { label: string; href: string } }>> = {
  socials: [
    {
      title: "Telegram",
      actions: [
        { label: "Channel", href: SOCIAL_LINKS.telegramChannel, external: true },
        { label: "Message me", href: SOCIAL_LINKS.telegramContact, external: true },
      ],
    },
    {
      title: "Video",
      actions: [
        { label: "YouTube", href: SOCIAL_LINKS.youtube, external: true },
        { label: "TikTok", href: SOCIAL_LINKS.tiktok, external: true },
      ],
    },
    {
      title: "Elsewhere",
      actions: [
        { label: "Instagram", href: SOCIAL_LINKS.instagram, external: true },
        { label: "X / Twitter", href: SOCIAL_LINKS.x, external: true },
      ],
    },
  ],
  projects: [
    {
      title: "Tools",
      actions: [{ label: "AI Dub plugin", href: "https://aidub.markelov-fx.pro/", external: true }],
    },
  ],
  contact: [
    {
      title: "Start project",
      actions: [{ label: "Telegram", href: SOCIAL_LINKS.telegramContact, external: true }],
    },
    {
      title: "Email",
      actions: [{ label: "Write email", href: SOCIAL_LINKS.email, external: true }],
    },
    {
      title: "Availability",
      actions: [{ label: "Contact section", href: "#contact" }],
      sublink: { label: "Remote / UTC +5", href: "#contact" },
    },
  ],
};

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", activeMenu !== null || mobileNavOpen);
    return () => document.body.classList.remove("menu-open");
  }, [activeMenu, mobileNavOpen]);

  return (
    <header className={`site-header absolute left-0 right-0 top-0 z-50 ${activeMenu || mobileNavOpen ? "is-open" : ""} ${mobileNavOpen ? "is-mobile-nav-open" : ""}`} onMouseLeave={() => setActiveMenu(null)}>
      <div className="site-header-bar relative z-10 mx-auto flex h-[76px] max-w-[1920px] items-center border-b border-[#C0BDB3]/15 px-4 sm:px-6 md:h-[98px] md:px-9">
        <button
          type="button"
          className={`header-mobile-toggle ${mobileNavOpen ? "is-open" : ""}`}
          onClick={() => {
            setActiveMenu(null);
            setMobileNavOpen((open) => !open);
          }}
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
        >
          <i /><i /><i />
        </button>
        <a href="#hero" className="header-brand flex h-10 shrink-0 items-center border-2 border-[#C0BDB3] px-2.5 font-stencil text-[17px] font-black tracking-[0.12em] text-[#E8E4DC] transition-colors hover:border-[#8B0A1F] hover:text-[#8B0A1F] md:h-12 md:px-3.5 md:text-[19px]" aria-label="PIERDOLLER home">
          PIERDOLLER
        </a>
        <nav className={`header-nav ${mobileNavOpen ? "is-mobile-open" : ""} ml-auto flex items-center gap-3 sm:gap-6 md:absolute md:left-1/2 md:-translate-x-1/2 md:gap-12`} aria-label="Primary navigation">
          {MENU_ITEMS.map((item) => (
            <div className="header-nav-item" key={item.key}>
              <button
                type="button"
                className={`header-menu-link ${activeMenu === item.key ? "is-active" : ""}`}
                onMouseEnter={() => {
                  if (!window.matchMedia("(max-width: 640px)").matches) setActiveMenu(item.key);
                }}
                onFocus={() => {
                  if (!window.matchMedia("(max-width: 640px)").matches) setActiveMenu(item.key);
                }}
                onClick={() => {
                  setActiveMenu(activeMenu === item.key ? null : item.key);
                  if (!window.matchMedia("(max-width: 640px)").matches) setMobileNavOpen(false);
                }}
                aria-expanded={activeMenu === item.key}
              >
                {item.label}
              </button>
              <AnimatePresence>
                {mobileNavOpen && activeMenu === item.key && (
                  <motion.div
                    className="header-mobile-submenu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {MENU_CONTENT[item.key].flatMap((column) => column.actions).map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        target={action.external ? "_blank" : undefined}
                        rel={action.external ? "noreferrer" : undefined}
                        onClick={() => {
                          setActiveMenu(null);
                          setMobileNavOpen(false);
                        }}
                      >
                        {action.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {activeMenu && (
          <motion.div
            key={activeMenu}
            initial={{ height: 0 }}
            animate={{ height: "calc(clamp(360px, 31vw, 470px) + var(--site-header-height))" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
            className="header-mega-panel absolute left-0 right-0 top-0 overflow-hidden border-b border-[#C0BDB3]/15"
          >
            <LensingField />
            <div className="header-mega-grid mx-auto max-w-[1920px] px-6 py-8 md:px-10 md:py-10">
              <MegaTitle>{activeMenu}</MegaTitle>
              <div className="header-mega-columns">
                {MENU_CONTENT[activeMenu].map((column, index) => (
                  <MegaColumn key={column.title} column={column} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MegaTitle({ children }: { children: string }) {
  return (
    <div className="header-mega-title-wrap" aria-hidden="true">
      <motion.div initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="header-mega-title">
        {children}
      </motion.div>
    </div>
  );
}

function MegaColumn({ column, index }: { column: (typeof MENU_CONTENT)[MenuKey][number]; index: number }) {
  return (
    <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48, delay: 0.08 + index * 0.06 }} className="header-mega-column">
      <h2>{column.title}</h2>
      <div className="header-mega-actions">
        {column.actions.map((action) => (
          <a key={action.label} href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
            {action.label}
          </a>
        ))}
      </div>
      {column.sublink && <a className="header-mega-sublink" href={column.sublink.href}>{column.sublink.label}</a>}
    </motion.section>
  );
}
