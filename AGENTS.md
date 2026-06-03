# AGENTS.md - Milk N Rose Shopify Theme

## Project
Milk N Rose is a high-end handmade jewelry Shopify theme, based on Dawn. The site has three signature experiences:
1. The Entry - a dark, full-screen "TV wall" splash page with email capture
2. The Home - collections as visual stories plus creative between-collection navigation
3. The Product Page - anchored by an interactive, rotatable 3D rendering

Guiding principle: "Complex to build. Simple to use. Impossible to forget."

## Tech
- Shopify Online Store 2.0 theme using Liquid, JSON templates, and sections.
- Vanilla JS for interactions. GSAP is allowed for scroll or animation. If you add any library, document why in the PR description.
- No build step beyond what Dawn ships with. No React, no headless.

## Structure
- `sections/` - page building blocks. Custom features live here as sections.
- `snippets/` - reusable partials.
- `assets/` - JS, CSS, images. Custom feature JS/CSS lives here.
- `templates/` - JSON templates wiring sections together.
- `layout/theme.liquid` - global shell.

## Conventions
- Mobile-first. Write base styles for mobile, enhance with min-width queries.
- Never hardcode colors or fonts outside `assets/cinelin-tokens.css`. Crystal owns the brand system and will deliver the official palette and typefaces later. Define all colors and fonts as CSS custom properties in that one file, using neutral placeholder values.
- Respect `prefers-reduced-motion`. Every animation needs a reduced or no-motion fallback. The Entry splash must have a static, no-sound fallback.
- Performance: lazy-load heavy assets such as 3D and video. Target under 3s load on 4G.
- Accessibility: keyboard navigable, sufficient contrast, alt text, focus states.
- Section settings: expose tunable values such as grid size, timing, and copy in Shopify section settings so non-devs can adjust in the theme customizer.

## Ground Rules
- Dev theme only. Nothing targets the live or published theme.
- Document plugin, library, and animation choices. The "why" matters as much as the "what".
- Use placeholder content where real assets are not ready. The goal is to lock layout, look, function, and vibe first.

## Commands
- Lint/validate theme: `shopify theme check`
- Local preview: `shopify theme dev`
- Run `shopify theme check` before opening any PR and report results.

## Do Not
- Do not commit secrets, API tokens, or `.env` files.
- Do not finalize fonts or brand colors until Crystal delivers the official system.
- Do not add heavy dependencies without documenting the rationale.
