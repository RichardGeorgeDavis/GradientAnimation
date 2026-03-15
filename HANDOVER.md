# Handover

## Summary
- This repo is a static WebGL gradient demo with three standalone HTML entry points.
- All three pages now share the same top navigation and debug/admin controls.
- There is no build process; files are edited and served directly.

## Files In Current State
- `index.html`: demo variant 1
- `index-2.html`: demo variant 2
- `index-3.html`: demo variant 3
- `Gradient.js`: renderer, animation loop, uniforms, and runtime control API
- `controls.js`: shared navigation and debug/admin control panel
- `controls.css`: overlay styles
- `README.md`: usage and feature overview
- `AGENTS.md`: maintenance instructions
- `HANDOVER.md`: current-state handoff

## What Changed Recently
- Added a shared on-page debug/admin overlay to all three demo pages.
- Added top navigation between `index.html`, `index-2.html`, and `index-3.html`.
- Added live controls for:
  - amplitude
  - wireframe
  - global noise frequency X/Y
  - global noise speed
  - vertex noise frequency X/Y
  - vertex noise speed
  - vertex noise flow
  - shadow power
  - darken-top toggle
  - all four colors
- Added play/pause, reset, and panel collapse controls.
- Extended `Gradient.js` with explicit runtime setters plus `getState()` and `applyState()`.
- Fixed runtime mesh wireframe syncing so the overlay can toggle it directly.
- Added repo-local documentation:
  - `README.md`
  - `AGENTS.md`
  - `HANDOVER.md`

## Source Of Truth
- HTML entry pages define the page shell and page-specific CSS color presets.
- `Gradient.js` is the source of truth for renderer behavior and uniform updates.
- `controls.js` is the source of truth for the admin overlay and cross-page navigation.
- `controls.css` is the source of truth for overlay presentation.

## Runtime Notes
- `controls.js` waits until the gradient instance has initialized its mesh and uniforms before mounting controls.
- Reset restores the initial runtime state captured after the page is ready.
- The overlay does not persist state between reloads.
- `?debug=webgl` still enables console-only debug logging in addition to the on-page controls.

## Verification Performed
- `node --check Gradient.js`
- `node --check controls.js`

## Known Gaps
- I did not run an interactive browser pass from this environment.
- The page `<title>` values do not currently align cleanly with the file names:
  - `index-2.html` title is `Stripe Gradient 3`
  - `index-3.html` title is `Stripe Gradient 2`
- There is no persistence or export/import for control panel state.

## Practical Next Steps
1. Open all three HTML pages in a browser and confirm overlay layout, mobile behavior, and control responsiveness.
2. Normalize page titles if the file-name mismatch matters for presentation.
3. Add state persistence only if the user wants presets or sharable configurations.
