# Milk & Rose About Page Shopify AI Handoff

Use this when asking Shopify AI to apply the approved About page design to theme ID `163992568029`.

## Scope

Only edit the About page.

Remove all existing content/sections currently on the About page first, then replace the About page with this approved Milk & Rose About design only.

Do not edit Home, Collection, Product, Product Listing, Product Detail, Cart, Contact, header, footer, navigation, or global site structure.

Do not publish the theme.

## Instruction For Shopify AI

```text
Only edit the About page.

First remove every existing section, block, and content area currently assigned to the About page/template. Then replace the page with the approved About implementation from the local files listed below.

Use the existing local Milk & Rose About page design exactly. Do not create a new design and do not apply the design to any other page.

The approved About design is already implemented in these local files:
- assets/cinelin-tokens.css
- assets/milk-rose-about.css
- assets/cinelin-pages.js
- sections/cinelin-about.liquid
- templates/page.about.json

Apply that design to the Shopify About page/template only.

The final About page should contain only this approved About design. Do not keep any old About sections above, below, or between the new sections.

Design direction:
- Premium editorial handmade jewelry brand
- White is the dominant page color
- Main accent token is Milk & Rose blush: #F2CAB9
- Clean editorial grid
- Bold uppercase headings
- Soft gray body copy
- Light divider lines only where useful
- No unnecessary rounded cards or heavy boxes
- Preserve the existing global header and footer
- No oversized or clipped logo
- No horizontal overflow
- Responsive at desktop and mobile, especially around 390px wide

Hero / Brand Story:
- Left side content, right side large image/visual area
- Label: Brand story
- Main heading:
  Fine silver jewelry with a softer way of doing business.
- Body:
  Milk & Rose makes jewelry that feels as good as it looks: romantic, wearable, responsibly made, and priced so quality does not feel out of reach.
- Details must be three clean single-line rows:
  SERVICES — Handmade sterling silver / Essentials / Custom moments
  STUDIO — Slow fabrication / Soft polish / Made with care
  MATERIALS — Fine metals / Up-cycled silver / FSC-certified packaging

Maker section:
- Keep the editorial media/copy layout
- Use editable media/video/image settings
- If no media is set, show the existing soft visual placeholder

Our Difference:
- Left-aligned heading and body copy
- Body copy sits directly under the heading
- Three equal columns below with light dividers:
  Beauty over the bottom line
  Community over conversion
  Buying better, not more

Our Process:
- Heading: Four steps, one careful piece.
- Four steps:
  01 Hand sketching
  02 3D modeling
  03 Mold and casting
  04 Assembling and polishing
- Keep the small jewelry/3D-style sample visuals above each process item

Brand pillars:
- Four items:
  01 Woman-owned
  02 Fair trade
  03 Fair wages
  04 Handcrafted
- Keep the small jewelry/3D-style sample visuals above each pillar item

Interactions:
- Keep the existing subtle scroll reveal behavior
- Respect prefers-reduced-motion
- Use vanilla JavaScript only

Shopify customizer:
- Keep content editable through section settings
- Headings, body copy, media, alt text, CTA, and contact copy/settings should remain editable

Do not redesign. Match the current local custom About implementation exactly.
```

## Local Files To Transfer

Use these files from the local project:

```text
assets/cinelin-tokens.css
assets/milk-rose-about.css
assets/cinelin-pages.js
sections/cinelin-about.liquid
templates/page.about.json
```

If Shopify AI cannot read the local project directly, paste or upload those files into the corresponding Shopify theme files.

## Validation Already Run Locally

```text
about schema and template ok
js parse ok
```

## Known Limitation

Shopify CLI could not be used from this machine because the local Ruby version is too old for the current Shopify CLI gem, and no Node/npm/Homebrew CLI path is available. Because of that, remote theme list/push/preview generation must be done in Shopify Admin or from a machine with Shopify CLI installed.
