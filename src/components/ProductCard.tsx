import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "../lib/products";
import { reveal } from "../lib/motion";

export default function ProductCard({ p }: { p: Product }) {
  const available = p.status === "available";
  const [viewerReady, setViewerReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!p.model) return;
    import("@google/model-viewer").then(() => setViewerReady(true)).catch(() => {});
  }, [p.model]);

  const inner = (
    <>
      <div className="relative h-52 rounded-t-[0.65rem] border-b-2 border-border bg-background">
        {p.model && viewerReady ? (
          <model-viewer
            src={p.model.src}
            alt={p.model.alt}
            animation-name={p.model.animation ?? "Scene"}
            {...(reduceMotion ? {} : { autoplay: true })}
            camera-orbit="0deg 80deg 640m"
            camera-target="30m 68m 10m"
            shadow-intensity="0.5"
            exposure="1.05"
            tone-mapping="neutral"
            interaction-prompt="none"
            className="pointer-events-none h-full w-full"
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          />
        ) : (
          <div
            className="h-full w-full rounded-t-[0.55rem]"
            style={{ background: `linear-gradient(140deg, ${p.tint} 0%, #16181d 130%)` }}
          />
        )}
        <span className="absolute left-4 bottom-3 font-mono text-[11px] font-semibold text-muted-fg">
          {p.series}
        </span>
        {available ? (
          <span className="absolute right-4 bottom-3 rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-semibold">
            3D PREVIEW
          </span>
        ) : (
          <span className="absolute right-4 bottom-3 rounded-sm border border-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-white/90">
            COMING SOON
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="display text-xl">{p.name}</h3>
          <span className="font-mono text-sm font-semibold">{available ? p.price : "TBD"}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted-fg">{p.tagline}</p>
        <p className="mt-3 font-mono text-xs font-semibold">
          {available ? "See it in 3D →" : "In the works"}
        </p>
      </div>
    </>
  );

  return (
    <motion.div variants={reveal}>
      {available ? (
        <a
          href={`#/p/${p.slug}`}
          className="hardcard block overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-border)]"
        >
          {inner}
        </a>
      ) : (
        <div className="hardcard overflow-hidden border-dashed opacity-90">{inner}</div>
      )}
    </motion.div>
  );
}
