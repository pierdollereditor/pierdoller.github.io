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
    duration: "00:11",
    poster: "/images/SOTL.png",
    link: "https://youtu.be/ScFonzMbJmM",
  },
  {
    id: "orcas",
    title: "Vox Orcas",
    subtitle: "VFX Mini-Documentary",
    category: "REELS",
    year: 2026,
    duration: "01:13",
    poster: "/images/vox_orcas.jpg",
    link: "https://youtube.com/shorts/O3tjabKq_ao",
  },
  {
    id: "pepe",
    title: "The Last Ring-Bearer",
    subtitle: "YouTube · Visual Essay",
    category: "LONGFORM",
    year: 2026,
    duration: "00:31",
    poster: "/images/pepe.png",
    link: "https://youtu.be/tFkY4MPuwHg",
  },
  {
    id: "gangland",
    title: "Gangland",
    subtitle: "Visual Upgrade · Motion Design",
    category: "COMMERCIAL",
    year: 2026,
    duration: "00:30",
    poster: "/images/Valley Clab.jpg",
    link: "https://youtu.be/0KrHLNThq-4",
  },
];
