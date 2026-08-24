import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { WORKS, CATEGORIES, type Category } from "../../data/works";
import { CONTENT } from "../../data/content";

const CAROUSEL_COPIES = 3;

export default function Portfolio() {
  const [filter, setFilter] = useState<Category>("ALL");
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
    const carousel = carouselRef.current;
    if (!carousel) return;
    let animationFrame = 0;
    let velocity = 0;

    const centerCarousel = () => {
      const firstCard = carousel.querySelector<HTMLElement>(".work-carousel-card");
      if (!firstCard) return;
      carousel.scrollLeft =
        carousel.scrollWidth / CAROUSEL_COPIES -
        (carousel.clientWidth - firstCard.offsetWidth) / 2;
      updateCardTransforms();
    };

    const keepCarouselLooped = () => {
      const segmentWidth = carousel.scrollWidth / CAROUSEL_COPIES;
      if (carousel.scrollLeft < segmentWidth * 0.5) {
        carousel.scrollLeft += segmentWidth;
      } else if (carousel.scrollLeft > segmentWidth * 1.5) {
        carousel.scrollLeft -= segmentWidth;
      }
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
        card.style.transformOrigin = distance < 0 ? "right center" : "left center";
        card.style.filter = `blur(${Math.min(3.5, absoluteDistance * 2.1)}px) brightness(${Math.max(0.48, 1 - absoluteDistance * 0.24)})`;
        card.style.opacity = String(Math.max(0.35, 1 - absoluteDistance * 0.2));
        card.style.zIndex = String(100 - Math.round(absoluteDistance * 20));
      });
    };

    const handleScroll = () => {
      keepCarouselLooped();
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

    const frame = requestAnimationFrame(centerCarousel);
    const observer = new ResizeObserver(centerCarousel);
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
  }, [filter]);

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
      className="relative py-24 md:py-32 px-5 md:px-10 lg:px-20 overflow-hidden cinematic-bg"
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
            <span><b>{String(list.length).padStart(2, "0")}</b> cases / looped archive</span>
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
            {Array.from({ length: CAROUSEL_COPIES }, (_, copy) =>
              list.map((w, index) => (
              <article
                key={`${copy}-${w.id}`}
                className="work-carousel-card group block text-left bg-transparent"
                aria-hidden={copy !== 1}
              >
                <div className="relative aspect-video bg-[#1A1714] overflow-hidden border border-[#C0BDB3]/10 group-hover:border-[#8B0A1F]/60 transition-all duration-500">
                  <img
                    src={w.poster}
                    alt={copy === 1 ? w.title : ""}
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
              </article>
              )),
            )}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
