export type Product = {
  slug: string;
  name: string;
  series: string;        // catalog code, e.g. "001 · WALL MOUNT SERIES"
  price: string;
  tagline: string;
  blurb: string;
  status: "available" | "coming-soon";
  model?: {
    src: string;
    alt: string;
    animation?: string;
    callouts?: (
      | { label: string; position: string; normal?: string }
      | { label: string; from: string; to: string; labelAt: string }
    )[];
    colorways?: { name: string; materials: Record<string, string> }[];
  };
  includes: string[];
  steps?: { n: string; t: string; d: string }[];
  specs?: [string, string][];
  buyUrl?: string;       // per-product checkout link
  tint: string;          // card tile accent
};

// Every spool physically in stock; per-part customization draws from this list
export const FILAMENTS: { name: string; hex: string }[] = [
  { name: "Jade White", hex: "#f2f3f0" },
  { name: "Black", hex: "#161616" },
  { name: "Silver", hex: "#8b9398" },
  { name: "Red", hex: "#c22e2a" },
  { name: "Orange", hex: "#e07a2f" },
  { name: "Yellow", hex: "#f5d020" },
  { name: "Green", hex: "#3f8f4f" },
  { name: "Cyan", hex: "#4fb6c9" },
  { name: "Blue", hex: "#2f6bbf" },
  { name: "Marine Blue", hex: "#2e5c8a" },
  { name: "Purple", hex: "#6b4ba1" },
  { name: "Brown", hex: "#6f4a35" },
  { name: "Beige", hex: "#d9c9a8" },
  { name: "Terracotta", hex: "#b65a41" },
];

export const products: Product[] = [
  {
    slug: "capsule-slab",
    name: "Capsule Slab",
    series: "001 · WALL MOUNT SERIES",
    price: "$27.99",
    tagline: "Put your best card on the wall. No tools, no frame, no fingerprints.",
    blurb:
      "Lift the top, slide your card in, snap it shut. Hangs on the wall or stands on a shelf. The preview here is the real thing, so grab it and spin it.",
    status: "available",
    model: {
      src: "models/capsule_slab.glb?v=5",
      alt: "Capsule Slab card display: the top half lifts off, a toploader slides down the rails, and the top snaps back on",
      animation: "Scene",
      // no curated presets: top and base are free to land anywhere in
      // FILAMENTS. the stripe is the one fixed constant, see HOUSE_STRIPE
      // in ModelStage, so it never keeps the old white/black look in place
      callouts: [
        { label: "4.9\" wide", from: "-63.3 -88 24", to: "63.3 -88 24", labelAt: "0 -102 24" },
        { label: "8.3\" tall", from: "92 -55.5 24", to: "92 155 24", labelAt: "108 50 24" },
        { label: "0.8\" deep", from: "-84 -30 0", to: "-84 -30 20", labelAt: "-84 -13 10" },
        { label: 'fits a standard 3" toploader', position: "-47 62 12" },
      ],
    },
    includes: [
      "Fully assembled and tested",
      'Standard 3" toploader included',
      "Hangs on one screw (included)",
    ],
    steps: [
      { n: "01", t: "Lift", d: "The top half pulls straight off the rails. The base stays put on the wall." },
      { n: "02", t: "Slide", d: "Your card, in its holder, drops down the side rails into a seated pocket. Nothing ever touches the card itself." },
      { n: "03", t: "Press", d: "Set the top back onto the rails and press. They seat into deep sockets for a snug, square fit." },
    ],
    specs: [
      ["Fits", '3" × 4-1/16" toploaders, 35pt (BCW / Ultra Pro standard)'],
      ["Size", '4.9" wide · 8.3" tall · 0.8" deep'],
      ["Mount", "Keyhole slot, #6 or #8 pan-head screw"],
      ["Material", "Matte PLA plastic, fine layer finish"],
    ],
    tint: "#c22e2a",
  },
  {
    slug: "hard-pack",
    name: "Hard Pack",
    series: "002 · DESK SERIES",
    price: "$21.99",
    tagline: "A flip-top phone stand with a bad habit.",
    blurb: "A working flip-top lid and a comfortable viewing lean. Holds any phone sideways.",
    status: "coming-soon",
    includes: ["Printed stand with working flip-top lid"],
    tint: "#8a4b23",
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
