import { useHashRoute } from "./hooks/useHashRoute";
import { bySlug } from "./lib/products";
import { BRAND_A, BRAND_B, BRAND_FULL, CONTACT_EMAIL } from "./lib/config";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import ThankYou from "./components/ThankYou";
import Policies from "./components/Policies";

export default function App() {
  const route = useHashRoute();
  const product = route.page === "product" ? bySlug(route.slug) : undefined;

  const body = product ? (
    <ProductPage p={product} />
  ) : route.page === "thank-you" ? (
    <ThankYou />
  ) : route.page === "policies" ? (
    <Policies />
  ) : (
    <Home />
  );

  return (
    <>
      <header className="flex items-center justify-between border-b-2 border-border px-[5vw] py-4">
        <a href="#/" className="font-display text-xl font-black tracking-wide">
          {BRAND_A}<span className="text-primary">{BRAND_B}</span>
        </a>
        <nav className="flex gap-4 text-xs font-semibold uppercase tracking-widest sm:gap-6">
          <a
            className="hover:text-primary"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "#/";
              setTimeout(
                () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }),
                60
              );
            }}
          >
            Shop
          </a>
          <a
            className="hover:text-primary"
            href="#custom"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "#/";
              setTimeout(
                () => document.getElementById("custom")?.scrollIntoView({ behavior: "smooth" }),
                60
              );
            }}
          >
            Custom orders
          </a>
        </nav>
      </header>

      <main>{body}</main>

      <footer className="border-t-2 border-border px-[5vw] py-6 text-xs">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <p className="font-mono">
            {BRAND_FULL + " · Designed, made, and shipped from one workshop."}
          </p>
          <nav className="flex flex-wrap gap-4 font-semibold uppercase tracking-widest">
            <a className="hover:text-primary" href="#/policies">
              Shipping &amp; returns
            </a>
            <a className="hover:text-primary" href={`mailto:${CONTACT_EMAIL}`}>
              Contact
            </a>
          </nav>
        </div>
        <p className="mt-3 max-w-[60ch] text-muted-fg">
          Independent maker shop. Not affiliated with, sponsored, or endorsed by
          any trading-card or video-game company.
        </p>
      </footer>
    </>
  );
}
