import { motion } from "framer-motion";
import type { Product } from "../lib/products";
import ModelStage from "./ModelStage";
import BuyCard from "./BuyCard";
import { reveal, stagger } from "../lib/motion";

export default function ProductPage({ p }: { p: Product }) {
  return (
    <>
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid items-start gap-8 px-[5vw] pb-16 pt-10 lg:grid-cols-[minmax(230px,.9fr)_minmax(0,1.6fr)_minmax(250px,.8fr)]"
      >
        <motion.div variants={reveal}>
          <a href="#/" className="font-mono text-xs font-semibold hover:text-primary">
            ← All products
          </a>
          <p className="mb-3 mt-6 font-mono text-xs font-semibold text-accent">
            {p.series}
          </p>
          <h1 className="display text-[clamp(2.6rem,5.5vw,4.6rem)]">{p.name}</h1>
          <p className="mt-5 max-w-[34ch] text-muted-fg">{p.blurb}</p>
        </motion.div>
        <motion.div variants={reveal}>
          {p.model ? (
            <ModelStage src={p.model.src} alt={p.model.alt} animation={p.model.animation} callouts={p.model.callouts} colorways={p.model.colorways} />
          ) : (
            <div className="hardcard grid h-72 place-items-center font-mono text-sm text-muted-fg">
              model preview coming soon
            </div>
          )}
        </motion.div>
        <motion.div variants={reveal} className="max-w-md">
          <BuyCard p={p} />
        </motion.div>
      </motion.section>

      {p.steps && (
        <section className="border-t-2 border-border px-[5vw] py-16">
          <h2 className="display mb-8 text-3xl">How it opens</h2>
          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {p.steps.map((s) => (
              <motion.li key={s.n} variants={reveal} className="hardcard rounded-md p-5">
                <span className="font-mono text-xs font-semibold text-primary">{s.n}</span>
                <h3 className="display mt-2 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-fg">{s.d}</p>
              </motion.li>
            ))}
          </motion.ol>
        </section>
      )}

      {p.specs && (
        <section className="border-t-2 border-border px-[5vw] py-16">
          <h2 className="display mb-8 text-3xl">Spec sheet</h2>
          <motion.table
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-3xl border-collapse font-mono text-sm"
          >
            <tbody>
              {p.specs.map(([k, v]) => (
                <tr key={k}>
                  <td className="w-40 border border-hairline bg-background px-3.5 py-3 font-semibold">{k}</td>
                  <td className="border border-hairline bg-card px-3.5 py-3">{v}</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </section>
      )}
    </>
  );
}
