---
title: Hero signature element options
type: prototype
status: closed
blocked-by: [01-survey-ai-engineer-portfolio-conventions-and-exemp.md, 03-positioning-and-hero-copy-now-that-you-are-at-gdp-.md]
assignee: Rama Ranuh
---

## Question

Prototype 2-3 rough hero treatments (for example an attention heatmap, a token-stream text effect, typographic motion only) that give the 'that's a cool portfolio' reaction without turning into a cliche neural-net background. The owner picks one. Should respect the chosen positioning and hero copy.

## Resolution

Owner picked **Variant A, the attention heatmap**, over the token stream (B) and typographic-motion-only (C).

- **What it is**: the hero sentence is split into word tokens. Hovering a word tints the other words by how strongly it "attends" to it, with a small hint line naming the top two. When idle, a query walks the sentence on its own. Weights are hand-picked, not from a real model.
- **Constraints to carry into the build**: the static sentence must read fine without the effect; honour `prefers-reduced-motion` (no idle autoplay); the effect stays confined to the hero line so the rest of the page keeps near-zero motion; touch devices need a tap-to-query or a static fallback (not yet decided, belongs with the mobile/accessibility fog).
- **Type/colour**: the prototype used a serif display face and an orange heat colour (owner asked to try blue; prototype now blue) as placeholders only; those are decided in the visual-language ticket.
- **Asset**: `.wayfinder/prototypes/hero-signature.PROTOTYPE.html` (variants A/B/C). Not yet committed to a throwaway branch; the working-tree file is the source until it is.
