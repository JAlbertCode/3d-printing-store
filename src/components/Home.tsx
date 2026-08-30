import { useEffect } from "react";
import { motion } from "framer-motion";
import { products } from "../lib/products";
import ModelStage from "./ModelStage";
import Commissions from "./Commissions";
import Faq from "./Faq";
import { reveal, stagger } from "../lib/motion";

export default function Home() {
  const featured = products.find((p) => p.status === "available" && p.model)!;
  useEffect(() => {
    if (window.location.hash.replace("#", "") === "custom")
      document.getElementById("custom")?.scrollIntoView();
  }, []);
  return (
    <>
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid items-center gap-10 px-[5vw] pb-16 pt-12 lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.4fr)]"
      >
        <motion.div variants={reveal}>
          <p className="mb-3 font-mono text-xs font-semibold text-accent">
            {"SMALL-BATCH 3D PRINT SHOP"}
          </p>
          <h1 className="display text-[clamp(2.8rem,6vw,5rem)]">
            3D printed,
            <br />
            made to order.
          </h1>
          <p className="mt-5 max-w-[40ch] text-muted-fg">
            A small-batch 3D printing shop. Spin our current piece around in
            3D before you buy, or send us an idea and we'll design and print
            it just for you.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <motion.a
              whileTap={{ scale: 0.98 }}
              href={`#/p/${featured.slug}`}
              className="display rounded-md border-2 border-border bg-primary px-6 py-3 text-primary-fg transition-colors hover:bg-foreground"
            >
              {`See the ${featured.name} · ${featured.price}`}
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.98 }}
              href="#custom"
              className="display rounded-md border-2 border-border bg-card px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
            >
              Custom order
            </motion.a>
          </div>
          <ul className="mt-8 grid max-w-md gap-2 text-sm text-muted-fg">
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              Made to order, not mass produced
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              What you see in the 3D preview is what ships
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              On its way to you in 3 to 5 business days
            </li>
          </ul>
        </motion.div>
        <motion.div variants={reveal}>
          <ModelStage
            src={featured.model!.src}
            alt={featured.model!.alt}
            animation={featured.model!.animation}
            callouts={featured.model!.callouts}
            colorways={featured.model!.colorways}
          />
        </motion.div>
      </motion.section>

      <Commissions />

      <Faq />
    </>
  );
}
