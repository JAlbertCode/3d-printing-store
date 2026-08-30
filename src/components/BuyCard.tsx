import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "../lib/products";
import { SHIP_NOTE } from "../lib/config";

export default function BuyCard({ p }: { p: Product }) {
  const [note, setNote] = useState(false);

  const onBuy = (e: React.MouseEvent) => {
    if (p.buyUrl) return;
    e.preventDefault();
    setNote(true);
    setTimeout(() => setNote(false), 2200);
  };

  return (
    <aside
      aria-label="Purchase"
      className="hardcard p-4 shadow-[8px_8px_0_var(--color-primary)] sm:p-5"
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-border pb-3">
        <span className="font-mono text-sm font-semibold uppercase">{p.name}</span>
        <span className="rounded-sm border-2 border-primary px-2 py-1 text-center font-mono text-[10px] leading-tight text-primary">
          MADE TO
          <br />
          ORDER
        </span>
      </div>
      <p className="display mt-3 text-4xl">{p.price}</p>
      <ul className="mt-3 mb-4 text-sm">
        {p.includes.map((t) => (
          <li key={t} className="border-b border-hairline py-1.5 last:border-0">
            {t}
          </li>
        ))}
      </ul>
      <motion.a
        whileTap={{ scale: 0.98 }}
        href={p.buyUrl || "#"}
        onClick={onBuy}
        className="display block rounded-md border-2 border-border bg-primary py-3.5 text-center text-primary-fg transition-colors hover:bg-foreground"
      >
        {note ? "Checkout link coming soon" : "Buy now, printed to order"}
      </motion.a>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-fg">
        <span className="h-2 w-2 flex-none rounded-full bg-accent shadow-[0_0_0_3px_rgba(0,161,75,.18)]" />
        {SHIP_NOTE}
      </p>
    </aside>
  );
}
