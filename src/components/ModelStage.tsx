import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CATALOG_FILAMENTS as FILAMENTS } from "../lib/products";

type MV = HTMLElement & {
  play: (o?: { repetitions: number }) => void;
  pause: () => void;
  model?: {
    materials: Array<{
      name: string;
      pbrMetallicRoughness: { setBaseColorFactor: (c: [number, number, number, number]) => void };
    }>;
  };
  queryHotspot?: (name: string) => {
    canvasPosition: { x: number; y: number };
    facingCamera: boolean;
  } | null;
};

type PointCallout = { label: string; position: string; normal?: string };
type DimCallout = { label: string; from: string; to: string; labelAt: string };
export type Callout = PointCallout | DimCallout;
export type Colorway = { name: string; materials: Record<string, string> };
// House signature: every Layerworks piece has a black stripe. It's the one
// fixed constant across the whole catalog. Top and base are the only parts
// that customize or randomize, on load and on every idle-cycle tick, so no
// two visits look alike. The one guard: never let a random roll (or the
// idle cycle) land on red top + white base together on the site's own
// initiative, that's the specific pairing we're keeping off the default
// state. A customer dialing it in themselves in the customizer is their
// choice, not ours, which is the distinction the whole trade-dress
// mitigation rests on. See ip-sell-check.
const HOUSE_STRIPE = "#161616";
// Keyed to the catalog by name, not to literal hexes, so a filament restock
// that changes a hex can't silently disarm the guard. If either color leaves
// the catalog the lookup goes undefined and the pairing simply can't occur.
const hexOf = (name: string) => FILAMENTS.find((f) => f.name === name)?.hex;
const RED_HEX = hexOf("Red");
// Every near-white base we stock. Red over any of these reads as the trade
// dress we're steering around, not just the one pure white.
const WHITE_HEXES = ["White", "Beige"]
  .map(hexOf)
  .filter((h): h is string => Boolean(h));
const isTradeDress = (top: string, base: string) =>
  Boolean(RED_HEX) && top === RED_HEX && WHITE_HEXES.includes(base);
const PARTS: { label: string; mat: string }[] = [
  { label: "Top", mat: "pk_red" },
  { label: "Base", mat: "pk_white" },
];
const randomHex = () => FILAMENTS[Math.floor(Math.random() * FILAMENTS.length)].hex;
const withHouse = (m: Record<string, string> = {}): Record<string, string> => {
  const top = m.pk_red ?? randomHex();
  let base = m.pk_white ?? randomHex();
  // Bounded: the catalog always holds more colors than the guarded set, but
  // cap the retries anyway so a thin catalog can never spin forever.
  for (let i = 0; i < 20 && isTradeDress(top, base); i++) base = randomHex();
  if (isTradeDress(top, base)) base = HOUSE_STRIPE;
  return { pk_red: top, pk_white: base, pk_black: HOUSE_STRIPE };
};
type Props = {
  src: string;
  alt: string;
  animation?: string;
  callouts?: Callout[];
  colorways?: Colorway[];
};

const isDim = (c: Callout): c is DimCallout => "from" in c;
const srgbToLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
const hexToFactor = (hex: string): [number, number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [
    srgbToLinear(((n >> 16) & 255) / 255),
    srgbToLinear(((n >> 8) & 255) / 255),
    srgbToLinear((n & 255) / 255),
    1,
  ];
};
const chip =
  "inline-flex items-center gap-1 border-2 border-border bg-card px-1.5 py-0.5 font-mono text-[9px] font-semibold shadow-[2px_2px_0_var(--color-border)]";

export default function ModelStage({ src, alt, animation = "Scene", callouts, colorways }: Props) {
  const mv = useRef<MV | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const [ready, setReady] = useState(false);   // viewer lib code-split, loaded on demand
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [colors, setColors] = useState<Record<string, string>>(() =>
    withHouse(colorways?.[0]?.materials)
  );
  const [showDims, setShowDims] = useState(true);
  const [customize, setCustomize] = useState(false);
  const [touched, setTouched] = useState(false);
  const shown = useRef<Record<string, string>>({});
  const reduceMotion = useReducedMotion();
  const dims = (callouts ?? []).filter(isDim);
  const points = (callouts ?? []).filter((c): c is PointCallout => !isDim(c));

  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true)).catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const el = mv.current;
    if (!el) return;
    const onLoad = () => {
      setLoaded(true);
      if (reduceMotion) {
        el.pause();
        setPlaying(false);
      } else {
        el.play({ repetitions: Infinity });
      }
    };
    const onError = () => setFailed(true);
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
    };
  }, [ready, reduceMotion]);

  // ease every color change over ~350ms so both auto-cycling and clicks feel deliberate
  useEffect(() => {
    const el = mv.current;
    if (!el || !loaded) return;
    const from: Record<string, [number, number, number, number]> = {};
    const to: Record<string, [number, number, number, number]> = {};
    for (const [matName, hex] of Object.entries(colors)) {
      from[matName] = hexToFactor(shown.current[matName] ?? hex);
      to[matName] = hexToFactor(hex);
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / 350, 1);
      const e = 1 - Math.pow(1 - t, 3);
      for (const matName of Object.keys(to)) {
        const mat = el.model?.materials.find((m) => m.name === matName);
        const a = from[matName], b = to[matName];
        mat?.pbrMetallicRoughness.setBaseColorFactor([
          a[0] + (b[0] - a[0]) * e,
          a[1] + (b[1] - a[1]) * e,
          a[2] + (b[2] - a[2]) * e,
          1,
        ]);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else shown.current = { ...colors };
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded, colors]);

  // idle showcase: randomize top and base independently across the full
  // palette. the stripe never moves, that consistency is the point.
  useEffect(() => {
    if (!loaded || touched || reduceMotion || !playing) return;
    const id = setInterval(() => {
      setColors((current) => {
        const next = { ...current };
        for (const part of PARTS) {
          const choices = FILAMENTS.filter((f) => f.hex !== current[part.mat]);
          const pick = choices[Math.floor(Math.random() * choices.length)];
          if (pick) next[part.mat] = pick.hex;
        }
        if (isTradeDress(next.pk_red, next.pk_white)) next.pk_white = current.pk_white;
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [loaded, touched, reduceMotion, playing]);

  // keep the measurement lines glued to their 3D endpoints
  useEffect(() => {
    const el = mv.current;
    const sv = svg.current;
    if (!el || !sv || !loaded || dims.length === 0 || !showDims) return;
    let raf = 0;
    const tick = () => {
      sv.setAttribute("viewBox", `0 0 ${el.clientWidth} ${el.clientHeight}`);
      dims.forEach((_, i) => {
        const a = el.queryHotspot?.(`hotspot-d${i}a`);
        const b = el.queryHotspot?.(`hotspot-d${i}b`);
        const ln = sv.querySelector<SVGLineElement>(`#dim-${i}`);
        if (a && b && ln) {
          ln.setAttribute("x1", String(a.canvasPosition.x));
          ln.setAttribute("y1", String(a.canvasPosition.y));
          ln.setAttribute("x2", String(b.canvasPosition.x));
          ln.setAttribute("y2", String(b.canvasPosition.y));
          ln.setAttribute("opacity", a.facingCamera && b.facingCamera ? "1" : "0.15");
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded, dims.length, showDims]);

  const togglePlay = () => {
    const el = mv.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play({ repetitions: Infinity });
    setPlaying(!playing);
  };

  return (
    <div className="hardcard overflow-hidden shadow-[8px_8px_0_var(--color-border)]">
      <div className="relative">
        {!loaded && !failed && (
          <div className="absolute inset-0 z-10 animate-pulse bg-muted" aria-hidden="true">
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-xs text-muted-fg">
              loading model…
            </p>
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-muted p-4 text-center">
            <div>
              <p className="text-sm font-medium">The 3D model didn’t load.</p>
              <button
                onClick={() => location.reload()}
                className="mt-3 rounded-md border-2 border-border bg-card px-3 py-2 font-mono text-xs font-semibold hover:bg-foreground hover:text-background"
              >
                Reload page
              </button>
            </div>
          </div>
        )}
        {ready && (
        <model-viewer
          ref={mv as never}
          src={src}
          alt={alt}
          camera-controls
          animation-name={animation}
          camera-orbit="0deg 80deg 640m"
          max-camera-orbit="auto auto 900m"
          camera-target="30m 68m 10m"
          shadow-intensity="0.7"
          exposure="1.05"
          tone-mapping="neutral"
          interaction-prompt="none"
          style={{ "--min-hotspot-opacity": "0.15" } as React.CSSProperties}
        >
          {showDims && points.map((c, i) => (
            <div
              key={c.label}
              slot={`hotspot-p${i}`}
              data-position={c.position}
              data-normal={c.normal ?? "0 0 1"}
              className="pointer-events-none -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <span className={chip}>
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                {c.label}
              </span>
            </div>
          ))}
          {showDims && dims.map((d, i) => (
            <Fragment key={d.label}>
              <div
                slot={`hotspot-d${i}a`}
                data-position={d.from}
                data-normal="0 0 1"
                className="pointer-events-none h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card"
              />
              <div
                slot={`hotspot-d${i}b`}
                data-position={d.to}
                data-normal="0 0 1"
                className="pointer-events-none h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card"
              />
              <div
                slot={`hotspot-d${i}l`}
                data-position={d.labelAt}
                data-normal="0 0 1"
                className="pointer-events-none -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                <span className={chip}>{d.label}</span>
              </div>
            </Fragment>
          ))}
          {showDims && dims.length > 0 && (
            <svg
              ref={svg}
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {showDims && dims.map((d, i) => (
                <line
                  key={d.label}
                  id={`dim-${i}`}
                  stroke="var(--color-border)"
                  strokeWidth="1.25"
                />
              ))}
            </svg>
          )}
        </model-viewer>
        )}
        {!ready && <div style={{ height: "min(58vh, 540px)" }} />}
        {loaded && !failed && (
          <span className={`pointer-events-none absolute bottom-3 right-3 ${chip} text-muted-fg`}>
            drag to spin it around
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 border-t-2 border-border bg-background p-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={togglePlay}
          aria-pressed={playing}
          className={`rounded-md border-2 px-3 py-2 font-mono text-xs font-semibold transition-colors ${
            playing
              ? "border-accent bg-accent text-white"
              : "border-border bg-card hover:bg-foreground hover:text-background"
          }`}
        >
          <span className="grid">
            <span className="invisible col-start-1 row-start-1">Pause</span>
            <span className="col-start-1 row-start-1">{playing ? "Pause" : "Play"}</span>
          </span>
        </motion.button>
        {dims.length + points.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowDims((v) => !v)}
            aria-pressed={showDims}
            className={`rounded-md border-2 px-3 py-2 font-mono text-xs font-semibold transition-colors ${
              showDims
                ? "border-border bg-foreground text-background"
                : "border-border bg-card hover:bg-foreground hover:text-background"
            }`}
          >
            Dimensions
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setTouched(true);
            setCustomize((v) => !v);
          }}
          aria-pressed={customize}
          aria-expanded={customize}
          className={`rounded-md border-2 px-3 py-2 font-mono text-xs font-semibold transition-colors ${
            customize
              ? "border-border bg-foreground text-background"
              : "border-border bg-card hover:bg-foreground hover:text-background"
          }`}
        >
          Customize
        </motion.button>
        {customize && (
          <div className="w-full border-t-2 border-border pt-3">
            {PARTS.map((part) => (
              <div key={part.mat} className="mb-1 flex flex-wrap items-center gap-0.5">
                <span className="w-14 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-fg">
                  {part.label}
                </span>
                {FILAMENTS.map((f) => (
                  <button
                    key={f.name}
                    aria-pressed={colors[part.mat] === f.hex}
                    aria-label={`${part.label}: ${f.name}, ${f.finish.toLowerCase()} finish`}
                    title={`${f.name} · ${f.finish}`}
                    onClick={() => {
                      setTouched(true);
                      setColors((c) => ({ ...c, [part.mat]: f.hex }));
                    }}
                    className="relative grid h-7 w-7 place-items-center rounded-sm border border-border"
                    style={{ background: f.hex }}
                  >
                    {colors[part.mat] === f.hex && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.9)]"
                      >
                        <path
                          d="M3 8.5l3 3 7-7"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ))}
            <p className="mt-1 font-mono text-[10px] text-muted-fg">
              the black stripe is the same on every Layerworks piece, top and base are yours to pick, and every color is a filament we stock printed exactly as shown
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
