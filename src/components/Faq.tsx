import { motion } from "framer-motion";
import { reveal, stagger } from "../lib/motion";
import { LEAD_TIME, RETURN_WINDOW } from "../lib/config";

const faqs = [
  {
    q: "How sturdy is this stuff?",
    a: "Every piece is assembled and tested before it ships. These are solid, rigid plastic objects, not flimsy trinkets. Treat them like anything else on your shelf and they'll outlast the shelf.",
  },
  {
    q: "When will my order arrive?",
    a: `Each piece is made when you order it, then shipped within ${LEAD_TIME}. You'll get tracking as soon as it's on the way.`,
  },
  {
    q: "Can I get different colors?",
    a: "Yes, and it's free. Pick the top and the base separately at checkout from every color we keep in stock. Spin the 3D preview to see the combination before you buy.",
  },
  {
    q: "What is it made of?",
    a: "Rigid printed plastic, built up in fine layers. Colors come in either a matte or a gloss finish, noted on each swatch. We pick the right stock for the job so you only have to pick a color.",
  },
  {
    q: "What does shipping cost?",
    a: "Nothing. Shipping is already in the price for anywhere in the US, so the number on the product page is the number you pay, plus whatever sales tax your state adds at checkout.",
  },
  {
    q: "What if it arrives damaged?",
    a: "Email us a photo and we'll print you a new one, free, no need to send the broken one back.",
  },
  {
    q: "Can I return it?",
    a: `Stock pieces, yes, within ${RETURN_WINDOW} if they come back unused. Custom commissions are made for one person so they can't be returned, though the damage policy still covers them.`,
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
      <motion.a
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        href="#/policies"
        className="mt-8 inline-block font-mono text-xs font-semibold hover:text-primary"
      >
        Full shipping &amp; returns detail →
      </motion.a>
    </section>
  );
}
