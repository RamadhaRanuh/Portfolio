---
title: Mobile, accessibility and performance budget
type: grilling
status: closed
blocked-by: []
assignee: Rama Ranuh
---

## Question

Now that the hero (attention heatmap), visual language (variant B) and stack (static, no build) are decided: how does the site behave on phones (nav, two-column flagship cards, heatmap on touch: tap-to-query or static fallback), what accessibility bar does it meet (contrast of the blue and orange accents on their surfaces, keyboard and screen-reader treatment of the heatmap tokens, reduced motion, focus states), and what performance budget applies (page weight, fonts, image formats/sizes for the flagship screenshots, no layout shift)?

## Resolution

Target WCAG 2.2 AA, a phone-first stacked layout, and a small static payload.

- **Contrast (measured)**: blue `#1d4ed8` on the light page 6.4:1 (card 5.9); orange `#fb923c` on the dark page 8.4:1 (card 7.7); muted text 5.5:1 (5.1 on the dark card); primary button 6.7 (white on blue) / 8.3 (dark on orange); body text on the darkest heatmap tint 7.1 (light) / 5.2 (dark). All pass AA, so the palette stands.
- **Heatmap on touch**: tap a word to make it the query; tap it again or elsewhere to clear. The idle walk runs until the first tap. Tokens are not links; tapping must not scroll or select text.
- **Heatmap accessibility**: the hero is a normal `<h1>` that reads as one sentence; token spans carry no roles; the "query ... attends to ..." hint is `aria-hidden`. Under `prefers-reduced-motion` there is no idle walk, and the tint appears only on demand (hover or tap).
- **Accessibility bar**: WCAG 2.2 AA. Visible 2px accent focus rings, theme toggle as a real `<button>` with `aria-pressed`, skip-to-content link, semantic landmarks with headings, alt text on the headshot and screenshots. Not chasing AAA.
- **Mobile (below about 720px)**: flagship cards stack (text, stat grid, screenshot); nav is a short row of four anchor links plus the theme toggle, no hamburger and no JS; More work becomes stacked lines; hero headshot sits above the text at 72px; no horizontal scroll.
- **Performance budget**: under about 500 KB first-load transfer excluding fonts; flagship screenshots as WebP (or optimised PNG) at 1200px wide or less, around 100 KB each, lazy-loaded below the fold with `width`/`height` set; headshot a 192px WebP under 30 KB; CSS under about 15 KB, JS under about 5 KB; Lighthouse 95+ in all four categories on mobile.
- **Fonts**: self-hosted Latin WOFF2 subsets (Inter Tight 600, Inter 400/500, JetBrains Mono 400) with `font-display: swap` and a preload for the hero font. This replaces "Google Fonts or self-hosted, decided at build" in the stack ticket.
