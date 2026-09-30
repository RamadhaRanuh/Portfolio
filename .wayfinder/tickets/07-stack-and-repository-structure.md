---
title: Stack and repository structure
type: grilling
status: closed
blocked-by: [04-information-architecture-and-flagship-depth.md]
assignee: Rama Ranuh
---

## Question

Static HTML/CSS/vanilla JS with no build step, or Astro? How is content stored (data files, Markdown), how are legacy files (Bootstrap, jQuery, the Colorlib template, unused images, `portfolio/`, `portfolio.html`, `main.html`) handled, and how does it deploy on GitHub Pages under the `/Portfolio` base path?

## Resolution

Plain static site: HTML, one CSS file, vanilla JS, no build step, no Astro.

- **Content**: written directly in `index.html` (four flagships, about ten "More work" lines). No data files, no Markdown rendering.
- **Layout**: `index.html` at the repo root; `assets/style.css` (CSS variables for both themes); `assets/hero.js` (attention heatmap); a tiny theme script inlined in `<head>` to avoid a flash; `assets/img/` holds only images actually used. No Bootstrap, jQuery or template plugins. Fonts: Inter Tight, Inter, JetBrains Mono (Google Fonts or self-hosted subsets, decided at build).
- **Legacy**: delete `css/`, `js/`, `scss/`, `fonts/`, `prepros-6.config`, `readme.txt`, `main.html`, `portfolio.html`, the empty `portfolio/` folder and unused images. Git history keeps them. No redirects for the removed pages.
- **CV**: the single linked PDF lives at `assets/cv.pdf` (stable name). All other CV variants, the `.doc` files and Word temp files (`~$...`, `~WRL...`) are deleted. Which file becomes `cv.pdf` is decided in the resume ticket.
- **Deploy**: keep serving from the `master` branch root on GitHub Pages; no workflow. Use relative asset paths so the `/Portfolio` base path never breaks. Live URL and `index.html` entry stay the same.
- **Planning files**: keep `.wayfinder/` on `master` until the build finishes, then move it to a `planning` branch. Drop `.claude/` from the repo and add it to `.gitignore`.
- **Cutover**: build on a `redesign` branch, check locally with a static server, merge to `master` only when it looks right.
