# AGENTS.md

## Project
- Static demo repo for a Stripe-style WebGL gradient animation.
- The project consists of three standalone HTML demo pages plus shared JavaScript and CSS.
- There is no framework, bundler, or build pipeline in this directory.

## Scope
- `index.html`
- `index-2.html`
- `index-3.html`
- `Gradient.js`
- `controls.js`
- `controls.css`
- `README.md`
- `HANDOVER.md`
- `AGENTS.md`

## Source Of Truth
- Edit the HTML files directly for page bootstrapping, demo wiring, and page-specific color presets.
- Edit `Gradient.js` directly for renderer behavior and runtime control methods.
- Edit `controls.js` directly for the shared debug/admin UI and page navigation.
- Edit `controls.css` directly for overlay layout and styling.

## Editing Rules
- Treat this as a static multi-page demo, not a SPA.
- Keep the three demo pages self-contained and directly openable in a browser.
- Reuse the shared `controls.js` and `controls.css` files instead of duplicating UI markup per page.
- When adding new runtime controls, expose them through stable methods on `Gradient` rather than mutating deep uniforms from page scripts.
- Preserve the existing full-screen canvas behavior unless the task explicitly changes layout.
- Keep control panel changes responsive; the demos should remain usable on desktop and mobile widths.
- Do not introduce a build step or package-management dependency unless the user explicitly asks for one.

## Documentation Rules
- Update `README.md` when the public usage or controls change.
- Update `HANDOVER.md` when renderer behavior, shared controls, file structure, or operational assumptions change.
- Keep `AGENTS.md` focused on maintenance rules, not a duplicate of the full handover.

## Verification
- Run `node --check Gradient.js` after editing JavaScript in that file.
- Run `node --check controls.js` after editing JavaScript in that file.
- Manually verify the affected HTML pages in a browser when UI behavior changes.

## Current Notes
- `?debug=webgl` enables console-side debug logging from `Gradient.js`.
- The on-page debug/admin panel is mounted by `controls.js` on all three demo pages.
- The HTML page titles are currently inconsistent with the file names:
  - `index-2.html` uses `Stripe Gradient 3`
  - `index-3.html` uses `Stripe Gradient 2`
