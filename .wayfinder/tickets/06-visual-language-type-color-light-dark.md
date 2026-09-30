---
title: Visual language: type, color, light/dark
type: prototype
status: closed
blocked-by: [01-survey-ai-engineer-portfolio-conventions-and-exemp.md]
assignee: Rama Ranuh
---

## Question

Prototype the base visual language on one representative section (a flagship card plus the hero): type pairing, color palette and accent, spacing, light/dark toggle, and motion rules. Editorial by default, with light and dark variants. The owner picks the direction.

## Resolution

Owner picked **Variant B: crisp sans with mono labels, boxed two-column flagship cards**, over the warm serif editorial (A) and the narrow reading page (C).

- **Type**: Inter Tight (600, tight tracking) for headings, Inter for body, JetBrains Mono for nav, section labels and stat numbers. Section labels use the `// name` mono style.
- **Layout**: single column, wider measure (about 980px). Hero, then flagship cards, then a mono "More work" table (name, one clause, arrow).
- **Flagship card**: bordered soft-tinted box, two columns (text and stat grid left, screenshot right; stacks below ~720px). The stat grid shows 3-4 numbers in mono in the accent colour.
- **Colour**: neutral warm-white / near-black surfaces with soft tint for cards and 1px rules. Accent is **blue `#1d4ed8` in light mode and orange `#fb923c` in dark mode**; the hero heat tint uses the same accent. Primary CTA is a filled accent button (dark text on the orange in dark mode).
- **Theme**: light/dark toggle, default from `prefers-color-scheme`, smooth 0.3s colour transition.
- **Motion rules**: motion lives only in the hero heatmap (idle query walk, hover). Everything else is static apart from colour transitions and hover states; `prefers-reduced-motion` disables the idle walk.
- **Not decided here**: exact spacing scale, contrast checks for both accents on their surfaces, and touch behaviour, which go to implementation and the mobile/accessibility fog.
- **Asset**: `.wayfinder/prototypes/visual-language.PROTOTYPE.html` (variants A/B/C). Not yet committed to a throwaway branch.
