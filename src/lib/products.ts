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
  };
  includes: string[];
  steps?: { n: string; t: string; d: string }[];
  specs?: [string, string][];
  buyUrl?: string;       // per-product checkout link
  tint: string;          // card tile accent
};

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
      src: "models/capsule_slab.glb?v=4",
      alt: "Capsule Slab card display: the top half lifts off, a toploader slides down the rails, and the top snaps back on",
      animation: "Scene",
      callouts: [
        { label: "4.9\" wide", from: "-63.3 -88 24", to: "63.3 -88 24", labelAt: "0 -102 24" },
        { label: "8.3\" tall", from: "92 -55.5 24", to: "92 155 24", labelAt: "108 50 24" },
        { label: "0.8\" deep", from: "-84 -30 0", to: "-84 -30 20", labelAt: "-84 -13 10" },
        { label: 'fits a standard 3" toploader', position: "-47 62 12" },
      ],
    },
    includes: [
      "The display, fully assembled and tested",
      "One card holder (standard toploader) included",
      "Wall-mount slot and screw, hangs in one minute",
      "One printed piece per half, no hardware inside",
    ],
    steps: [
      { n: "01", t: "Lift", d: "The top half pulls straight off the rails. The base stays put on the wall." },
      { n: "02", t: "Slide", d: "Your card, in its holder, drops down the side rails into a seated pocket. Nothing ever touches the card itself." },
      { n: "03", t: "Press", d: "Set the top back onto the rails and press. They seat into deep sockets for a snug, square fit." },
    ],
    specs: [
      ["Fits", '3" × 4-1/16" toploaders, 35pt (BCW / Ultra Pro standard)'],
      ["Diameter", '4.9" (125 mm)'],
      ["Depth", '0.8" body, 0.95" at the button'],
      ["Retention", "Rails seat into deep sockets in the top, no magnets or glue"],
      ["Mount", "Keyhole slot, #6 or #8 pan-head screw"],
      ["Material", "Matte PLA plastic, fine layer finish"],
      ["Card safety", "Only the holder touches the display, never your card"],
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
