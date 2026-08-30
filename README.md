# Layerworks Print Co. storefront

Live at https://jalbertcode.github.io/3d-printing-store/

React + Vite + Tailwind + Framer Motion storefront for a small-batch 3D print
shop: a featured product with an interactive GLB preview, plus a commissions
intake. Deployed to GitHub Pages by Actions. Product pages embed the real
Blender-exported model in `<model-viewer>`: buyers rotate and zoom it, watch
the mechanism animation, and read dimension callouts anchored to the model.
Built per the production-design-polish skill: semantic design tokens,
loading/error states, reduced-motion support, mobile-first, ARIA on controls.

## Structure

```
index.html                    entry, fonts, meta/OG tags, favicon
src/App.tsx                   header/footer + hash-route switch
src/hooks/useHashRoute.ts     #/p/<slug> routing, no dependency
src/components/Home.tsx       hero with the featured model, commissions, FAQ
src/components/ProductPage.tsx  viewer + buy card + steps/specs per product
src/components/ProductCard.tsx  catalog tile (kept for when the catalog grows)
src/components/ModelStage.tsx   3D viewer, dimension lines, skeleton, controls
src/components/BuyCard.tsx      price, includes, checkout button
src/components/Commissions.tsx  custom-order process + request CTA
src/lib/products.ts           THE product catalog, add products here
src/lib/config.ts             ORDER_EMAIL, shipping note, brand name
src/lib/motion.ts             animation tokens
src/index.css                 Tailwind v4 theme tokens
public/models/*.glb           Blender exports, single "Scene" clip baked in
capsule_slab.blend            source of truth for the model and animation
print/*.stl                   printer-ready exports of each half
.github/workflows/deploy.yml  build + Pages deploy on push to main
```

## Run locally

```
npm install
npm run dev
```

## Deploy

1. Push to `main`.
2. Repo, Settings, Pages, Source: **GitHub Actions** (one-time).
3. The workflow builds and publishes automatically.

## Exporting a model from Blender

The web viewer plays exactly one animation clip, so every animated object
must land in the same clip:

1. Stash each object's action into an NLA track named `Scene` (all objects
   share that track name).
2. Export glTF Binary with animation mode **NLA Tracks**, force sampling on,
   optimize animation size off, selected objects only.
3. Drop the .glb in `public/models/` (keep it under ~10 MB) and bump the
   `?v=` query on that product's `model.src` in `src/lib/products.ts` so
   browsers fetch the new file.

The .blend in the repo is the master. GLB and STL files are build artifacts
exported from it.

## Adding a product

1. Export a GLB as above.
2. Add one object to the array in `src/lib/products.ts`: slug, name, series
   code, price, copy, `model` (src, alt, animation, callouts), `includes`,
   optional `steps`/`specs`, `buyUrl`, and a `tint` for its catalog tile.
   Dimension callouts take `from`/`to`/`labelAt` points in viewer space;
   plain notes take a single `position`.
3. The `#/p/<slug>` page generates itself. When a second product is ready,
   restore the collection grid on Home with `ProductCard`.

## Checkout & orders

- Per-product checkout: set `buyUrl` in `src/lib/products.ts` (Stripe Payment
  Link, Ko-fi, marketplace listing). Until set, the button shows a
  "coming soon" notice.
- Commissions: set `ORDER_EMAIL` in `src/lib/config.ts`; the request button
  composes a structured email. Swap for a form backend later if volume grows.
