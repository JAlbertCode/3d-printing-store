import { motion } from "framer-motion";
import { reveal, stagger } from "../lib/motion";
import {
  CONTACT_EMAIL,
  LEAD_TIME,
  RETURN_WINDOW,
  SHIP_CARRIER,
  SHIP_REGION,
} from "../lib/config";

const sections: { h: string; body: string[] }[] = [
  {
    h: "Made to order",
    body: [
      `Nothing here sits on a shelf waiting for a buyer. Your piece is printed after you order it, in the colors you picked, which is why it takes ${LEAD_TIME} to ship instead of same day.`,
      "It also means we can cancel and refund you in full any time before your piece goes on the printer. Once it's printing, we can't un-print it, but see the returns section below.",
    ],
  },
  {
    h: "Shipping",
    body: [
      `Shipping is included in the price. There is no separate shipping charge at checkout, and the price you see on the product page is the price of the item.`,
      `Orders go out via ${SHIP_CARRIER} with tracking, emailed to you as soon as the label is made. We currently ship within the ${SHIP_REGION} only.`,
      "Sales tax is calculated at checkout based on your address and shown in the breakdown before you pay.",
    ],
  },
  {
    h: "If it arrives damaged",
    body: [
      "Email us a photo of the damage and we will print and ship you a replacement at no cost. You don't need to send the broken one back, and there's no time limit on this. A piece that arrived cracked is our problem, not yours.",
    ],
  },
  {
    h: "Returns on stock products",
    body: [
      `Stock catalog items can be returned within ${RETURN_WINDOW} of delivery for a refund, as long as they come back unused and undamaged. Return shipping is on you unless the piece was damaged or we sent the wrong thing.`,
      "Email us first so we can give you the return address.",
    ],
  },
  {
    h: "Custom and commissioned work",
    body: [
      "Custom pieces are designed and printed for one person, so they can't be resold and they aren't returnable. We work out the design with you before anything gets printed, and you approve it first.",
      "If a custom piece arrives damaged or doesn't match what you approved, the damage policy above still applies in full.",
    ],
  },
  {
    h: "What we make things out of",
    body: [
      "Everything in the catalog is printed in PLA with a gloss finish, built up in fine layers. Same material in every color, so the color is the only choice you have to make.",
      "These are made for indoor display. Left in a hot car or a sunny window long enough, printed plastic can soften, so hang it somewhere you'd be happy to hang a photograph.",
    ],
  },
];

export default function Policies() {
  return (
    <>
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-[5vw] pb-12 pt-14"
      >
        <motion.a
          variants={reveal}
          href="#/"
          className="font-mono text-xs font-semibold hover:text-primary"
        >
          ← All products
        </motion.a>
        <motion.p
          variants={reveal}
          className="mb-3 mt-6 font-mono text-xs font-semibold text-accent"
        >
          {"THE FINE PRINT, UNABBREVIATED"}
        </motion.p>
        <motion.h1 variants={reveal} className="display text-[clamp(2.6rem,5.5vw,4.6rem)]">
          Shipping
          <br />
          &amp; returns
        </motion.h1>
        <motion.p variants={reveal} className="mt-5 max-w-[46ch] text-muted-fg">
          Short version: if something's wrong with your piece, we make you a new
          one. The rest is detail.
        </motion.p>
      </motion.section>

      <section className="border-t-2 border-border px-[5vw] py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid max-w-3xl gap-10"
        >
          {sections.map((s) => (
            <motion.article key={s.h} variants={reveal}>
              <h2 className="display border-b-2 border-border pb-3 text-2xl">{s.h}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 text-sm leading-relaxed text-muted-fg">
                  {p}
                </p>
              ))}
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="border-t-2 border-border px-[5vw] py-16">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="hardcard max-w-2xl p-6 shadow-[8px_8px_0_var(--color-primary)]"
        >
          <h2 className="display text-2xl">Still need a person?</h2>
          <p className="mt-3 text-sm text-muted-fg">
            One of us reads every email. Include your order number if you have
            one and we'll get back to you.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="display mt-5 inline-block rounded-md border-2 border-border bg-primary px-6 py-3 text-primary-fg transition-colors hover:bg-foreground"
          >
            {CONTACT_EMAIL}
          </a>
        </motion.div>
      </section>
    </>
  );
}
