import { motion } from "framer-motion";
import { reveal, stagger } from "../lib/motion";

const faqs = [
  {
    q: "How sturdy is this stuff?",
    a: "Every piece is assembled and tested before it ships. These are solid, rigid plastic objects, not flimsy trinkets. Treat them like anything else on your shelf and they'll outlast the shelf.",
  },
  {
    q: "When will my order arrive?",
    a: "Each piece is made when you order it, then shipped within 3 to 5 business days. You'll get tracking as soon as it's on the way.",
  },
  {
    q: "Can I get different colors?",
    a: "Stock products ship in the colors shown. Want a different combo? Mention it when you order. Most color swaps are free.",
  },
  {
    q: "What if it arrives damaged?",
    a: "Email us a photo and we'll make you a new one. Simple as that.",
  },
];

export default function Faq() {
  return (
    <section className="border-t-2 border-border px-[5vw] py-16">
      <p className="mb-3 font-mono text-xs font-semibold text-accent">{"GOOD TO KNOW"}</p>
      <h2 className="display mb-8 text-3xl">Questions people ask</h2>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {faqs.map((f) => (
          <motion.div key={f.q} variants={reveal} className="hardcard rounded-md p-5">
            <h3 className="display text-lg">{f.q}</h3>
            <p className="mt-2 text-sm text-muted-fg">{f.a}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
