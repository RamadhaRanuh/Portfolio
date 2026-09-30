# Portfolio redesign: design spec

Compiled from the eleven closed tickets on the [map](map.md). Each section links the ticket that holds the detail. Where this file and a ticket disagree, the ticket wins.

## 1. Positioning and copy

Source: [Positioning and hero copy](tickets/03-positioning-and-hero-copy-now-that-you-are-at-gdp-.md)

- AI Engineer only. No "Data Scientist / Software Engineer", no typing animation, no job-seeking language.
- Hero line: "I'm Rama Ranuh, an AI Engineer."
- Subline: one sentence of scope. No availability line, no employer.
- About: two or three plain first-person sentences, folded into the hero. Education lives in the timeline only.
- Primary CTA: email (`mailto:`). Secondary: CV link, GitHub, LinkedIn.
- Headshot (`images/image_1.JPEG`) in the hero, small.

## 2. Information architecture

Source: [Information architecture and flagship depth](tickets/04-information-architecture-and-flagship-depth.md)

One page, one column, proof first:

1. **Hero** (identity, scope, About, CTA, headshot)
2. **Flagship projects** (four cards)
3. **Experience** (compact timeline)
4. **More work** (one line per item)
5. **Contact**

- Nav: minimal sticky top bar, four anchor links plus the theme toggle.
- Flagships are cards only: no detail pages, no in-page expand. Each links out to its repo.
- Card contents: image, title, one-line problem/approach/result, 1-2 hard results (or a qualitative line), stack tags, repo link. The paper card carries a venue credit line.
- Flagship order: Local Notebook, skin-disease paper (ICCSCI), Medical RAG chatbot, From-Scratch.
- Missing numbers are not invented: the RAG chatbot and From-Scratch get qualitative lines.

## 3. Hero signature element

Source: [Hero signature element options](tickets/05-hero-signature-element-options.md). Prototype: `prototypes/hero-signature.PROTOTYPE.html` (variant A).

- Attention heatmap: the hero sentence is word tokens. Hover a word and the others tint by how strongly it "attends" to it; a small hint line names the top two. Idle, a query walks the sentence. Weights are hand-picked, not from a model.
- The sentence must read fine with no effect. The effect stays on the hero line only.

## 4. Visual language

Source: [Visual language](tickets/06-visual-language-type-color-light-dark.md). Prototype: `prototypes/visual-language.PROTOTYPE.html` (variant B).

- **Type**: Inter Tight 600 (headings, tight tracking), Inter 400/500 (body), JetBrains Mono 400 (nav, `// section` labels, stat numbers, dates).
- **Layout**: single column, about 980px measure.
- **Flagship card**: bordered, soft-tinted box; two columns (text and mono stat grid left, image right); stacks below about 720px.
- **More work**: mono table (name, one clause, arrow).
- **Colour**:

  | Token | Light | Dark |
  |---|---|---|
  | background | `#fafaf7` | `#111110` |
  | text | `#16161a` | `#ecebe6` |
  | muted | `#65656e` | `#8d8a82` |
  | rule | `#e2e2dc` | `#2b2a27` |
  | soft (cards) | `#f0f0ea` | `#1a1a18` |
  | accent | `#1d4ed8` (blue) | `#fb923c` (orange) |

  The heat tint uses the accent. The primary button is filled accent (white text on blue, dark text on orange).
- **Theme**: light/dark toggle, default from `prefers-color-scheme`.
- **Motion**: only the hero heatmap moves. Everything else is static apart from colour transitions and hover states.

## 5. Experience section and CV

Source: [Resume section and CV handling](tickets/08-resume-section-and-cv-handling.md)

- Newest first, mono dates on the left, one-line title plus one-line highlight on the right.
- Entries: AI Engineer at GDP Labs (full-time); AI Engineer Intern at GDP Labs (Feb 2025 - Feb 2026) with the SGLang/vLLM figures (1.8x throughput, up to 70% faster latency); ISRITI paper (Dec 2025, IEEE); ICCSCI paper (Aug 2024, Procedia Computer Science); BINUS University (Computer Science, Sep 2022 - Mar 2026, GPA 3.94).
- One "Also:" line for the CYCU exchange, Dicoding bootcamp and the two finalist results. Tutor and freshman-partner roles are dropped.
- CV: linked from `CV2024/CV_I_Gusti_Bagus_Ramadha_Saverian_Ranuh.pdf`. The owner overrode the ticket at build time: the `CV2024/` folder stays in the repo as it is.

## 6. Private work

Source: [Thesis and private-repo write-ups](tickets/09-thesis-and-private-repo-write-ups.md)

- Private work appears only as "code private" lines in More work. No code links, no extra section.
- SGLang/vLLM: one generic line, no GDP-specific detail. The numbers stay on the timeline.
- `game-engine`: left out.
- Thesis: a More work line only if it is distinct from the two papers.

## 7. Stack and repository

Source: [Stack and repository structure](tickets/07-stack-and-repository-structure.md)

- Plain static HTML, one CSS file, vanilla JS. No build step, no framework. Content written directly in `index.html`.
- Files: `index.html`, `assets/style.css`, `assets/hero.js`, a tiny theme script inlined in `<head>`, `assets/img/` (used images only), `assets/fonts/`. The CV stays in `CV2024/`.
- Delete the legacy template: `css/`, `js/`, `scss/`, `fonts/`, `images/` (unused), `prepros-6.config`, `readme.txt`, `main.html`, `portfolio.html`, `portfolio/`. No redirects. `CV2024/` is kept (owner decision at build time).
- Deploy: GitHub Pages from the `master` branch root. Relative asset paths (base path is `/Portfolio`).
- Cutover: build on a `redesign` branch, check locally, merge to `master`.
- After the build: move `.wayfinder/` to a `planning` branch; add `.claude/` to `.gitignore`.

## 8. Mobile, accessibility, performance

Source: [Mobile, accessibility and performance budget](tickets/10-mobile-accessibility-and-performance-budget.md)

- **Standard**: WCAG 2.2 AA. All palette pairs measured at 5.1:1 or better.
- **Accessibility**: 2px accent focus rings; theme toggle is a `<button>` with `aria-pressed`; skip link; semantic landmarks; alt text. The hero is a plain `<h1>`; the hint line is `aria-hidden`.
- **Touch**: tap a word to query, tap again or elsewhere to clear. The idle walk runs until the first tap.
- **Reduced motion**: no idle walk; tint only on hover or tap.
- **Mobile (below about 720px)**: cards stack (text, stats, image); nav is a row of four links plus the toggle, no hamburger; More work becomes stacked lines; headshot above the text at 72px; no horizontal scroll.
- **Budget**: under about 500 KB first load excluding fonts; screenshots as WebP at 1200px or less, about 100 KB each, lazy-loaded with `width`/`height`; headshot a 192px WebP under 30 KB; CSS under 15 KB, JS under 5 KB; Lighthouse 95+ on mobile.
- **Fonts**: self-hosted Latin WOFF2 subsets, `font-display: swap`, hero font preloaded.

## 9. SEO and sharing

Source: [SEO and social-share metadata](tickets/11-seo-and-social-share-metadata.md)

- Title: "Rama Ranuh - AI Engineer". Description about 155 characters, no employer.
- Canonical: `https://ramadharanuh.github.io/Portfolio/`. `sitemap.xml` with the single URL.
- Open Graph and Twitter `summary_large_image` tags with absolute image URLs.
- Share image: designed 1200x630 PNG at `assets/og.png`, light palette, under about 100 KB.
- Favicon: "R" monogram SVG in the accent colour, 32px PNG fallback.
- JSON-LD `Person`: name, job title, URL, `sameAs`, image. No employer, phone or address.

## 10. Evidence per flagship

Source: [Collect evidence for the four flagship projects](tickets/02-collect-evidence-for-the-four-flagship-projects.md), `research/flagship-evidence.md`

| Flagship | Hard results | Image |
|---|---|---|
| Local Notebook (repo `Deepnote`) | 0.95 correctness, 0.94 citation recall, 4.95 s p50, on an 8 GB laptop GPU (37-item hand-checked set) | `chat-citation.png` from the repo |
| Skin-disease classification (ICCSCI 2024) | YOLO 97.56% test accuracy; five models compared | Redrawn chart of the results table |
| Medical RAG chatbot | None. Corpus: 5 volumes of the Gale Encyclopedia of Medicine | None in the repo; original diagram |
| From-Scratch | None. Transformer (EN to ID, opus-100) and Llama 2-style decoder | None usable; original diagram |

## 11. Open items for the owner

- Full-time start date at GDP Labs, and a one-line highlight for that role.
- The linked CV still says "AI Engineer Intern" and carries the phone number; update it when convenient.
- Thesis title, topic and one-line result, and whether it is the ISRITI work.
- Confirmation that GDP is fine with the generic SGLang/vLLM line and the 1.8x / 70% figures.
- Results or a screenshot for the RAG chatbot; a loss curve or sample translations for From-Scratch.
- Local Notebook repo rename (the card links `Deepnote` until then).
- The 97.56% YOLO figure looks like it came from a different test-set size than the other four models; confirm before comparing them side by side.

## Out of scope

Custom domain, a blog section, and aligning the GitHub profile README.
