export type Category = "ALL" | "REELS" | "LONGFORM" | "COMMERCIAL";

export type Work = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "ALL">;
  year: number;
  duration: string;
  poster: string;
  link?: string;
};

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "REELS", label: "REELS / SHORTS" },
  { key: "LONGFORM", label: "YOUTUBE LONG" },
  { key: "COMMERCIAL", label: "COMMERCIALS" },
];

export const WORKS: Work[] = [
  {
    id: "spec-ops",
    title: "Spec Ops: The Line",
    subtitle: "Visual Essay · YouTube",
    category: "LONGFORM",
    year: 2026,
    duration: "24:18",
    poster: "/images/SOTL.png",
  },
  {
    id: "kripto",
    title: "Crypto Project",
    subtitle: "Before / After Edit",
    category: "COMMERCIAL",
    year: 2026,
    duration: "03:20",
    poster: "/images/kripto.png",
  },
  {
    id: "orcas",
    title: "Vox Orcas",
    subtitle: "VFX Mini-Documentary",
    category: "LONGFORM",
    year: 2026,
    duration: "08:42",
    poster: "/images/vox_orcas.jpg",
  },
  {
    id: "pepe",
    title: "The Last Ring-Bearer",
    subtitle: "YouTube · Visual Essay",
    category: "LONGFORM",
    year: 2026,
    duration: "18:55",
    poster: "/images/pepe.png",
  },
  {
    id: "motion",
    title: "Motion Design Reel",
    subtitle: "Branding · Motion",
    category: "REELS",
    year: 2026,
    duration: "01:20",
    poster: "/images/min.png",
  },
  {
    id: "sport",
    title: "Sports Promo",
    subtitle: "Commercial · Promo",
    category: "COMMERCIAL",
    year: 2026,
    duration: "00:45",
    poster: "/images/sport-promo.png",
  },
];
