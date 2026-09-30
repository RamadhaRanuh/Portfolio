---
title: Portfolio redesign: AI Engineer portfolio (map)
---

## Destination

A **design spec** for the refactored portfolio, ready to hand to an implementation session: information architecture, content plan for the flagship projects, visual language, signature hero element, and stack/repo structure. Planning only; the build itself is a separate effort after this map clears.

Deployment stays on GitHub Pages (`ramadharanuh.github.io/Portfolio`).

## Notes

- **Owner**: Rama Ranuh, AI Engineer, now full-time at GDP Labs. The site no longer says "seeking job opportunities"; position as AI Engineer only (drop "Data Scientist / Software Engineer" and the typing animation).
- **Audience**: recruiters and hiring managers first, plus friends. Goal: skim-friendly, no bloat, but the reaction should be "that's a cool portfolio". Simple is not the same as plain; it must feel elegant.
- **Style**: minimal/editorial by default, with a light/dark toggle. Avoid generic particle or neural-net backgrounds.
- **Stack lean**: static, no build step preferred (drop Bootstrap 4, jQuery and the Colorlib template plugins); Astro only if it earns its keep.
- **Flagship projects (4)**: Local Notebook (repo `Deepnote`, needs renaming), Medical RAG chatbot (`Natural-Language-Processing-Chatbot`), From-Scratch (Transformer in PyTorch), Hyperpigmented skin disease classification (ICCSCI paper). Everything else goes in a compact "More work" list with GitHub links. Old coursework and the Tableau/Canva analyses are dropped or reduced to a line.
- **Private repos** (`thesis`, `SGLang-Local-Inference-Server`, `VLLM-Local-Inference-Server`, `game-engine`) can't be linked: show as write-ups with no code link, if at all.
- **Photo**: `images/image_1.JPEG` is the real headshot; other `person_*.jpg` are template stock.
- **Resume**: compact highlights timeline plus a link to the single current CV PDF.
- **Evidence**: each flagship needs one image or GIF and one or two hard results.
- This repo is public, so everything on this map is public too.

## Decisions so far

<!-- one line per closed ticket -->
- [SEO and social-share metadata](tickets/11-seo-and-social-share-metadata.md): Title "Rama Ranuh - AI Engineer", designed 1200x630 share image, OG/Twitter tags with absolute URLs, canonical + sitemap, R-monogram SVG favicon, Person JSON-LD without employer.
- [Mobile, accessibility and performance budget](tickets/10-mobile-accessibility-and-performance-budget.md): WCAG 2.2 AA (palette contrast verified), tap-to-query heatmap on touch, stacked mobile layout with no hamburger, ~500 KB budget with WebP images, self-hosted font subsets.
- [Thesis and private-repo write-ups](tickets/09-thesis-and-private-repo-write-ups.md): Private work shown only as "code private" lines in More work; generic SGLang/vLLM line with no GDP detail; game-engine dropped; thesis line pending its title/topic from the owner.
- [Resume section and CV handling](tickets/08-resume-section-and-cv-handling.md): Compact newest-first timeline with mono dates: two GDP Labs entries (full-time and intern), BINUS, ISRITI and ICCSCI venue lines, the rest in one "Also" line; single public assets/cv.pdf without the phone number; start date and current CV file are owner follow-ups.
- [Stack and repository structure](tickets/07-stack-and-repository-structure.md): Plain static HTML/CSS/vanilla JS, content in index.html, assets/ folder, delete the whole legacy template, single assets/cv.pdf, serve from master root with relative paths, build on a redesign branch then merge.
- [Visual language: type, color, light/dark](tickets/06-visual-language-type-color-light-dark.md): Variant B: Inter Tight + Inter + JetBrains Mono labels, boxed two-column flagship cards with mono stat grid; blue accent in light, orange in dark; motion only in the hero heatmap.
- [Hero signature element options](tickets/05-hero-signature-element-options.md): Attention heatmap chosen (hover a word, others tint by attention; idle query walks the sentence); static fallback and reduced-motion required; prototype at .wayfinder/prototypes/hero-signature.PROTOTYPE.html.
- [Information architecture and flagship depth](tickets/04-information-architecture-and-flagship-depth.md): One column: Hero, Flagships (card only, links to repo), Experience, More work, Contact; sticky minimal nav; order Local Notebook, skin-disease paper, RAG chatbot, From-Scratch; qualitative lines where numbers are missing.
- [Positioning and hero copy now that you are at GDP Labs](tickets/03-positioning-and-hero-copy-now-that-you-are-at-gdp-.md): Plain "AI Engineer" identity line plus one scope sentence; GDP Labs named only in the resume; email is the primary CTA; small headshot in hero; 2-3 sentence About; drop Data Scientist/typing animation.
- [Collect evidence for the four flagship projects](tickets/02-collect-evidence-for-the-four-flagship-projects.md): Local Notebook and the skin-disease paper have hard numbers; the RAG chatbot has none and From-Scratch has no metric, only Local Notebook has screenshots; paper DOI, chatbot/From-Scratch results, GIFs and image licences must come from the owner (.wayfinder/research/flagship-evidence.md).
- [Survey AI engineer portfolio conventions and exemplars](tickets/01-survey-ai-engineer-portfolio-conventions-and-exemp.md): Strong sites are static, single-column and sentence-led with a real photo, per-project evidence and near-zero motion; recruiters skim 30-90s and favour 3-5 polished projects.

## Not yet specified

<!-- clear: every in-scope patch has graduated into a ticket and been resolved -->

## Out of scope

- **Custom domain** (backlog): deployment stays on GitHub Pages for now. Revisit as a fresh effort later.
- **Blog / writing section**: adds bloat; can be added once the site is stable.
- **GitHub profile README alignment**: outside the site itself, so beyond this destination (a design spec for the portfolio site). Revisit as a separate task after the build.
