# Jaded Rose — Shopify Theme

Custom Shopify Online Store 2.0 theme for [Jaded Rose](https://jadedrose.co.uk/), a London occasion- and party-wear brand. Porcelain minimalism: hairline rules, micro-caps labels, editorial serif headlines, image-led product cards.

## Structure

```
assets/        # base.css (design system) · global.js (nav, AJAX cart, variant picker)
config/        # settings_schema.json · settings_data.json
layout/        # theme.liquid (+ gift_card renders standalone)
locales/       # en.default.json
sections/      # header, footer, hero, product/collection/cart/search pages, homepage bands
snippets/      # product-card, price, address-fields
templates/     # JSON templates + customer account pages

public/        # legacy static concept site (Cloudflare) — ignored by Shopify
wrangler.jsonc # Cloudflare config for the legacy demo
```

## Connect to Shopify (GitHub integration)

1. In Shopify admin go to **Online Store → Themes → Add theme → Connect from GitHub**.
2. Install/authorise the **Shopify GitHub app** for `OttomanLabsAI/jaded-rose-web` when prompted.
3. Pick branch **`main`**.

Every push to `main` then updates the connected theme automatically. Publish it (or preview via **Customize**) from the theme library.

### After connecting — 5-minute setup in the theme editor

- **Brand**: upload the logo (Theme settings → Brand) and set colours if desired.
- **Menus**: the header uses the `main-menu` navigation and the footer uses `footer` (Content → Menus).
- **Homepage**: assign a collection to each Collection-rail block, pick the Featured-collection source, and upload hero/editorial imagery.
- **Contact page**: assign the `page.contact` template to your contact page.

## Feature notes

- **Colour variants**: a product option named `Colour`/`Color` renders as swatch dots — on product cards (up to 6 dots + count) and as selectable swatches on the product page. Other options (e.g. Size) render as chips. Common colour names (black, ivory, burgundy, baby blue, olive…) map to real dot colours in `assets/base.css`.
- **Cart**: AJAX add-to-bag with toast + live bag count; cart page with quantity steppers, notes and order-level discounts.
- **All data is live from Shopify**: products, collections, prices, search, blog, accounts, gift cards.

## Local development

```sh
npm i -g @shopify/cli
shopify theme dev --store your-store.myshopify.com
```

`shopify theme check` runs the linter used in CI-style validation.

## Legacy static demo

`public/` holds the original static concept previously deployed to Cloudflare (`npx wrangler deploy`). Shopify ignores it; remove it whenever the Cloudflare deployment is retired.
