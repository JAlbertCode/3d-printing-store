import { useState } from "react";
import { motion } from "framer-motion";
import { ORDER_EMAIL } from "../lib/config";
import { reveal, stagger } from "../lib/motion";

const process = [
  { n: "01", t: "Describe it", d: "Tell us what you need and what it's for. A photo and rough measurements help." },
  { n: "02", t: "Approve the model", d: "You get a spinnable 3D preview of your piece before anything is made. Your price is locked at this step." },
  { n: "03", t: "We make it", d: "Made in-house in your choice of colors, test-fitted, and shipped to your door." },
];

export default function Commissions() {
  const [idea, setIdea] = useState("");
  const mailto = () => {
    const subject = encodeURIComponent("Custom print request");
    const body = encodeURIComponent(
      `What I need:\n${idea || "(describe the object)"}\n\nRough size / measurements:\n\nDeadline (if any):\n`
    );
    return `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="custom" className="border-t-2 border-border px-[5vw] py-16">
      <p className="mb-3 font-mono text-xs font-semibold text-accent">{"CUSTOM ORDERS"}</p>
      <h2 className="display mb-4 text-3xl">Need something that doesn't exist yet?</h2>
      <p className="max-w-[52ch] text-muted-fg">
        Stands, mounts, displays, replacement parts, one-of-a-kind gifts.
        Custom pieces start at <span className="font-semibold text-foreground">$35</span>,
        design included, and you'll have a quote within 24 hours.
      </p>
      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-8 grid gap-6 md:grid-cols-3"
      >
        {process.map((s) => (
          <motion.li key={s.n} variants={reveal} className="hardcard rounded-md p-5">
            <span className="font-mono text-xs font-semibold text-primary">{s.n}</span>
            <h3 className="display mt-2 text-xl">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-fg">{s.d}</p>
          </motion.li>
        ))}
      </motion.ol>
      <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="idea">Describe what you need printed</label>
        <input
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. a wall mount for my headset that clips to a shelf edge"
          className="hardcard flex-1 rounded-md px-4 py-3 text-sm placeholder:text-muted-fg focus:outline-none"
        />
        <motion.a
          whileTap={{ scale: 0.98 }}
          href={mailto()}
          className="display rounded-md border-2 border-border bg-foreground px-6 py-3 text-center text-background transition-colors hover:bg-primary hover:text-primary-fg"
        >
          Start a request
        </motion.a>
      </div>
    </section>
  );
}
