---
title: SEO and social-share metadata
type: grilling
status: closed
blocked-by: []
assignee: Rama Ranuh
---

## Question

What does the single page declare for search and sharing: `<title>`, meta description, canonical URL under `ramadharanuh.github.io/Portfolio`, Open Graph / Twitter card fields, the share image (a designed card or the headshot), favicon, and structured data (Person schema) if any? Consider the decided positioning (plain "AI Engineer" identity, employer named only in the resume) and static hosting on GitHub Pages.

## Resolution

One page, one canonical URL, plain "AI Engineer" positioning with no employer in the metadata.

- **Title**: "Rama Ranuh - AI Engineer".
- **Description** (about 155 chars, wording finalised at build): AI Engineer building and evaluating local LLM applications, naming the flagship projects (Local Notebook, medical RAG, transformer from scratch, skin-disease classification).
- **Share image**: a designed 1200x630 static PNG (name, "AI Engineer", heatmap look, light palette), under about 100 KB, at `assets/og.png`. Not the headshot, not a product screenshot.
- **Social tags**: `og:title`, `og:description`, `og:type=website`, `og:url`, `og:image` (with width, height, alt) and `twitter:card=summary_large_image` with matching title, description and image. Image URLs are absolute (`https://ramadharanuh.github.io/Portfolio/assets/og.png`); this is the one exception to the relative-paths rule in the stack ticket.
- **Canonical/indexing**: `<link rel="canonical" href="https://ramadharanuh.github.io/Portfolio/">`, indexing allowed, a `sitemap.xml` with the single URL. A `robots.txt` under a project page path is not read by crawlers (only the domain root counts), so it cannot hide `.wayfinder/`; the real fix is moving `.wayfinder/` to the `planning` branch after the build (see the stack ticket).
- **Favicon**: an "R" monogram in the accent colour, as an SVG with a 32px PNG fallback, replacing the template icon.
- **Structured data**: a small JSON-LD `Person` block (name, job title "AI Engineer", URL, `sameAs` GitHub and LinkedIn, image). No employer, phone or address.
