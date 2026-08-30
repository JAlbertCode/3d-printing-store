import { motion } from "framer-motion";
import { reveal, stagger } from "../lib/motion";
import { CONTACT_EMAIL, LEAD_TIME, SHIP_CARRIER } from "../lib/config";

const steps = [
  {
    n: "01",
    t: "We print it",
    d: "Your piece goes into the queue and gets printed in the colors you picked. Nothing is sitting in a warehouse waiting.",
  },
  {
    n: "02",
    t: "We check it",
    d: "Every piece is assembled and test-fitted with a real toploader before it goes in a box. If it isn't right, it gets reprinted.",
  },
  {
    n: "03",
    t: "It ships",
    d: `On its way within ${LEAD_TIME} via ${SHIP_CARRIER}. Tracking lands in your inbox the moment the label is made.`,
  },
];

export default function ThankYou() {
  return (
    <>
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-[5vw] pb-16 pt-14"
      >
        <motion.p variants={reveal} className="mb-3 font-mono text-xs font-semibold text-accent">
          {"ORDER CONFIRMED"}
        </motion.p>
        <motion.h1 variants={reveal} className="display text-[clamp(2.6rem,5.5vw,4.6rem)]">
          Thanks. It's
          <br />
          on the printer.
        </motion.h1>
        <motion.p variants={reveal} className="mt-5 max-w-[46ch] text-muted-fg">
          Your receipt is already in your email. Keep it, it has your order
          number on it. If anything below doesn't match what you expected, reply
          to that email and we'll sort it out.
        </motion.p>
      </motion.section>

      <section className="border-t-2 border-border px-[5vw] py-16">
        <h2 className="display mb-8 text-3xl">What happens next</h2>
        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {steps.map((s) => (
            <motion.li key={s.n} variants={reveal} className="hardcard rounded-md p-5">
              <span className="font-mono text-xs font-semibold text-primary">{s.n}</span>
              <h3 className="display mt-2 text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-fg">{s.d}</p>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      <section className="border-t-2 border-border px-[5vw] py-16">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="hardcard max-w-2xl p-6 shadow-[8px_8px_0_var(--color-primary)]"
        >
          <p className="font-mono text-xs font-semibold text-accent">{"ONE FAVOR"}</p>
          <h2 className="display mt-2 text-2xl">Send us a photo once it's up</h2>
          <p className="mt-3 text-sm text-muted-fg">
            We're a two-person shop and a picture of your piece on a real wall is
            worth more to us than any ad we could buy. Email it over and we'll
            send you a discount code for the next one.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=My%20Layerworks%20install`}
            className="display mt-5 inline-block rounded-md border-2 border-border bg-primary px-6 py-3 text-primary-fg transition-colors hover:bg-foreground"
          >
            {CONTACT_EMAIL}
          </a>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#/"
            className="display rounded-md border-2 border-border bg-card px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Back to the shop
          </a>
          <a
            href="#/policies"
            className="display rounded-md border-2 border-border bg-card px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Shipping &amp; returns
          </a>
        </motion.div>
      </section>
    </>
  );
}
