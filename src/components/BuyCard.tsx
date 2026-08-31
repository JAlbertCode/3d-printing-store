import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "../lib/products";
import { SHIP_NOTE } from "../lib/config";

export type Selection = { top: string; base: string };

/**
 * Colors are chosen here, on the site, not at checkout. The Stripe link
 * carries no color dropdowns: the pairing rides along as client_reference_id
 * and shows up beside the order in the dashboard.
 *
 * That only holds if a pick is genuinely required before anyone can reach
 * Stripe, which is why the button is inert until `selection` exists.
 */
const referenceFor = (sel: Selection) =>
  `top-${sel.top}-base-${sel.base}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 200);

const withReference = (url: string, sel: Selection) =>
  url + (url.includes("?") ? "&" : "?") + `client_reference_id=${referenceFor(sel)}`;

export default function BuyCard({ p, selection }: { p: Product; selection?: Selection }) {
  const [note, setNote] = useState("");
  const ready = Boolean(selection && p.buyUrl);

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(""), 2400);
  };

  const onBuy = (e: React.MouseEvent) => {
    if (!p.buyUrl) {
      e.preventDefault();
      flash("Checkout link coming soon");
      return;
    }
    if (!selection) {
      e.preventDefault();
      flash("Pick a top and base color first");
      return;
    }
    // Stripe's receipt can't show the colors, so stash them for the
    // thank-you page to read back. Same browser, same session, no server.
    try {
      sessionStorage.setItem(
        "lw:lastOrder",
        JSON.stringify({ name: p.name, ...selection })
      );
    } catch {
      /* private mode: the reference id on the order is still authoritative */
    }
  };

  return (
    <aside
      aria-label="Purchase"
      className="hardcard p-4 shadow-[8px_8px_0_var(--color-primary)] sm:p-5"
    >
      <p className="display text-4xl">{p.price}</p>
      <ul className="mt-3 mb-4 text-sm">
        {p.includes.map((t) => (
          <li key={t} className="border-b border-hairline py-1.5 last:border-0">
            {t}
          </li>
        ))}
      </ul>

      <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t-2 border-border pt-3 font-mono text-[11px]">
        <dt className="font-semibold uppercase tracking-wide text-muted-fg">Top</dt>
        <dd className={selection ? "" : "text-muted-fg"}>
          {selection ? selection.top : "not picked"}
        </dd>
        <dt className="font-semibold uppercase tracking-wide text-muted-fg">Base</dt>
        <dd className={selection ? "" : "text-muted-fg"}>
          {selection ? selection.base : "not picked"}
        </dd>
      </dl>

      <motion.a
        whileTap={ready ? { scale: 0.98 } : undefined}
        href={ready ? withReference(p.buyUrl!, selection!) : "#"}
        onClick={onBuy}
        aria-disabled={!ready}
        className={
          "display block rounded-md border-2 border-border py-3.5 text-center transition-colors " +
          (ready
            ? "bg-primary text-primary-fg hover:bg-foreground"
            : "cursor-not-allowed bg-card text-muted-fg")
        }
      >
        {ready ? "Buy now" : "Choose your colors"}
      </motion.a>

      <p className="mt-3 flex items-center gap-2 whitespace-nowrap text-[11px] text-muted-fg">
        <span
          className={
            "h-2 w-2 flex-none rounded-full " +
            (note ? "bg-primary" : "bg-accent shadow-[0_0_0_3px_rgba(0,161,75,.18)]")
          }
        />
        {note || SHIP_NOTE}
      </p>
    </aside>
  );
}
