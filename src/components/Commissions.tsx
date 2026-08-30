import { useState } from "react";
import { motion } from "framer-motion";
import { REQUEST_FORM_ACTION, ENTRY } from "../lib/config";
import { reveal, stagger } from "../lib/motion";

const process = [
  { n: "01", t: "Describe it", d: "Tell us what you need and what it's for. A photo and rough measurements help." },
  { n: "02", t: "Approve the model", d: "You get a spinnable 3D preview of your piece before anything is made. Your price is locked at this step." },
  { n: "03", t: "We make it", d: "Made in-house in your choice of colors, test-fitted, and shipped to your door." },
];

const label = "font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-fg";
const field =
  "w-full rounded-md border-2 border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted-fg focus:outline-none";

export default function Commissions() {
  const [sent, setSent] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [y, m, d] = deadline ? deadline.split("-") : ["", "", ""];

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

      {sent ? (
        <div className="hardcard mt-8 max-w-3xl rounded-md p-6">
          <p className="display text-xl">Request received.</p>
          <p className="mt-2 text-sm text-muted-fg">
            You'll hear from us within 24 hours with a 3D preview and a locked price.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            fetch(REQUEST_FORM_ACTION, { method: "POST", mode: "no-cors", body: data });
            setSent(true);
          }}
          className="hardcard mt-8 max-w-3xl rounded-md p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="rq-name">Your name *</label>
              <input id="rq-name" name={`entry.${ENTRY.name}`} required className={`${field} mt-1`} />
            </div>
            <div>
              <label className={label} htmlFor="rq-email">Email *</label>
              <input id="rq-email" name="emailAddress" type="email" required className={`${field} mt-1`} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="rq-desc">What do you need? Describe the object and what it's for. *</label>
              <textarea
                id="rq-desc"
                name={`entry.${ENTRY.description}`}
                required
                rows={3}
                placeholder="e.g. a wall mount for my headset that clips to a shelf edge"
                className={`${field} mt-1 resize-y`}
              />
            </div>
            <div>
              <label className={label} htmlFor="rq-size">Rough size or key measurements</label>
              <input id="rq-size" name={`entry.${ENTRY.size}`} className={`${field} mt-1`} />
            </div>
            <div>
              <label className={label} htmlFor="rq-colors">Color preferences</label>
              <input id="rq-colors" name={`entry.${ENTRY.colors}`} className={`${field} mt-1`} />
            </div>
            <div>
              <label className={label} htmlFor="rq-where">Where will it live?</label>
              <select id="rq-where" name={`entry.${ENTRY.where}`} defaultValue="" className={`${field} mt-1`}>
                <option value="" disabled>Choose one</option>
                <option>Shelf or desk</option>
                <option>Wall mounted</option>
                <option>Outdoors</option>
                <option>Worn or handled daily</option>
                <option>Somewhere else</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="rq-budget">Budget range *</label>
              <select id="rq-budget" name={`entry.${ENTRY.budget}`} required defaultValue="" className={`${field} mt-1`}>
                <option value="" disabled>Choose one</option>
                <option>Under $35</option>
                <option>$35 to $75</option>
                <option>$75 to $150</option>
                <option>Over $150</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="rq-qty">How many do you need?</label>
              <input id="rq-qty" name={`entry.${ENTRY.quantity}`} inputMode="numeric" className={`${field} mt-1`} />
            </div>
            <div>
              <label className={label} htmlFor="rq-deadline">Deadline, if any</label>
              <input
                id="rq-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`${field} mt-1`}
              />
              {deadline && (
                <>
                  <input type="hidden" name={`entry.${ENTRY.deadline}_year`} value={y} />
                  <input type="hidden" name={`entry.${ENTRY.deadline}_month`} value={String(Number(m))} />
                  <input type="hidden" name={`entry.${ENTRY.deadline}_day`} value={String(Number(d))} />
                </>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="rq-links">Reference links (similar products, photos hosted anywhere)</label>
              <input id="rq-links" name={`entry.${ENTRY.links}`} className={`${field} mt-1`} />
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="display mt-5 rounded-md border-2 border-border bg-foreground px-6 py-3 text-background transition-colors hover:bg-primary hover:text-primary-fg"
          >
            Start a request
          </motion.button>
        </form>
      )}
    </section>
  );
}
