# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-file static marketing site for **aicoffeechat**, a fictional "Real-Time Conversational AI Observability" product. Everything lives in `index.html` at the repo root (~800 lines). The `dashboard/` subdirectory is currently empty.

## Running / previewing

There is no build step, no package manifest, no test suite, and no linter. Tailwind and Iconify are loaded from CDNs at runtime, so editing is just edit-and-refresh:

- Open `index.html` directly in a browser, or
- Serve the directory with any static server, e.g. `python -m http.server` and visit `http://localhost:8000`.

Because Tailwind comes from `cdn.tailwindcss.com` (the JIT browser build), there is no `tailwind.config.js` — all customization is done inline via Tailwind's arbitrary-value syntax (e.g. `bg-[#09090F]`, `shadow-[0_0_20px_rgba(99,102,241,0.3)]`).

## Architecture

The page is a vertical stack of self-contained sections, each delimited by an HTML comment header. In document order:

`Navigation` → `Hero` → `Logo Strip` → `Features Bento` → `Platform` (dashboard mockup) → `Metrics Strip` → `Pricing` → `Testimonials` → `CTA` → `Footer`

To find a section quickly, search for its comment marker (e.g. `<!-- Pricing Section -->`).

### Visual system — keep changes consistent with these conventions

- **Color tokens (used as Tailwind arbitrary values, not config):**
  - Background: `#09090F` (near-black). Text: `#F8F7FF`.
  - Accents: `indigo-500`/`violet-400`/`violet-600` gradients; muted text uses `text-white/50`, `text-white/60`, `text-white/40`.
  - Borders: `border-white/[0.08]` to `border-white/10`. Surfaces: `bg-white/[0.01]`–`bg-white/[0.08]` with `backdrop-blur-*`.
- **Decorative pattern repeated across sections:** large blurred radial gradients (`bg-indigo-500/10 rounded-full blur-[100px]`) layered behind content inside an `absolute inset-0 z-0` container, with the content in `relative z-10`. Reuse this when adding new sections rather than inventing a new background treatment.
- **Global noise texture:** an inline-SVG `feTurbulence` div is fixed at the top of `<body>` with `opacity-[0.04]`. Don't duplicate it per-section.
- **Glow effects:** buttons and badges use long `shadow-[0_0_Npx_rgba(99,102,241,...)]` strings — match this style instead of using Tailwind's preset shadows.
- **Icons:** all icons come from Iconify via `<iconify-icon icon="solar:...-linear">`. Stick with the `solar:` family and `-linear` variant for consistency.
- **Animation:** the only custom keyframe is a `pulse` defined inline inside the hero badge (line ~63). If you add motion, prefer Tailwind's built-in transitions over new keyframes.

### Things that look like they need a build but don't

- No PostCSS / Tailwind CLI — do not add a `tailwind.config.js` or try to compile classes; the CDN script handles JIT in-browser.
- No JS bundler — there is no application JavaScript beyond the two CDN `<script>` tags in `<head>`. If interactivity is added, plain `<script>` tags are the established pattern.
