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

// Every spool physically on hand. This list is the catalog's source of truth:
// if it isn't here, it can't be ordered. Update grams as spools run down, and
// only add a row once the filament is actually in the room.
//
// Sources: Bambu order confirmation 2026-08-30, and the official
// "PLA Basic Color Trial Set" hex code table for the 250g colors.
export type Filament = {
  name: string;
  hex: string;
  finish: "Matte" | "Gloss"; // what the buyer sees; never name the polymer
  material: "PLA Basic" | "PLA Matte" | "PETG HF"; // internal: slicing + reorder
  grams: number;    // on hand right now
  spooled: boolean; // refills and paper spools need a reusable core for the AMS
};

// One row per color the buyer can see. Where a color exists in more than one
// stock (Black and Gray are in both the trial set and a 1kg PETG spool) the
// bigger spool wins, since it prints more units before it runs dry.
export const FILAMENTS: Filament[] = [
  // 1kg spools, the workhorses
  { name: "Black",       hex: "#161616", finish: "Gloss", material: "PETG HF",   grams: 1000, spooled: true },
  { name: "Gray",        hex: "#9a9d9f", finish: "Gloss", material: "PETG HF",   grams: 1000, spooled: true },
  { name: "Terracotta",  hex: "#b06046", finish: "Matte", material: "PLA Matte", grams: 1000, spooled: false },
  { name: "Marine Blue", hex: "#2e5c8a", finish: "Matte", material: "PLA Matte", grams: 1000, spooled: false },

  // 250g trial-set colors. Roughly two finished pieces each, so these run out
  // fast. MIN_GRAMS below pulls any of them off the site automatically.
  { name: "White",   hex: "#ffffff", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Beige",   hex: "#f7e6de", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Yellow",  hex: "#f4ee2a", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Green",   hex: "#00ae42", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Cyan",    hex: "#0086d6", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Blue",    hex: "#0a2989", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Purple",  hex: "#5e43b7", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Red",     hex: "#c12e1f", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Orange",  hex: "#ff6a13", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
  { name: "Cocoa",   hex: "#6f5034", finish: "Gloss", material: "PLA Basic", grams: 250, spooled: false },
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
      "Free shipping in the US",
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
      ["Finish", "Matte or gloss, depending on the color"],
      ["Feel", "Rigid printed plastic, fine layer lines, indoor display"],
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
