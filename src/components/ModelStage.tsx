import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  const [cw, setCw] = useState(0);
  const [showDims, setShowDims] = useState(true);
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

  useEffect(() => {
    const el = mv.current;
    if (!el || !loaded || !colorways?.length) return;
    const pick = colorways[Math.min(cw, colorways.length - 1)];
    for (const [matName, hex] of Object.entries(pick.materials)) {
      const mat = el.model?.materials.find((m) => m.name === matName);
      mat?.pbrMetallicRoughness.setBaseColorFactor(hexToFactor(hex));
    }
  }, [loaded, cw, colorways]);

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
              {dims.map((d, i) => (
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
            <span className="invisible col-start-1 row-start-1">Pause mechanism</span>
            <span className="col-start-1 row-start-1">{playing ? "Pause mechanism" : "Play mechanism"}</span>
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
        {colorways && colorways.length > 1 && (
          <div role="group" aria-label="Colorway" className="flex items-center gap-0.5">
            {colorways.map((c, i) => (
              <button
                key={c.name}
                aria-pressed={i === cw}
                aria-label={c.name}
                title={c.name}
                onClick={() => setCw(i)}
                className="grid h-9 w-9 place-items-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={`h-5 w-5 rounded-full border-2 transition-transform ${
                    i === cw ? "scale-110 ring-2 ring-foreground ring-offset-1" : "group-hover:scale-110"
                  }`}
                  style={{
                    background: c.materials.pk_red ?? "#ccc",
                    borderColor: c.materials.pk_black ?? "var(--color-border)",
                  }}
                />
              </button>
            ))}
            <span className="ml-1 font-mono text-[10px] font-semibold text-muted-fg">
              {colorways[cw]?.name}
            </span>
          </div>
        )}
        <span className="ml-auto text-xs text-muted-fg">
          drag to spin it around
        </span>
      </div>
    </div>
  );
}
