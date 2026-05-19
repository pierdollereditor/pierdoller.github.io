export default function Footer() {
  return (
    <footer className="relative border-t border-[#C0BDB3]/10 px-5 md:px-10 lg:px-20 py-8 font-mono text-[11px] text-[#6A6660]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 tracking-wider">
        <div>© 2026 P.I.E.R.D.O.L.L.E.R · ALL FRAMES RESERVED</div>
        <div className="flex gap-6">
          <a
            href="#portfolio"
            className="hover:text-[#8B0A1F] transition-colors"
          >
            Portfolio
          </a>
          <a
            href="#manifesto"
            className="hover:text-[#8B0A1F] transition-colors"
          >
            Manifesto
          </a>
          <a href="#contact" className="hover:text-[#8B0A1F] transition-colors">
            Contact
          </a>
        </div>
        <div className="flex gap-3">
          <Social href="https://t.me/P1ERDOLLER" label="Telegram">
            <path d="M11.944 0A12 12 0 1 0 24 12.056A12.013 12.013 0 0 0 11.944 0ZM16.906 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.492-1.302.486c-.428-.008-1.252-.242-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635Z" />
          </Social>
          <Social href="https://x.com/pierdollerVFX" label="X">
            <path d="M18.244 2H21.5l-7.12 8.137L22 22h-5.956l-4.664-6.104L6.04 22H2.782l7.616-8.703L2 2h6.107l4.216 5.522L18.244 2Zm-1.142 18h1.804L7.128 3.895H5.193L17.102 20Z" />
          </Social>
          <Social href="https://instagram.com/pierdoller" label="Instagram">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              d="M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8Z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
            />
            <circle cx="17.5" cy="6.5" r="1.2" />
          </Social>
          <Social
            href="https://www.youtube.com/channel/UCp5XWO1wT_N0yn-WvnORJwg"
            label="YouTube"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </Social>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center border border-[#C0BDB3]/20 text-[#C0BDB3]/60 hover:border-[#8B0A1F] hover:text-[#8B0A1F] transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        {children}
      </svg>
    </a>
  );
}
