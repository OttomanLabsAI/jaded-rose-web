# Jaded Rose — Shopify Theme

The live jadedrose.co.uk theme (Showcase 5.4.1 by Clean Canvas, exported from the store) with one addition: a colour-selection system so shoppers can switch between colours of the same dress.

Connected to Shopify via the GitHub integration — every push to `main` updates the theme in the store's theme library.

## Colour selection

Two mechanisms, both active:

### 1. Variant swatches (built into Showcase, now enabled)

For products that carry their colours as a variant option named **Colour**, the theme shows colour swatches on product cards and the product page. Configure under **Theme settings → Swatches** (e.g. change the option name, or use product images as swatches).

### 2. Colour siblings (added — for colours sold as separate products)

Most Jaded Rose colours are separate products (e.g. the Jade dress in White, Black, Olive). To link them, create two product metafields once in **Settings → Custom data → Products**:

| Name | Namespace and key | Type |
|---|---|---|
| Colour options | `custom.colour_options` | Product — list of products |
| Colour name | `custom.colour_name` | Single line text |

Then on each product, set **Colour options** to the other colour versions and **Colour name** to its own colour (e.g. "Burgundy"). The product page shows a "Colour:" row of image thumbnails under the price — the current colour ringed, the others linking to their product pages. Products without the metafield are completely unaffected.

Implementation: `snippets/jr-colour-options.liquid`, rendered from `sections/main-product.liquid` after the price block. Those are the only theme files touched.

## Development

```sh
npm i -g @shopify/cli
shopify theme dev --store your-store.myshopify.com   # live preview
shopify theme check                                   # linter
```

## Legacy

`public/` and `wrangler.jsonc` are an earlier static concept site (Cloudflare-hosted); Shopify ignores them. Remove when the Cloudflare deployment is retired.
