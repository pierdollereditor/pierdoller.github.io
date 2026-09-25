export type Category = "ALL" | "REELS" | "LONGFORM" | "COMMERCIAL";

export type Work = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "ALL">;
  year: number;
  duration: string;
  poster: string;
  posterMobile: string;
  link?: string;
  accent: string;
  backdrop: string;
};

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "REELS", label: "REELS / SHORTS" },
  { key: "LONGFORM", label: "YOUTUBE LONG" },
  { key: "COMMERCIAL", label: "COMMERCIALS" },
];

export const WORKS: Work[] = [
  {
    id: "invenio",
    title: "INVENIO",
    subtitle: "Product Promo · Motion Design",
    category: "COMMERCIAL",
    year: 2026,
    duration: "00:22",
    poster: "/images/apple.webp",
    posterMobile: "/images/apple-mobile.webp",
    link: "https://youtu.be/oWnPQs2Sxrg",
    accent: "#C7D5E7",
    backdrop: "#17202C",
  },
  {
    id: "spec-ops",
    title: "Spec Ops: The Line",
    subtitle: "Visual Essay · YouTube",
    category: "LONGFORM",
    year: 2026,
    duration: "00:11",
    poster: "/images/spec-ops.webp",
    posterMobile: "/images/spec-ops-mobile.webp",
    link: "https://youtu.be/ScFonzMbJmM",
    accent: "#B06A45",
    backdrop: "#28150F",
  },
  {
    id: "orcas",
    title: "Vox Orcas",
    subtitle: "VFX Mini-Documentary",
    category: "REELS",
    year: 2026,
    duration: "01:13",
    poster: "/images/vox-orcas.webp",
    posterMobile: "/images/vox-orcas-mobile.webp",
    link: "https://youtube.com/shorts/O3tjabKq_ao",
    accent: "#2FAEDB",
    backdrop: "#08283A",
  },
  {
    id: "pepe",
    title: "The Last Ring-Bearer",
    subtitle: "YouTube · Visual Essay",
    category: "LONGFORM",
    year: 2026,
    duration: "00:31",
    poster: "/images/last-ring.webp",
    posterMobile: "/images/last-ring-mobile.webp",
    link: "https://youtu.be/tFkY4MPuwHg",
    accent: "#B99A42",
    backdrop: "#261D09",
  },
  {
    id: "gangland",
    title: "Gangland",
    subtitle: "Visual Upgrade · Motion Design",
    category: "COMMERCIAL",
    year: 2026,
    duration: "00:30",
    poster: "/images/gangland.webp",
    posterMobile: "/images/gangland-mobile.webp",
    link: "https://youtu.be/0KrHLNThq-4",
    accent: "#B77A27",
    backdrop: "#241408",
  },
  {
    id: "paleontology",
    title: "Paleontology",
    subtitle: "Documentary Series · YouTube",
    category: "LONGFORM",
    year: 2026,
    duration: "01:17",
    poster: "/images/paleontology.webp",
    posterMobile: "/images/paleontology-mobile.webp",
    link: "https://youtu.be/zX29pPatLkg",
    accent: "#D5CAB9",
    backdrop: "#1C1C1A",
  },
  {
    id: "hustle-cult",
    title: "Hustle Cult",
    subtitle: "Documentary Series · YouTube",
    category: "LONGFORM",
    year: 2026,
    duration: "00:54",
    poster: "/images/hustle.webp",
    posterMobile: "/images/hustle-mobile.webp",
    link: "https://youtu.be/DlX56p5YHVk",
    accent: "#C0362C",
    backdrop: "#1F1614",
  },
];
