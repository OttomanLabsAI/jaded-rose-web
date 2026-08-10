# Jaded Rose — Web

Redesign concept site for [Jaded Rose](https://jadedrose.co.uk/), a London occasion- and party-wear brand. A single-page, dependency-free static site (inline CSS/JS, no build step) hosted on Cloudflare.

## Structure

```
public/
  index.html   # the site — self-contained (styles, catalogue data and JS inline)
  404.html     # branded not-found page
  _headers     # security headers served by Cloudflare
wrangler.jsonc # Cloudflare Workers static-assets config
```

Product imagery and all outbound links point at the live store (`jadedrose.co.uk` / Shopify CDN); the cart, search and quick-view interactions are an in-memory demo.

## Deploy

### Cloudflare Workers (CLI)

```sh
npx wrangler deploy
```

The `wrangler.jsonc` config serves `public/` as static assets — no build step required.

### Cloudflare Pages (dashboard)

Connect this repository in the Cloudflare dashboard with:

- **Build command:** none
- **Build output directory:** `public`

## Local preview

```sh
npx wrangler dev
```

or any static file server, e.g. `python3 -m http.server --directory public`.
