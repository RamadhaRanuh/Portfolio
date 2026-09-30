# AI engineer portfolio conventions and exemplars

Research for issue #2. Planning only. Retrieved 2026-09-30.

Method note: each exemplar's homepage was fetched and summarised by a fast model, so layout descriptions are first-hand but coarse. Motion, colour and exact typefaces are only stated where the fetch reported them; verify visually before copying anything. The recruiter statistics at the end come from secondary blog posts, not primary studies, and are flagged as such.

## Exemplars (12)

| # | Site | Observed | Borrow | Avoid |
|---|------|----------|--------|-------|
| 1 | [brittanychiang.com](https://brittanychiang.com) | Single column, anchor nav (About, Experience, Projects, Writing), Inter, restrained motion, project cards with image, stack tags and links | Experience-then-projects order; stack tags on cards; one playful touch in the footer | Frontend-specific polish that adds weight |
| 2 | [karpathy.ai](https://karpathy.ai) | Hand-written HTML/CSS, "0 frameworks", one-line headline, chronological sections with logos, project thumbnails linking to GitHub | Proof that zero-framework static works at the top of the field; plain one-line identity statement; thumbnail plus repo link | Reads as a document, not a designed piece; no light/dark |
| 3 | [rauno.me](https://rauno.me) | Manifesto tagline, minimal nav, projects behind navigation rather than on the home page | Confident tagline as hero; extreme restraint | Hiding projects one click away hurts a 60-second skim |
| 4 | [leerob.com](https://leerob.com) | Text-only sections divided by rules, dated lists | Rules and whitespace as the only ornament; fast to skim | Too plain for the "cool" goal on its own |
| 5 | [thesephist.com](https://thesephist.com) | Header nav (posts, projects, stream, RSS), short bio prose, projects referenced thematically | Personal voice; short bio paragraph with research focus | Projects described in prose only, no evidence per project |
| 6 | [sebastianraschka.com](https://sebastianraschka.com) | Dark mode toggle, credibility line ("LLM Research Engineer"), featured resources, articles with thumbnails | Role plus proof in the first screen; light/dark toggle in the header; featured item at top | Many nav items; a content hub, not a portfolio |
| 7 | [lilianweng.github.io](https://lilianweng.github.io) | Hugo + PaperMod theme, text listing with date and reading time | Legible, fast static baseline; consistent metadata | Nothing about the person or projects on the first screen |
| 8 | [joshwcomeau.com](https://joshwcomeau.com) | Light/dark toggle, generous whitespace, portrait, conversational tone | Personality via copy and a real photo rather than effects; theme toggle done well | Heavy interactive/animation stack is out of scope for a no-build static site |
| 9 | [colah.github.io](https://colah.github.io) | Research areas grouped by topic, cover thumbnails, venue subtitles ("On Distill") | Grouping by theme; venue/paper credit line, relevant to the ICCSCI paper | Blog-first structure |
| 10 | [maggieappleton.com](https://maggieappleton.com) | Hero states role and employer in one sentence, static card layout with thumbnails | Humble, specific hero line; image-led cards | Digital-garden IA (blog is out of scope for the map) |
| 11 | [paco.me](https://www.paco.me) | Single page: header, building, writing, now, connect; almost no motion | One page, few blocks; short micro-headline | Almost no visual evidence of work |
| 12 | [eugeneyan.com](https://eugeneyan.com) | Start Here, Writing, Speaking, Prototyping, About; dated text entries, counts of posts/talks/prototypes | "Start Here" entry point; counts as quick credibility signal | Archive-length text lists |

## Patterns that recur across the strong ones

- One column, one typeface family (often Inter or a system stack), hierarchy through size and weight, not colour.
- Hero is a sentence, not an animation: identity plus role plus one concrete claim. Personality comes from copy and a real photo.
- Motion is absent or tiny (hover, theme fade, one footer flourish). None of the 12 rely on particle or neural-net backgrounds.
- Work is shown as a short list of cards or rows: name, one line, tags, links. Image thumbnails appear on the more designed sites (Chiang, Karpathy, Colah, Appleton).
- Theme toggle is common on the editorial ones (Raschka, Comeau).
- Static HTML/CSS is legitimate at the very top (Karpathy states no frameworks; Weng shows a static generator is also fine).
- Credibility markers: employer, paper venue, book/course, counts, real repo links.

## What "cool but not bloated" suggests (inference, not sourced)

The distinctive element in these sites is rarely visual effect; it is a confident typographic hero, a real photo, evidence thumbnails per project, and one small crafted detail. A single signature hero element (owned by the hero ticket) should be small, static-friendly, and respect prefers-reduced-motion.

## Recruiter expectations (secondary sources, treat as directional)

- Skim time is roughly 30 to 90 seconds; the first screen must state who you are, your role and one proof point. ([SOLTECH](https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/), [hakia](https://www.hakia.com/skills/building-portfolio/))
- 3 to 5 polished projects beat many basic ones; matches 4 flagships plus a "More work" list. The specific percentages quoted by those posts (e.g. a Stack Overflow 73% figure) were not verified against primary surveys and should not be reused.
- Each project should say the problem, the decision made, and a result; working demo or clear visuals preferred over bare code.
- Conventional contents: name and role, short bio, photo, projects, experience, GitHub/LinkedIn links, contact, current CV link.

## Implications for the map

- Supports the current lean: static, no build, editorial single column, light/dark toggle.
- Hero: sentence-led, with the real headshot.
- Flagship cards: image or GIF, one or two hard numbers, stack tags, links; private-repo work as write-ups without a code link.
- Skip: particles, typing animation, heavy scroll effects, blog/garden IA.
