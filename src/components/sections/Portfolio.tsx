import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { WORKS, CATEGORIES, type Category, type Work } from "../../data/works";
import { CONTENT } from "../../data/content";

const MOBILE_MEDIA_QUERY = "(max-width: 640px)";

export default function Portfolio() {
  const [filter, setFilter] = useState<Category>("ALL");
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  );
  const carouselRef = useRef<HTMLDivElement>(null);
  const list =
    filter === "ALL" ? WORKS : WORKS.filter((w) => w.category === filter);
  const t = CONTENT.portfolio;

  const labels: Record<Category, string> = {
    ALL: t.all,
    REELS: t.reels,
    LONGFORM: t.longform,
    COMMERCIAL: t.commercial,
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (isMobile) {
      carousel.scrollLeft = 0;
      carousel.querySelectorAll<HTMLElement>(".work-carousel-card").forEach((card) => {
        card.removeAttribute("style");
      });
      return;
    }

    let animationFrame = 0;
    let velocity = 0;

    const initializeCarousel = () => {
      carousel.scrollLeft = 0;
      updateCardTransforms();
    };

    const updateCardTransforms = () => {
      const carouselCenter = carousel.clientWidth / 2;
      carousel.querySelectorAll<HTMLElement>(".work-carousel-card").forEach((card) => {
        const cardCenter = card.offsetLeft - carousel.scrollLeft + card.offsetWidth / 2;
        const distance = (cardCenter - carouselCenter) / card.offsetWidth;
        const absoluteDistance = Math.min(Math.abs(distance), 2.25);
        const rotation = Math.max(-52, Math.min(52, distance * -42));
        const depth = absoluteDistance * -190;
        const verticalOffset = absoluteDistance * 22;
        const scale = Math.max(0.76, 1 - absoluteDistance * 0.12);

        card.style.transform = `translate3d(0, ${verticalOffset}px, ${depth}px) rotateY(${rotation}deg) scale(${scale})`;
        card.style.transformOrigin = "center center";
        card.style.filter = `blur(${Math.min(3.5, absoluteDistance * 2.1)}px) brightness(${Math.max(0.48, 1 - absoluteDistance * 0.24)})`;
        card.style.opacity = String(Math.max(0.35, 1 - absoluteDistance * 0.2));
        card.style.zIndex = String(100 - Math.round(absoluteDistance * 20));
      });
    };

    const handleScroll = () => {
      updateCardTransforms();
    };

    const animateScroll = () => {
      carousel.scrollLeft += velocity;
      velocity *= 0.9;
      if (Math.abs(velocity) < 0.08) {
        velocity = 0;
        animationFrame = 0;
        return;
      }
      animationFrame = requestAnimationFrame(animateScroll);
    };

    const startAnimation = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(animateScroll);
    };

    const handleWheel = (event: WheelEvent) => {
      const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = isHorizontalGesture ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      event.stopPropagation();
      const deltaScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? carousel.clientWidth
          : 1;
      velocity = Math.max(-70, Math.min(70, velocity + delta * deltaScale * 0.16));
      startAnimation();
    };

    const frame = requestAnimationFrame(initializeCarousel);
    const observer = new ResizeObserver(updateCardTransforms);
    observer.observe(carousel);
    carousel.addEventListener("wheel", handleWheel, { passive: false });
    carousel.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      carousel.removeEventListener("wheel", handleWheel);
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, [filter, isMobile]);

  useEffect(() => {
    if (!selectedWork) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedWork(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedWork]);

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    carouselRef.current?.scrollBy({
      left: (event.key === "ArrowRight" ? 1 : -1) * window.innerWidth * 0.55,
      behavior: "smooth",
    });
  };

  const scrollCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({
      left: direction * window.innerWidth * 0.42,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="portfolio"
      className="portfolio-section relative py-24 md:py-32 px-5 md:px-10 lg:px-20 overflow-hidden cinematic-bg"
      style={{ "--section-bg": "url('/images/bg-portfolio.webp')" } as CSSProperties}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="portfolio-intro">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] tracking-[0.3em] text-[#8B0A1F] mb-3 uppercase"
            >
              B / 02 · {t.label}
            </motion.div>
            <h2 className="text-[54px] md:text-[78px] uppercase leading-[0.86] text-[#C0BDB3] font-stencil font-black tracking-tight">
              {t.title}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="portfolio-index"
          >
            <div className="portfolio-index-copy">
              <span>Archive index / 2026</span>
              <span>Editing · Motion · Visual narrative</span>
            </div>
            <div className="portfolio-filters" role="group" aria-label="Filter projects">
              {CATEGORIES.map((category) => {
                const isActive = filter === category.key;
                return (
                  <button
                    type="button"
                    key={category.key}
                    onClick={() => setFilter(category.key)}
                    className={`portfolio-filter ${isActive ? "is-active" : ""}`}
                    aria-pressed={isActive}
                  >
                    {labels[category.key]}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="work-carousel-shell mt-12"
        >
          <div className="work-carousel-caption mb-2 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-[#6A6660]">
            <span><b>{String(list.length).padStart(2, "0")}</b> cases / selected archive</span>
            <div className="carousel-controls">
              <span>Wheel / swipe</span>
              <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Previous project">←</button>
              <button type="button" onClick={() => scrollCarousel(1)} aria-label="Next project">→</button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="work-carousel"
            role="region"
            aria-label="Selected works carousel"
            tabIndex={0}
            data-lenis-prevent
            onKeyDown={handleCarouselKeyDown}
          >
            {list.map((w, index) => (
              <article
                key={w.id}
                className="work-carousel-card group block text-left bg-transparent"
              >
                <button
                  type="button"
                  onClick={() => setSelectedWork(w)}
                  className="block w-full text-left cursor-pointer"
                  aria-label={`Open ${w.title}`}
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

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />

                  <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#8B0A1F] z-10" />
                  <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#8B0A1F] z-10" />
                  <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#8B0A1F] z-10" />
                  <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#8B0A1F] z-10" />

                  <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-[#E8E4DC] bg-black/80 px-2 py-1 z-10">
                    [ {w.category} ] · {w.duration}
                  </div>

                  <div className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.2em] text-[#E8E4DC] bg-black/80 px-2 py-1 z-10">
                    N°{String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B0A1F] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[18px] md:text-[22px] uppercase leading-tight text-[#C0BDB3] group-hover:text-[#8B0A1F] transition-colors truncate font-stencil font-black tracking-tight">
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
                </button>
              </article>
            ))}
          </div>
        </motion.div>
      </div>

      {selectedWork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={selectedWork.title}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedWork(null);
          }}
        >
          <div className="relative w-full max-w-6xl border border-[#C0BDB3]/20 bg-[#050505] p-2 md:p-4">
            <button
              type="button"
              onClick={() => setSelectedWork(null)}
              className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center border border-[#C0BDB3]/30 bg-black/80 font-mono text-lg text-[#C0BDB3] hover:border-[#8B0A1F] hover:text-[#8B0A1F]"
              aria-label="Close preview"
            >
              ×
            </button>
            <img
              src={selectedWork.poster}
              alt={selectedWork.title}
              className="max-h-[75svh] w-full object-contain"
            />
            <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-4">
              <div>
                <h3 className="font-stencil text-2xl font-black uppercase text-[#C0BDB3] md:text-4xl">
                  {selectedWork.title}
                </h3>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#6A6660] md:text-[11px]">
                  {selectedWork.subtitle}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[9px] text-[#8B0A1F] md:text-[11px]">
                {selectedWork.duration}
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
