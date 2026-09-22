# Implementation Plan: Portfolio Content Restructure

## Overview

Surgery on a single file (`index.html`, ~1,700 lines) plus the `<style id="aq-declone">` block. Four regions change: the horizontal track shrinks to two about-me panels, the OTOT section goes, the helmet grid becomes a "Latest Work" project list with hover previews, and the featured project card becomes a Research section behind the existing visor.

**design.md was intentionally skipped at the user's request.** `requirements.md` is the authoritative spec — read the referenced criteria before each task.

Working constraints that apply to every task:

- The body markup is minified onto very long lines (line ~1405 onward). Use string-matching edits with enough surrounding context to be unambiguous. Never rewrite a whole body line.
- All CSS goes in `<style id="aq-declone">`. `css/lando-offbrand.shared.*.css` and `js/lando.gold-v3.js` are read-only.
- Colours: only the 9 Palette tokens, written `var(--token, #hex)`. Fonts: only Mona Sans, Fraunces, JetBrains Mono.
- The page must stay loadable after every task.
- The **user** runs `npm run dev` (sirv, port 5179). No task may assume the agent can start a dev server. Where a task needs visual or console checking, use the executing agent's browser-preview capability if it has one; otherwise hand off to the user with exact instructions on what to look at and what to paste back.

## Tasks

- [x] 1. Snapshot `index.html` before any edits
  - Copy `index.html` to `index.html.bak` in the workspace root (`.gitignore` already ignores `*.bak`)
  - This is a local backup only — no commit, no stage
  - _Requirements: 12.4_

- [x] 2. Strip the horizontal track to two about-me panels
  - [x] 2.1 Remove every non-callout item from `.horizontal-track`
    - Delete all ten `.horizontal-item-w` image items, the `.horizontal-item-pill-w`, all `.text-eyebrow` elements, both `.horizontal-rive-placeholder` signature images, and any now-orphaned `.horizontal-grid-col` / `.horizontal-grid-spacer` elements that held only removed content
    - Keep the two existing `.horizontal-item-w.is-text-callout` panels, the `.horizontal-pin-wrap` → `.horizontal-pin-spacer` → `.horizontal-pin-sticky` → `.horizontal-track` chain, the section's `data-h-color-from="dark-green"` / `data-h-color-to="white"` attributes, and the trailing `.sticky-track-theme-change` marker
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 9.7_
  - [x] 2.2 Replace the two panels' copy with provisional placeholder text
    - Reuse the two retained panels in place — do not author new panels. Keep `split-text="lines"` on both `.horizontal-item-text` elements and keep accent spans limited to the existing `span-green-off-white-1` / `c-dark-green-tint-1` classes
    - 4–5 rendered lines per panel, 20–60 characters per line, no overflow at 1280–1920 px
    - _Requirements: 1.7, 1.8, 1.9, 8.5_
  - [x] 2.3 Adjust track width/column CSS in aq-declone for two panels
    - Panel 1 fully in view at 0% pin progress, panel 2 fully in view at 100%; translation monotonic with progress
    - Each panel's width no greater than the viewport at Narrow Viewport widths, no horizontal document overflow
    - _Requirements: 1.4, 1.5, 1.6, 1.10, 11.6, 8.3_

- [x] 3. Remove the OTOT section
  - [x] 3.1 Delete the `[data-otot-section]` subtree from `index.html`
    - Remove `<div data-otot-section class="sticky-track is-home-otot">` and every descendant: `[data-otot-top]`, `[data-otot-bottom]`, both `.otot-home-text-col` blocks, the `phrases` Rive canvas, both `btn-ui` arrow Rive buttons, `.otot-home-bg` with its two hotlinked images, and the `.s.is-otot-end` helmet image
    - Leave zero occurrences of the fragment `otot` in `index.html`
    - _Requirements: 2.1, 2.2, 2.6_
  - [x] 3.2 Remove the now-dead OTOT CSS from aq-declone
    - Delete only rules whose selectors target `.otot-img-w`, `.otot-home-img`, or `[data-gl="carousel"]`; leave every other rule byte-identical
    - _Requirements: 2.2, 2.5_
  - [x] 3.3 Confirm the seam where OTOT was closes cleanly
    - Check no vertical band of page background taller than 8 px appears between the preceding and following sections beyond their own padding, and that each remaining pinned section still pins and releases
    - Use browser preview if available, otherwise hand off to the user with the scroll range to inspect
    - _Requirements: 2.7, 2.8, 2.9_

- [x] 4. Convert the helmet grid section to "Latest Work"
  - [x] 4.1 Remove the helmet grid and rename the heading
    - Delete the `w-dyn-list` wrapper, `[data-helmet-grid]`, all 16 `.helmet-grid-item-w` tiles and their notch SVGs, base/reveal images, labels, dates, and mask extenders
    - Replace the two `<h2>` lines with a single `h2` reading "Latest Work": "Latest" on the `.text-title-lg-mona` treatment, "Work" on `.text-title-lg-brier.c-lime-off`, still two stacked lines, one word per line. Remove any `.screen-reader` or `aria-hidden` duplicate of the heading
    - Delete the stats paragraph in `.title-para-w.c-grey-on-track` and its container so it reserves 0 px
    - Keep the surrounding `<div data-nav-theme-target="light" class="s-group bg-black">` unchanged
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1_
  - [x] 4.2 Remove the dead helmet-grid CSS from aq-declone
    - Delete rules targeting `.helmet-grid-item-img-helmet`, `.helmet-grid-item-reveal-img`, `.helmet-grid-item-w`, `.helmet-grid-item-text-w`, `.helmet-grid-item-date-w` — only where the selector is now unreachable. **Keep** the `.footer-bg-helmet-w` / `.footer-bg-helmet-layout` rules; the footer stays
    - _Requirements: 4.12, 8.3_

- [x] 5. Build the Project List
  - [x] 5.1 Add the four Project Rows markup
    - Single vertical stack, each row exactly two text nodes: project name in a consistent heading level (`h3`), discipline label. No links, buttons, `tabindex`, handlers, paragraphs, images, or index numbers. No view toggle, no "explore all work" link
    - Rows in order: "SHARP-Mini" / "Salesforce · Apex & LWC"; "Blockly for GitHub Actions" / "Developer Tooling"; "Operation Quiet Window" / "Game Development"; "SolarBot CRM" / "Salesforce CRM"
    - _Requirements: 4.6, 4.7, 4.8, 4.9, 4.10_
  - [x] 5.2 Style the rows and separators in aq-declone
    - 1px separator above the first row and between adjacent rows, none below the last; off-white `#f4f4ed` at 0.10–0.20 opacity
    - ≥768px: single line, name left, label right, vertically centred, row height 56–96px
    - <768px: label wraps to its own line below the name, both left-aligned, full text visible without clipping or ellipsis, no horizontal document overflow
    - Colours limited to lime, near-black, off-white; no new stylesheet, no inline `style` attributes
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.13, 11.1, 11.7, 8.1, 8.2, 8.3_

- [x] 6. Build the Hover Preview
  - [x] 6.1 Add the preview element and row highlight CSS
    - One Media Placeholder card per row, 120–260px wide, positioned horizontally between the name's right edge and the label's left edge and vertically within the row bounds; full opacity within 250ms of pointer entry, hidden within 250ms of exit
    - Row highlight turns both name and label lime within 250ms; other rows unchanged
    - `pointer-events: none` on every preview
    - Typographic placeholder content only (initials or discipline label in a Type Tier face on a dark-green or near-black card) — no image request. Inner content must be swappable for an `img` with no change to the box, dimensions, position, or siblings
    - _Requirements: 5.1, 5.2, 5.4, 5.6, 5.7, 5.10, 12.5, 12.6_
  - [x] 6.2 Add the pointer-follow script in a new inline `<script>` before `</body>`
    - rAF-driven position update, settling within 2px of target ≤400ms after the pointer rests, never overlapping name or label text
    - Only one preview visible at any moment, including on direct row-to-row moves
    - Gate creation and listener attachment on the Reduced Motion Gate (`(pointer:fine)` and not `prefers-reduced-motion: reduce`) and on viewport width > 767px; when gated off, still apply the row highlight
    - Hide the preview and clear the highlight within 250ms on scroll or window blur
    - _Requirements: 5.3, 5.5, 5.8, 5.9, 5.11, 5.12, 11.4, 11.5_

- [x] 7. Replace the featured project card with the Research Section
  - [x] 7.1 Remove the card and its copy
    - Delete `<a class="aq-demo-card">` and all descendants from `.exe-col-2`; zero nodes must match `.aq-demo-card`, `.aq-demo-bar`, `.aq-demo-url`, `.aq-demo-body`, `.aq-demo-play`, `.aq-demo-label`
    - Remove the featured-project eyebrow and title inside `.exe-text-w`; keep that element only if it carries Research copy, otherwise delete it
    - Keep `<section data-exe-section data-nav-theme-target="dark" class="s is-lando-exe">`, the `.c.is-lando-exe` container, and `<div data-exe-visor class="exe-top-visor">` as the section's first child, attributes unchanged
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.9, 9.3_
  - [x] 7.2 Remove the `.aq-demo-*` CSS from aq-declone
    - Delete only rules whose selectors target the `.aq-demo-*` elements, including `:hover` and descendant variants
    - _Requirements: 6.8, 8.3_
  - [x] 7.3 Add the Research heading and two rows
    - Centered single `h2` "Research" as the first visible element of the section
    - Two rows: "Smart Home Access Control" (descriptor ≤60 chars identifying a mixed-methods HCI study) then "Racing the Clock" (descriptor ≤60 chars identifying physiological computing research). Each name a single `h3`, each row exactly two text elements, no extra body copy, dates, authors, links, buttons, handlers, or focus stops
    - _Requirements: 7.1, 7.2, 7.7, 7.8, 7.9, 7.10, 7.11, 8.5_
  - [x] 7.4 Style the alternating staggered layout and Media Placeholders
    - ≥768px: row 1 text left / placeholder right with the placeholder top 40–120px above the text top; row 2 placeholder left / text right with its placeholder top 40–120px below row 1's placeholder bottom
    - <768px: single full-width column, text above placeholder in both document and visual order, zero vertical offset, order preserved
    - Placeholders: 16–32px radius on all four corners, single Palette fill, no image element this pass, size from a fixed width-to-height ratio in CSS so an image fills the same box with no markup or position change
    - Light section background meeting the dark section above at the Visor curve with no gap/overlap >1px from 320–1920px; define no new `clip-path`, mask, SVG shape, or pseudo-element curve
    - Descriptor truncated to one visible line if it would wrap, full text still available to assistive tech; text contrast ≥4.5:1
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.12, 7.13, 7.14, 6.5, 6.6, 6.10, 11.2, 11.3, 12.5, 12.6_

- [~] 8. Checkpoint — page loads and scrolls end to end
  - Confirm the page loads, every retained section renders, and scrolling reaches the footer. Ask the user if anything looks off before the shader re-tune.

- [x] 9. Re-tune the Shader Transition to the shortened horizontal track
  - Measure the horizontal track's document top and scroll length with `getBoundingClientRect` only while scroll is within one viewport height of the document top; cache both values; read no pinned-section geometry per frame
  - `window.__bgDark` = 1.0 at range start, monotonically non-increasing, 0.0 at 60% ±2% of cached scroll length, exactly 0.0 at and past range end, always within 0.0–1.0
  - Re-measure once 150ms after resize events stop and once 1000ms after load; keep cached values if scroll is ≥1 viewport height from the top at that moment; recompute the 0%/60% offsets within 2 frames when a measurement differs by >1px
  - Fall back to viewport-height-derived values if a measurement is unavailable, ≤0, or >20× viewport height — no console errors
  - Keep the "message from qavi" stage writing `window.__bgWindow` (4-element px array) and `window.__bgWinAmt` (0.0–1.0) once per frame from the polled Lenis position; treat undefined `__bgDark` / `__bgWinAmt` as 0 and undefined `__bgWindow` as "no window"
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.9, 8.7, 8.8_

- [~] 10. Verify on localhost (user-assisted)
  - Ask the user to run `npm run dev` and open `http://localhost:5179`, then scroll top → footer → top at 375px, 768px, and 1440px with the console open, and paste back any error entries
  - Check: zero uncaught errors and zero failed local (port 5179) asset requests — third-party origins excluded; nav theme inverts correctly across hero → statement → horizontal track → Latest Work (`bg-black`) → Research (light) → Trailblazer CTA → footer; exactly one `[data-nav-theme-target]` per retained section in document order; remaining Rive canvases animate on entry; no position jump where OTOT, the helmet grid, or the featured card were removed; no horizontal overflow at 375px
  - If any error or failed local request is found, fix it and re-run all three viewport passes from the start
  - Leave all changes in the working tree — zero commits, pushes, tags, or deployments
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 2.3, 2.4, 4.11, 6.7, 9.1, 9.2, 9.4, 9.5, 9.6, 9.8, 9.9, 9.10, 10.8, 11.7, 8.9, 8.4_

- [~] 11. Final checkpoint
  - Ensure verification passed at all three widths and the working tree is clean of commits. Ask the user if questions arise. Delete `index.html.bak` once the user confirms the result.

## Notes

- design.md was skipped at the user's request; `requirements.md` is the authoritative spec.
- No property-based tests and no unit tests: the project has no test framework and no build step. Verification is browser-based (task 10).
- `index.html.bak` from task 1 is the rollback path if a removal breaks pinning (Req 2.9).
- The two existing text-callout panels are reused rather than rebuilt — they already carry `split-text="lines"` and the correct accent classes.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2"] },
    { "id": 3, "tasks": ["2.3"] },
    { "id": 4, "tasks": ["3.1"] },
    { "id": 5, "tasks": ["3.2"] },
    { "id": 6, "tasks": ["3.3"] },
    { "id": 7, "tasks": ["4.1"] },
    { "id": 8, "tasks": ["4.2"] },
    { "id": 9, "tasks": ["5.1"] },
    { "id": 10, "tasks": ["5.2"] },
    { "id": 11, "tasks": ["6.1"] },
    { "id": 12, "tasks": ["6.2"] },
    { "id": 13, "tasks": ["7.1"] },
    { "id": 14, "tasks": ["7.2"] },
    { "id": 15, "tasks": ["7.3"] },
    { "id": 16, "tasks": ["7.4"] },
    { "id": 17, "tasks": ["9"] },
    { "id": 18, "tasks": ["10"] }
  ]
}
```
