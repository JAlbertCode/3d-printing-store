import { useHashRoute } from "./hooks/useHashRoute";
import { bySlug } from "./lib/products";
import { BRAND_A, BRAND_B, BRAND_FULL } from "./lib/config";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";

export default function App() {
  const route = useHashRoute();
  const product = route.page === "product" ? bySlug(route.slug) : undefined;

  return (
    <>
      <header className="flex items-center justify-between border-b-2 border-border px-[5vw] py-4">
        <a href="#/" className="font-display text-xl font-black tracking-wide">
          {BRAND_A}<span className="text-primary">{BRAND_B}</span>
        </a>
        <nav className="flex gap-4 text-xs font-semibold uppercase tracking-widest sm:gap-6">
          <a className="hover:text-primary" href="#/">Shop</a>
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

      <main>{product ? <ProductPage p={product} /> : <Home />}</main>

      <footer className="flex flex-wrap justify-between gap-3 border-t-2 border-border px-[5vw] py-6 text-xs">
        <p className="font-mono">{BRAND_FULL + " · Designed, made, and shipped from one workshop."}</p>
        <p className="max-w-[60ch] text-muted-fg">
          Independent maker shop. Not affiliated with, sponsored, or endorsed by
          any trading-card or video-game company.
        </p>
      </footer>
    </>
  );
}
