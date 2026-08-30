# Layerworks Print Co. — storefront

React + Vite + Tailwind + Framer Motion storefront for a small-batch 3D print
shop: stock products with interactive GLB previews, plus a commissions intake.
Deployed to GitHub Pages by Actions. Product pages embed the real
Blender-exported model in `<model-viewer>`: buyers rotate/zoom it and watch the
mechanism animation. Built per the production-design-polish skill: semantic
design tokens, loading/error states, reduced-motion support, mobile-first,
ARIA on all controls.

## Structure

```
index.html                    entry + fonts
src/App.tsx                   header/footer + hash-route switch
src/hooks/useHashRoute.ts     #/p/<slug> routing, no dependency
src/components/Home.tsx       hero, catalog grid, commissions
src/components/ProductPage.tsx  viewer + buy card + steps/specs per product
src/components/ProductCard.tsx  catalog tile (available / coming-soon)
src/components/ModelStage.tsx   3D viewer, skeleton, error state, controls
src/components/BuyCard.tsx      price, includes, checkout button
src/components/Commissions.tsx  custom-order process + request CTA
src/lib/products.ts           THE product catalog — add products here
src/lib/config.ts             ORDER_EMAIL, shipping note
src/lib/motion.ts             animation tokens
src/index.css                 Tailwind v4 theme tokens
public/models/*.glb           Blender exports, Scene animation baked in
.github/workflows/deploy.yml  build + Pages deploy on push to main
```

## Run locally

```
npm install
npm run dev
```

## Deploy

1. Push to `main`.
2. Repo → Settings → Pages → Source: **GitHub Actions** (one-time).
3. The workflow builds and publishes automatically.

## Adding a product

1. Export a GLB from Blender (Animation mode: **Scene**, selected objects,
   +Y up — see the 3d-print-modeling skill) into `public/models/`. Keep it
   under ~10 MB.
2. Add one object to the array in `src/lib/products.ts`: slug, name, series
   code, price, copy, `model` (src/alt/animation), `includes`, optional
   `steps`/`specs`, `buyUrl`, and a `tint` for its catalog tile.
3. That's it — the catalog grid and `#/p/<slug>` page generate themselves.
   Products without a model or with `status: "coming-soon"` render as
   non-clickable "IN SLICER" tiles.

## Checkout & orders

- Per-product checkout: set `buyUrl` in `src/lib/products.ts` (Stripe Payment
  Link, Ko-fi, marketplace listing). Until set, the button shows a
  "coming soon" notice.
- Commissions: set `ORDER_EMAIL` in `src/lib/config.ts`; the request button
  composes a structured email. Swap for a form backend later if volume grows.
