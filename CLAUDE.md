# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static GitHub Pages site ("notdrones-pages") for NOT Drones Innovations Pvt Ltd internal distribution. No build system, no framework, no tests — plain HTML/CSS/JS deployed from the `main` branch root. `.nojekyll` disables Jekyll processing.

## Commands

```powershell
# Local preview (from repo root)
python -m http.server 8000
```

There is no build, lint, or test step. Deployment is a push to `main` (GitHub Pages, deploy-from-branch, root).

## Pages

- `index.html` — Downloads hub: simulator, compiled-binaries folder, drone firmware, remote firmware. Links point to OneDrive share URLs (electrobotic-my.sharepoint.com) and to `firmware/*.bin` files that must be dropped in manually before deploy (see `firmware/README.md`).
- `tutorials.html` — Assembly/flight tutorials with rendered manual images from `assets/manual/` and the PDF at `assets/manual-diy.pdf`.
- `internal/roadmap/index.html` — **Hidden internal page.** Unlinked from navigation; reachable only by typing `/internal/roadmap/` directly (deep links: `?view=gantt|fishbone|slides`, `&sku=<id>`, `&expand=1`). Excluded from search via `<meta name="robots" content="noindex, nofollow">` and a `Disallow: /internal/` rule in `robots.txt`. Self-contained product roadmap + localization tracker with three views of one dataset: Gantt (SKU schedule May 2026 → Apr 2027 plus subsystem localization lanes), interactive fishbone (expandable spec tree per SKU), and slides (one presentation slide per SKU). Color language: red = imported/Chinese factory (LG, LW, Yongyu, BJ, RJ, MJ, KY, Paaji), green = NDIPL in-house, amber = unknown spec. **All content lives in the `TL`/`FACTORIES`/`DATA`/`LANES` objects in the `<script>` at the bottom of that file**; edit only those — the engine below renders all three views. Visual tokens come from `/DESIGN.md` (Vercel-inspired; see its "Project adaptations" log before changing colors/type). Keep this page unlinked and noindexed. Note: the repo is public — the page is hidden, not access-controlled, so treat its content (factory sourcing, defence SKU) accordingly.

## Architecture notes

- **QR codes**: `js/qr.js` injects a QR canvas into every `<a class="qr">`, encoding the anchor's *resolved* `href` at page load — so QR links work both on localhost and on Pages with no code changes. Adding a download link = add an `<a class="qr" href="...">` plus a matching `.btn` anchor; the QR generates automatically.
- **Theming**: site-wide look is controlled by CSS variables at the top of `css/style.css` (Poppins font, light theme, cyan accent). The hidden roadmap page has its own inline styles and does not use `css/style.css`.
- **Firmware binaries**: `firmware/` expects `notdrones-drone-firmware.bin` and `notdrones-remote-firmware.bin`, built from the org repos `Claude-Betaflight-reference-esp32` and `ESP32-RC-Controller` (`.pio/build/<env>/firmware.bin`, renamed on copy). `index.html` links these exact filenames.
- OneDrive share URLs in `index.html` appear twice each (QR anchor + button anchor) — update both when rotating links.
