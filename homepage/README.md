# Homepage

This folder documents the custom Milk & Rose home page work so it is easy to find later.

Shopify requires theme files to live in root theme folders, so the live files are:

- `sections/homepage.liquid` - the home page section and Shopify customizer settings.
- `assets/homepage.css` - layout, placeholder 3D orbit, menu, and video styling.
- `assets/homepage.js` - drag, rotate, expand, and mobile menu behavior.
- `templates/index.json` - wires the home page template to the `homepage` section.
- `assets/cinelin-tokens.css` - neutral placeholder color and font tokens.

## What to swap later

- Replace each placeholder model block with the real product in the theme customizer.
- Set each block's product or fallback link so clicking a model opens that product.
- Add the process video URL and poster image in the section settings.
- Replace the three `Featured piece` placeholder blocks with real Shopify products.
- When real 3D product files are ready, this section can be upgraded from CSS placeholders to Shopify product model media or a lazy-loaded model viewer.

## Notes

- No new library was added.
- Motion pauses or stays static for `prefers-reduced-motion`.
- The live Dawn header is hidden only on the index template because this home page has its own Figma-style compact header.
