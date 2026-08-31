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

// Every spool physically on hand that this catalog sells from. One material,
// one finish, so a product page can state its finish flatly instead of
// hedging. Update grams as spools run down; only add a row once the filament
// is actually in the room.
//
// Source: the PLA Basic Color Trial Set official hex code table.
//
// Deliberately NOT listed: the 1kg PLA Matte spools (Terracotta, Marine Blue)
// and the 1kg PETG HF spools (Black, Gray). They're on the shelf, but mixing
// them in would put two different sheens on one piece. They're held for
// commissions and for future products that need the toughness.
export type Filament = {
  name: string;
  hex: string;
  grams: number; // on hand right now
};

export const MATERIAL = "PLA Basic"; // internal: slicer profile and reorders
export const FINISH = "Gloss";       // what the buyer sees

export const FILAMENTS: Filament[] = [
  { name: "Black",  hex: "#000000", grams: 250 },
  { name: "White",  hex: "#ffffff", grams: 250 },
  { name: "Gray",   hex: "#8e9089", grams: 250 },
  { name: "Beige",  hex: "#f7e6de", grams: 250 },
  { name: "Red",    hex: "#c12e1f", grams: 250 },
  { name: "Orange", hex: "#ff6a13", grams: 250 },
  { name: "Yellow", hex: "#f4ee2a", grams: 250 },
  { name: "Green",  hex: "#00ae42", grams: 250 },
  { name: "Cyan",   hex: "#0086d6", grams: 250 },
  { name: "Blue",   hex: "#0a2989", grams: 250 },
  { name: "Purple", hex: "#5e43b7", grams: 250 },
  { name: "Cocoa",  hex: "#6f5034", grams: 250 },
];

// Conservative grams for one finished Capsule Slab, top + base + stripe.
// Replace with the real figure off a Bambu Studio slice.
export const GRAMS_PER_UNIT = 90;
// A color needs at least one full unit left to be honestly sellable.
export const MIN_GRAMS = GRAMS_PER_UNIT;

/** Colors the site is allowed to offer right now. */
export const CATALOG_FILAMENTS = FILAMENTS.filter((f) => f.grams >= MIN_GRAMS);

export const products: Product[] = [
  {
    slug: "capsule-slab",
    name: "Capsule Slab",
    series: "001 · WALL MOUNT SERIES",
    price: "$34.99", // shipping baked in, see policies page
    tagline: "Put your best card on the wall. No tools, no frame, no fingerprints.",
    blurb:
      "Lift the top, slide your card in, snap it shut. Hangs on the wall or stands on a shelf. The preview here is the real thing, so grab it and spin it.",
    status: "available",
    buyUrl: "https://buy.stripe.com/28EcMZ7YXeYo9k51TU9oc02",
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
      "Free US shipping",
      "Card cover and wall adhesive included",
      "Assembled and test-fitted",
    ],
    steps: [
      { n: "01", t: "Lift", d: "The top half pulls straight off the rails. The base stays put on the wall." },
      { n: "02", t: "Slide", d: "Your card, in its holder, drops down the side rails into a seated pocket. Nothing ever touches the card itself." },
      { n: "03", t: "Press", d: "Set the top back onto the rails and press. They seat into deep sockets for a snug, square fit." },
    ],
    specs: [
      ["Fits", '3" × 4-1/16" toploaders, 35pt (BCW / Ultra Pro standard)'],
      ["Size", '4.9" wide · 8.3" tall · 0.8" deep'],
      ["Mount", "Adhesive strip, no drilling"],
      ["Finish", "Gloss"],
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
