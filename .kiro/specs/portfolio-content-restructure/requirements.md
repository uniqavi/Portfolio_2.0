# Requirements Document

## Introduction

The portfolio site at `d:\Lando Clone\lando-demo-antigravity` is a self-hosted mirror of landonorris.com (Webflow markup, OFF+BRAND JavaScript bundle, Rive animations, WebGL contour-shader background) that is being progressively rebranded into Abdulqavi Mansuri's portfolio. The page currently reads as a Formula 1 site with substituted text: the owner's real substance sits inside borrowed containers.

This feature restructures four regions of the homepage so the content matches the owner's profile:

1. The Horizontal Track is stripped down to two large-type "about me" paragraph panels.
2. The OTOT Section (ON PLATFORM / OFF PLATFORM) is removed entirely.
3. The Helmet Grid section ("Superbadges Hall of Fame") becomes a "Latest Work" project list in the style of a thin-row list layout.
4. The Featured Project Card (Operation Quiet Window browser mock) is replaced by a Research Section that reuses the existing Visor edge.

This work is surgery on the existing system, not a rebuild. The colour palette, type tiers, animation hooks, shader background, Lenis smoothing, and GSAP pinning stack are preserved. All work is verified on localhost; nothing is committed or deployed as part of this feature.

## Glossary

- **The System**: The portfolio homepage as served locally — `index.html`, the `<style id="aq-declone">` block, the inline `<script>` blocks, and `background.js` acting together.
- **index.html**: The single page file (~1,700 lines) containing all markup. Original Webflow markup is minified onto very long lines.
- **aq-declone**: The `<style id="aq-declone">` block in `<head>` (~1,280 lines) holding every custom and override CSS rule authored for this portfolio.
- **Webflow Stylesheets**: The files under `css/` (`lando-offbrand.shared.*.css`). Read-only assets.
- **OFF+BRAND Bundle**: The proprietary minified script `js/lando.gold-v3.js`, which drives GSAP pinning, horizontal scroll, theme switching, Rive playback, and hover behaviour by querying `data-*` attributes in the markup.
- **Rive**: The Rive runtime and `.riv` animation files rendered into `<canvas>` elements carrying `data-rive-file` / `data-rive-artboard` attributes.
- **Lenis**: The smooth-scroll library that drives all scroll position on the page.
- **GSAP / ScrollTrigger**: The animation and scroll-trigger libraries the OFF+BRAND Bundle uses to pin sections and drive the Horizontal Track.
- **Horizontal Track**: `<section class="s is-horizontal-track">` and its descendants (`.horizontal-pin-wrap` → `.horizontal-pin-spacer` → `.horizontal-pin-sticky` → `.horizontal-track`) — a GSAP-pinned section scrolled horizontally, carrying `data-h-color-from="dark-green"` and `data-h-color-to="white"`.
- **Pin progress**: The normalised scroll progress through a pinned section's pin range, 0% at pin start and 100% at pin end.
- **Text Callout Panel**: A `.horizontal-item-w.is-text-callout` element containing a `.horizontal-item-text` large-type block with `split-text="lines"` already wired to the horizontal scroll animations.
- **OTOT Section**: `<div data-otot-section class="sticky-track is-home-otot">` and its two child sections `[data-otot-top]` (`.s.is-otot-home`, the ON PLATFORM / OFF PLATFORM split) and `[data-otot-bottom]` (`.s.is-otot-end`).
- **Helmet Grid**: The `[data-helmet-grid]` list inside `<section class="s home-helmets">`, holding 16 `.helmet-grid-item-w` tiles, each containing `[data-helmet-item]`, lime notch-frame SVGs, base and hover-reveal images, a label, a date, and mask-extender images.
- **Project List**: The new thin-row, hairline-separated list of projects that replaces the Helmet Grid.
- **Project Row**: One row of the Project List: a project name (left) and a discipline label (right).
- **Separator Rule**: The 1px horizontal hairline drawn above the first Project Row and between adjacent Project Rows, in off-white `#f4f4ed` at an opacity between 0.10 and 0.20.
- **Hover Preview**: The thumbnail card that appears near the pointer, between the two labels of a hovered Project Row.
- **Featured Project Card**: The `<a class="aq-demo-card">` browser-frame mock inside `.exe-col-2` of `<section data-exe-section class="s is-lando-exe">`, linking to `quietwindow.netlify.app`, plus the sibling `.exe-text-w` copy.
- **Visor**: `<div data-exe-visor class="exe-top-visor">` — the concave curved top edge of the `is-lando-exe` section.
- **Research Section**: The new section that occupies the `is-lando-exe` region, with a centered "Research" heading and two alternating text/media rows.
- **Media Placeholder**: A rounded-rectangle or card element in the Research Section or Hover Preview that holds typographic content now and a real image later, without markup or layout change.
- **Nav Theme Rig**: The theme-switching mechanism using `[data-nav-theme-target]` elements and `.sticky-track-theme-change` markers.
- **Nav Theme Inversion**: The convention that `data-nav-theme-target="dark"` is set over LIGHT sections and `"light"` over DARK sections — inverted from intuition.
- **Shader Background**: `background.js`, a self-contained WebGL2 contour shader that creates its own fixed `#bgCanvas` and reads `window.__bgDark` (0–1 light→dark-green mix), `window.__bgWinAmt`, and `window.__bgWindow` each frame.
- **Shader Window**: The light "glimpse" rectangle the Shader Background draws, positioned from `window.__bgWindow` and faded by `window.__bgWinAmt`.
- **Shader Transition**: The dark→light change driven by lightening `window.__bgDark` across the first 60% of Horizontal Track scroll progress.
- **Palette**: lime `#d2ff00`, dark-green `#282c20` (shader dark `#20251A`, dark line `#39402D`), white/off-white `#f4f4ed`, grey-2 `#c8cbbd`, near-black `#15161a`, shader light bg `#F4F4ED`, shader light line `#D9D7CD`.
- **Type Tiers**: Mona Sans (sans, weights to 800), Fraunces (serif, substituted for the paid Brier via the `[class*="brier"]` override), and JetBrains Mono (small mono labels).
- **Animation Hooks**: The existing `split-text` and `data-anim-high` attributes the OFF+BRAND Bundle reads to animate text on scroll.
- **Reduced Motion Gate**: The existing condition used by inline scripts — pointer is fine (`(pointer:fine)`) and `prefers-reduced-motion` is not `reduce`.
- **Narrow Viewport**: Viewport width at or below 767px, the breakpoint at which the existing page reverts several hero behaviours.
- **Deferred Asset**: A project thumbnail or research image the owner will supply after this feature is complete.

## Requirements

### Requirement 1: Horizontal Track reduced to two about-me panels

**User Story:** As the portfolio owner, I want the horizontal scroll section to carry only two large-type paragraphs about me, so that the section communicates who I am instead of displaying borrowed racing photography.

#### Acceptance Criteria

1. THE System SHALL retain exactly one `<section class="s is-horizontal-track">` element whose descendant chain contains exactly one each of `.horizontal-pin-wrap`, `.horizontal-pin-spacer`, `.horizontal-pin-sticky`, and `.horizontal-track`, in that nesting order, and whose section element carries the attributes `data-h-color-from="dark-green"` and `data-h-color-to="white"` with those exact values unchanged.
2. THE System SHALL contain exactly two Text Callout Panels, and no other panel or item elements, as children of `.horizontal-track`.
3. THE System SHALL contain zero `.horizontal-item-w` elements other than the two Text Callout Panels, zero `.text-eyebrow` elements, zero `.horizontal-item-pill-w` elements, and zero `.horizontal-rive-placeholder` elements within `<section class="s is-horizontal-track">`.
4. WHEN the visitor scrolls forward through the Horizontal Track from pin start to pin end, THE System SHALL translate the two Text Callout Panels horizontally under GSAP pinning such that horizontal translation advances monotonically with scroll progress, the first panel is fully within the viewport at 0% pin progress, and the second panel is fully within the viewport at 100% pin progress.
5. WHILE the first Text Callout Panel is fully within the viewport, THE System SHALL render the section background in the dark-green colour of the transition, and WHILE the second Text Callout Panel is fully within the viewport, THE System SHALL render the section background in the white colour of the transition.
6. WHEN pin progress advances from the point at which the first Text Callout Panel begins leaving the viewport to the point at which the second Text Callout Panel is fully within the viewport, THE System SHALL advance the dark-green to white colour transition from 0% to 100% and SHALL hold it at 100% for the remainder of the pin.
7. THE System SHALL render both Text Callout Panels with the classes `horizontal-item-w is-text-callout` on the panel element and `horizontal-item-text` on the text element, and SHALL retain the attribute `split-text="lines"` on both text elements.
8. THE System SHALL populate each Text Callout Panel with provisional placeholder copy of 4 to 5 rendered lines, each line containing between 20 and 60 characters, with no line overflowing the panel width at viewport widths from 1280 px to 1920 px.
9. WHERE a Text Callout Panel contains a colour-accented span, THE System SHALL apply only the existing `span-green-off-white-1` or `c-dark-green-tint-1` classes to that span and SHALL introduce no new colour declarations outside the `<style id="aq-declone">` block.
10. WHEN pin progress reaches 100% and the visitor continues scrolling forward, THE System SHALL release the pin and transfer scrolling to the following section with no change in document scroll position greater than 1 px attributable to the release.
11. IF GSAP, ScrollTrigger, or Lenis is unavailable at initialisation, THEN THE System SHALL render both Text Callout Panels as normally flowing, fully readable content with the pin and horizontal translation disabled, and SHALL leave the following section reachable by vertical scrolling.
12. IF the visitor's browser reports a reduced-motion preference, THEN THE System SHALL disable the horizontal translation and present both Text Callout Panels as static, fully readable content.

### Requirement 2: OTOT Section removal

**User Story:** As the portfolio owner, I want the ON PLATFORM / OFF PLATFORM section removed, so that the page no longer carries a borrowed structure that does not describe my work.

#### Acceptance Criteria

1. THE System SHALL exclude from `index.html` the element `<div data-otot-section class="sticky-track is-home-otot">` and all of its descendants, including `[data-otot-top]`, `[data-otot-bottom]`, both `.otot-home-text-col` blocks, the `phrases` Rive canvas, both `btn-ui` arrow Rive buttons, `.otot-home-bg` and its two hotlinked images, and the `.s.is-otot-end` helmet image, leaving zero elements from that subtree in the served markup.
2. THE System SHALL contain, in `index.html` and in aq-declone, zero occurrences of the attributes `data-otot-section`, `data-otot-top`, `data-otot-bottom` and zero occurrences of the class-name fragment `otot`.
3. WHEN the page is loaded in a browser at a 1440 × 900 viewport with the OTOT Section removed, THE System SHALL produce zero uncaught JavaScript exceptions and zero unhandled promise rejections in the browser console within 10 seconds of the `load` event, counting neither console warnings nor asset-fetch failures.
4. WHEN the visitor scrolls from the top of the page to the bottom and back to the top at a 1440 × 900 viewport with the OTOT Section removed, THE System SHALL produce zero uncaught JavaScript exceptions and zero unhandled promise rejections in the browser console for the full duration of both passes.
5. THE System SHALL exclude from aq-declone every rule whose selector targets `.otot-img-w` or `.otot-home-img`, and SHALL leave every other aq-declone rule byte-identical to its pre-removal text.
6. THE System SHALL leave the OFF+BRAND Bundle under `js/` and the Webflow Stylesheets under `css/` unmodified, relying on the bundle's existing absent-element guards rather than on script edits.
7. WHEN the visitor scrolls the full page length with the OTOT Section removed, THE System SHALL pin and unpin each remaining GSAP-pinned section at the same scroll offsets relative to that section's own top edge as before the removal, within a tolerance of 2% of that section's pinned scroll distance.
8. WHEN the visitor scrolls through the position formerly occupied by the OTOT Section, THE System SHALL advance from the section immediately preceding it to the section immediately following it with no vertical band of page background taller than 8 CSS pixels between them beyond those sections' own declared padding, and with no single-frame vertical displacement of content greater than 4 CSS pixels that is not produced by the scroll itself.
9. IF a remaining GSAP-pinned section fails to pin or fails to release after the removal, THEN THE System SHALL be treated as failing this requirement, and the removal SHALL be reverted so that the page returns to its pre-removal scroll behaviour.
10. THE System SHALL retain in aq-declone a rule that hides `[data-gl="carousel"]`, because that element is a hero GL mount point that is not removed by this feature, so that the OFF+BRAND Bundle renders no photo carousel into it.

### Requirement 3: Latest Work heading and intro

**User Story:** As the portfolio owner, I want the "Superbadges Hall of Fame" heading renamed and its statistics paragraph removed, so that the section presents my project work rather than Trailhead metrics.

#### Acceptance Criteria

1. WHEN the home page renders the section that previously contained the two-line "Superbadges" / "Hall of Fame" heading, THE System SHALL display exactly one heading whose complete visible text content is "Latest Work", and SHALL contain zero occurrences of the strings "Superbadges" and "Hall of Fame" anywhere within that section.
2. THE System SHALL render the visible word "Latest" with the existing `.text-title-lg-mona` type treatment and the visible word "Work" with the existing `.text-title-lg-brier.c-lime-off` type treatment, preserving the two-line stacked arrangement (one word per line) used by the replaced heading, at every viewport width from 320 px to 2560 px.
3. THE System SHALL exclude the intro paragraph that stated the superbadge, badge, point, and certification counts, SHALL place no replacement paragraph or placeholder text in its position, and SHALL leave no empty container that reserves more than 0 px of vertical space where that paragraph was rendered.
4. THE System SHALL keep the Project List as a descendant of the existing `<div data-nav-theme-target="light" class="s-group bg-black">` dark group, with that element's `data-nav-theme-target` attribute value and class list unchanged.
5. THE System SHALL expose the "Latest Work" heading as a single `h2` element that is not marked `aria-hidden` and does not carry the `.screen-reader` class, so that the accessibility tree reports one heading at level 2 with the accessible name "Latest Work" for that section.
6. IF a visually hidden `.screen-reader` duplicate or an `aria-hidden` decorative copy of the section heading text is present in the markup, THEN THE System SHALL remove that duplicate so that the accessibility tree contains exactly one heading node for this section and screen reader output announces "Latest Work" exactly once.
7. WHEN the substituted Fraunces serif face used in place of Brier fails to load within 3 seconds, THE System SHALL continue to display the full "Latest Work" text using the fallback font stack, keeping all characters of both words visible and not clipped.

### Requirement 4: Project List structure and content

**User Story:** As a visitor, I want to scan a compact list of projects with their disciplines, so that I can understand the owner's range in one glance.

#### Acceptance Criteria

1. WHEN the page finishes loading, THE System SHALL contain zero elements matching `[data-helmet-grid]`, `.helmet-grid-item-w`, or `[data-helmet-item]`, and zero of the notch-frame SVG, base image, hover-reveal image, label, date, and mask-extender image elements those tiles contained.
2. THE System SHALL render the Project List as a single vertical stack of Project Rows, each Project Row spanning the full content width of its container, separated by horizontal separator rules of 1px thickness in off-white `#f4f4ed` at an opacity between 0.10 and 0.20.
3. THE System SHALL render exactly one separator rule between each adjacent pair of Project Rows and exactly one separator rule above the first Project Row, and SHALL render no separator rule below the last Project Row.
4. WHILE the viewport width is 768px or greater, THE System SHALL render each Project Row as a single line with the project name aligned to the left content edge, the discipline label aligned to the right content edge, both vertically centred on a shared baseline row, and a Project Row height between 56px and 96px inclusive.
5. IF the viewport width is less than 768px, THEN THE System SHALL render the discipline label on its own line directly below the project name within the same Project Row, both left-aligned, with no horizontal overflow of the document body.
6. THE System SHALL render exactly four Project Rows in this order, with project name and discipline label text matching exactly: "SHARP-Mini" with label "Salesforce · Apex & LWC"; "Blockly for GitHub Actions" with label "Developer Tooling"; "Operation Quiet Window" with label "Game Development"; "SolarBot CRM" with label "Salesforce CRM".
7. THE System SHALL limit each Project Row to exactly two text nodes, the project name and the discipline label, and SHALL render no descriptive paragraph, image, thumbnail, or index number inside a Project Row.
8. THE System SHALL render each project name inside a heading element of a single consistent level between `h2` and `h3`, exposing the name as its accessible name.
9. THE System SHALL render each Project Row with no `a` element, no `button` element, no positive or zero `tabindex` attribute, and no click or keyboard activation handler, so that no Project Row receives keyboard focus during sequential tab navigation of the page.
10. THE System SHALL render no list/grid view toggle control and no "explore all work" link inside or adjacent to the Project List.
11. WHEN the page loads with the Helmet Grid removed, THE System SHALL report zero JavaScript errors and zero unhandled promise rejections in the browser console within 10 seconds of the load event.
12. THE System SHALL contain no rules targeting `.helmet-grid-item-img-helmet` or `.helmet-grid-item-reveal-img` within the `<style id="aq-declone">` block.
13. THE System SHALL define all Project List styling inside the `<style id="aq-declone">` block only, using colours limited to lime `#d2ff00`, near-black `#15161a`, and off-white `#f4f4ed`, and SHALL add no additional stylesheet file or inline `style` attribute for Project Rows.

### Requirement 5: Project Row hover highlight and preview

**User Story:** As a visitor, I want a project row to respond when I point at it and show a preview, so that the list feels alive and hints at the work behind each name.

#### Acceptance Criteria

1. WHILE the pointer rests on a Project Row, THE System SHALL apply a highlight treatment to that row that changes the rendered colour of both the project name and the discipline label to the Palette lime, completing the change within 250 ms of pointer entry, and SHALL leave the other three Project Rows at their unhighlighted colours.
2. WHILE the pointer rests on a Project Row, THE System SHALL display exactly one Hover Preview on the page, horizontally between the right edge of the project name and the left edge of the discipline label, vertically within the bounds of the hovered row, sized between 120 px and 260 px wide, reaching full opacity within 250 ms of pointer entry.
3. WHILE the pointer rests on a Project Row and the Reduced Motion Gate is satisfied, THE System SHALL update the Hover Preview position on each animation frame so that it settles within 2 px of its target offset from the pointer no more than 400 ms after the pointer comes to rest, without the preview overlapping either the project name text or the discipline label text.
4. WHEN the pointer leaves a Project Row, THE System SHALL hide the Hover Preview for that row within 250 ms, returning the row's name and label to their unhighlighted colours.
5. WHEN the pointer moves from one Project Row directly to another Project Row, THE System SHALL hide the previous row's Hover Preview and show only the entered row's Hover Preview, with no more than one Hover Preview visible at any moment.
6. THE System SHALL fill each Hover Preview with typographic placeholder content drawn from the Palette and Type Tiers — the project initials or discipline label in a Type Tier face on a dark-green or near-black card — with no external image request issued for the placeholder.
7. THE System SHALL structure each Hover Preview as a Media Placeholder whose own box, dimensions, position, and surrounding markup are unchanged when a supplied image replaces the typographic content, so that the swap edits only the placeholder's inner content.
8. IF the Reduced Motion Gate is not satisfied, THEN THE System SHALL omit all pointer-following movement of the Hover Preview and SHALL still apply the row highlight treatment of criterion 1.
9. THE System SHALL convey every piece of information carried by a Hover Preview — project name and discipline label — in the Project Row text itself, so that no Hover Preview content is unique to the preview.
10. THE System SHALL render every Hover Preview transparent to pointer events, so that a displayed preview never becomes the hover target and never interrupts the hover state of the row beneath it.
11. WHILE Project Rows carry no hyperlink, THE System SHALL keep every Project Row out of the keyboard tab order and add no focus-enabling attribute to it, and SHALL leave the project name headings readable by assistive technology and by screen-reader navigation without any pointer or focus interaction.
12. IF the page scrolls or the browser window loses focus while a Hover Preview is displayed, THEN THE System SHALL hide that Hover Preview within 250 ms and clear the row highlight treatment.

### Requirement 6: Featured Project Card removal and Research Section placement

**User Story:** As the portfolio owner, I want the featured Operation Quiet Window card replaced by a Research section, so that my academic research is represented on the homepage.

#### Acceptance Criteria

1. THE System SHALL exclude from `.exe-col-2` the `<a class="aq-demo-card">` element and all of its descendants, such that a DOM query for `.aq-demo-card`, `.aq-demo-bar`, `.aq-demo-url`, `.aq-demo-body`, `.aq-demo-play`, and `.aq-demo-label` returns zero nodes on the rendered page.
2. THE System SHALL exclude the eyebrow text and title copy inside the `.exe-text-w` element that described the featured project, and SHALL retain the `.exe-text-w` element itself only if it contains Research Section copy, otherwise exclude it.
3. THE System SHALL place the Research Section content inside `<section data-exe-section data-nav-theme-target="dark" class="s is-lando-exe">`, in the region formerly occupied by the Featured Project Card, as a descendant of the same `.c.is-lando-exe` container.
4. THE System SHALL retain the `<div data-exe-visor class="exe-top-visor">` element as the first child of `<section data-exe-section>`, with its `data-exe-visor` attribute and `exe-top-visor` class unchanged, so that the concave top edge of the Research Section is the pre-existing Visor.
5. THE System SHALL render the Research Section against a light background, and SHALL render the section immediately preceding it against a dark background, with the boundary between the two backgrounds coinciding with the Visor curve and no visible gap or overlap greater than 1 pixel at any viewport width from 320 to 1920 pixels.
6. THE System SHALL define no new `clip-path`, mask, SVG shape, or pseudo-element curve for the Research Section top edge in the `<style id="aq-declone">` block.
7. WHEN the page finishes loading with the Featured Project Card removed, THE System SHALL report zero JavaScript errors and zero unhandled promise rejections in the browser console.
8. THE System SHALL exclude from the `<style id="aq-declone">` block every rule whose selector targets only `.aq-demo-card`, `.aq-demo-bar`, `.aq-demo-url`, `.aq-demo-body`, `.aq-demo-play`, or `.aq-demo-label`, including their `:hover` and descendant variants, and SHALL retain all other rules in that block unchanged.
9. IF the `data-exe-section` or `data-exe-visor` attribute is absent from the rendered section after the change, THEN THE System SHALL be treated as failing this requirement, since those attributes are queried by the existing minified JavaScript bundle.
10. IF the Research Section content fails to render, THEN THE System SHALL still render the Visor curve and the section background, leaving no collapsed section of height 0 pixels in place of the removed card.

### Requirement 7: Research Section layout and content

**User Story:** As a visitor, I want to see the owner's research entries laid out in alternating rows, so that I can recognise the academic side of the portfolio quickly.

#### Acceptance Criteria

1. WHEN the Research Section renders, THE System SHALL display a horizontally centered "Research" heading as the first visible element of the section, marked up as a single `h2` element exposed to assistive technology with its accessible name equal to "Research".
2. WHEN the Research Section renders, THE System SHALL render exactly two research rows, ordered "Smart Home Access Control" first and "Racing the Clock" second, positioned below the "Research" heading.
3. WHILE the viewport width is 768px or greater, THE System SHALL place the first research row's text block in the left half and its Media Placeholder in the right half, with the Media Placeholder's top edge between 40px and 120px above the text block's top edge.
4. WHILE the viewport width is 768px or greater, THE System SHALL place the second research row's Media Placeholder in the left half and its text block in the right half, with the second row's Media Placeholder top edge between 40px and 120px below the first row's Media Placeholder bottom edge.
5. WHEN a Media Placeholder renders, THE System SHALL render it as a rectangle with corner radius between 16px and 32px on all four corners, filled with a single colour drawn from the Palette, and containing no image element in this pass.
6. THE System SHALL size each Media Placeholder from a fixed width-to-height ratio held in CSS inside the `<style id="aq-declone">` block, so that supplying an image fills the same box with no change to markup, no change to placeholder dimensions, and no change to sibling element positions.
7. THE System SHALL limit each research row's text block to exactly two text elements: a research name of at most 40 characters and one descriptor line of at most 60 characters, with no additional body copy, list, date, or author text.
8. THE System SHALL render the first research entry's name as "Smart Home Access Control" and its descriptor as a single line of at most 60 characters identifying it as a mixed-methods HCI study.
9. THE System SHALL render the second research entry's name as "Racing the Clock" and its descriptor as a single line of at most 60 characters identifying it as physiological computing research.
10. THE System SHALL render each research name as a single `h3` element exposed to assistive technology with its accessible name equal to the displayed research name.
11. THE System SHALL render each research row and every element inside it with no hyperlink, no button, no click or keyboard activation handler, and no keyboard focus stop in this pass.
12. WHILE the viewport width is below 768px, THE System SHALL stack each research row into a single column with the text block above its Media Placeholder, remove the vertical offsets required by criteria 3 and 4, and keep the row order defined in criterion 2.
13. THE System SHALL render the Research Section text using the Type Tiers, using only Palette colours, at a text-to-background contrast ratio of at least 4.5:1.
14. IF a descriptor line would wrap to more than one rendered line at any viewport width between 320px and 1920px, THEN THE System SHALL truncate the visible descriptor to one line while keeping the full descriptor text available to assistive technology.

### Requirement 8: Design system preservation

**User Story:** As the portfolio owner, I want new sections to use the existing palette, type, and animation system, so that the page continues to read as one coherent design rather than a patchwork.

#### Acceptance Criteria

1. THE System SHALL colour every new or modified element using only the existing CSS custom properties for the Palette — lime `#d2ff00`, dark-green `#282c20`, shader dark `#20251A`, dark line `#39402D`, off-white `#f4f4ed`, grey-2 `#c8cbbd`, near-black `#15161a`, shader light background `#F4F4ED`, shader light line `#D9D7CD` — written as `var(--token, #hex)` with the literal hex as fallback, and SHALL introduce no colour value outside this set of 9, except neutral black or white at an alpha of 0.30 or lower used for shadows, outlines, and translucent fills.
2. THE System SHALL set `font-family` on every new or modified text element to exactly one of the three existing Type Tiers — Mona Sans at weights 400 to 800, Fraunces, or JetBrains Mono — and SHALL declare no other font family name.
3. THE System SHALL place every CSS rule added or modified by this feature inside the `<style id="aq-declone">` block, and SHALL keep the `[class*="brier" i]` to Fraunces override in the `<style id="aq-font-override">` block, so that the count of style blocks introduced by this feature is 0.
4. THE System SHALL leave the two Webflow Stylesheets under `css/` byte-identical to their pre-change state.
5. WHERE a new or modified text block is a heading or display-scale line of 200 characters or fewer, THE System SHALL apply the `split-text` attribute and the `data-anim-high` attribute to that block so it animates in consistently with the surrounding page.
6. IF the OFF+BRAND Bundle does not run or does not process a `split-text` block within 3 seconds of page load, THEN THE System SHALL still render that block's full text at final opacity and final position, so no content is permanently hidden.
7. THE System SHALL preserve `background.js` as a self-contained module that creates its own `#bgCanvas` when absent, and SHALL read `window.__bgDark`, `window.__bgWinAmt`, and `window.__bgWindow`.
8. IF `window.__bgDark` or `window.__bgWinAmt` is undefined, THEN THE System SHALL treat the value as 0, and IF `window.__bgWindow` is undefined, THEN THE System SHALL render without the Shader Window rather than raising an error.
9. THE System SHALL introduce no build step and no bundler, SHALL keep `devDependencies` limited to the single existing `sirv-cli` entry with no runtime dependencies added, and WHEN `npm run dev` is run, THE System SHALL serve the page on port 5179 with all new sections rendered and zero new browser console errors.

### Requirement 9: Proprietary JS and Nav Theme Rig integrity

**User Story:** As the portfolio owner, I want removals to leave the proprietary animation bundle working, so that the page does not break in ways I cannot debug inside minified code.

#### Acceptance Criteria

1. WHEN the page is loaded in a browser after the removal of the attributes `data-otot-section`, `data-otot-top`, `data-otot-bottom`, `data-helmet-grid`, and `data-helmet-item`, THE System SHALL produce zero browser console entries of severity error or uncaught exception from page load until 5 seconds after the load event completes, at a viewport width of 1280 px or greater and again at a viewport width of 480 px or less.
2. WHEN the visitor scrolls from the top of the page to the end of the footer and back to the top after these removals, THE System SHALL produce zero browser console entries of severity error or uncaught exception for the duration of the scroll, at a viewport width of 1280 px or greater and again at a viewport width of 480 px or less.
3. THE System SHALL retain the `data-exe-section` and `data-exe-visor` attributes on the Research Section, with unchanged attribute values.
4. WHEN a remaining Rive canvas enters the viewport, THE System SHALL begin or resume its animation within 1 second of entry and SHALL render at least one visual frame change within the following 2 seconds, matching the pre-change behaviour of that same canvas.
5. WHEN the visitor scrolls from the top of the page to the end of the footer, THE System SHALL apply, in document order, the Nav Theme Inversion convention of `data-nav-theme-target="dark"` over each light-background section and `data-nav-theme-target="light"` over each dark-background section, for the retained page order: hero, statement, horizontal track (dark-green to white), Latest Work on the `bg-black` group, Research (light), Trailblazer CTA, footer.
6. WHEN the top edge of a section carrying `[data-nav-theme-target]` crosses the bottom edge of the navigation bar, THE System SHALL complete the navigation theme change within 500 ms, with no intermediate state in which navigation text and its background share the same lightness category.
7. THE System SHALL retain exactly one `.sticky-track-theme-change` marker for each remaining pinned section whose background colour changes during its pin, and SHALL contain zero `.sticky-track-theme-change` markers that reference a removed section.
8. THE System SHALL contain exactly one `[data-nav-theme-target]` element per retained section listed in criterion 5, in that same document order, with a total count equal to the number of retained sections in that list.
9. IF an element or attribute queried by the OFF+BRAND Bundle is absent after removal, THEN THE System SHALL continue to render all retained sections and SHALL keep page scrolling functional from the top of the page to the end of the footer, with the navigation theme remaining at its last successfully applied value.
10. IF the navigation theme cannot be resolved for a retained section during scroll, THEN THE System SHALL retain the navigation theme value applied for the preceding section and SHALL NOT remove the navigation bar from the page.

### Requirement 10: Shader Transition and page rhythm after content removal

**User Story:** As a visitor, I want the background transition and section pacing to still feel deliberate on the shortened page, so that the site does not feel abruptly cut down.

#### Acceptance Criteria

1. WHILE the scroll position is within the cached Horizontal Track pin range, THE System SHALL set `window.__bgDark` to a monotonically non-increasing value that equals 1.0 at the start of the range, reaches 0.0 at 60% ± 2% of the cached Horizontal Track scroll length, and stays within the range 0.0 to 1.0 at every scroll position.
2. WHILE the scroll position is at or past the end of the cached Horizontal Track pin range and at or before the end of the document, THE System SHALL set `window.__bgDark` to exactly 0.0.
3. WHEN a re-measurement produces a Horizontal Track document top or scroll length that differs from the cached value by more than 1 CSS px, THE System SHALL replace the cached values and recompute the Shader Transition start and end offsets as the same 0% and 60% fractions of the new cached scroll length, taking effect within 2 animation frames.
4. THE System SHALL measure the Horizontal Track document top and scroll length with `getBoundingClientRect` only while the scroll position is less than one viewport height from the document top, SHALL cache those two values, and SHALL read no layout geometry of the pinned Horizontal Track during its per-frame update.
5. WHEN the viewport is resized, THE System SHALL re-measure the Horizontal Track once after resize events stop for 150 ms, and WHEN the page first loads, THE System SHALL re-measure once after a settle delay of 1000 ms, in both cases using the cached values unchanged if the scroll position is one viewport height or more from the document top at that moment.
6. IF a measurement of the Horizontal Track is unavailable, or yields a scroll length of 0 CSS px or less, or yields a scroll length greater than 20 times the viewport height, THEN THE System SHALL retain fallback values derived from viewport height for the track top and scroll length, SHALL continue driving the Shader Transition from those values, and SHALL report zero JavaScript errors in the browser console.
7. WHILE the "message from qavi" stage is within the scroll range that drives it, THE System SHALL set `window.__bgWindow` to a four-element array of left, top, width, and height in CSS px, and SHALL set `window.__bgWinAmt` to a value in the range 0.0 to 1.0, updating both once per animation frame.
8. WHEN the visitor scrolls from the top of the document to the footer at a constant rate, THE System SHALL render at least one section or the Shader Background covering 100% of the viewport height at every scroll position, and SHALL keep the change in any section's viewport-relative top offset between consecutive animation frames no greater than the scroll delta for that frame plus 2 CSS px.
9. WHILE the scroll position is between 0 and the end of the document, THE System SHALL keep Lenis smoothing driving scroll position and SHALL update `window.__bgDark`, `window.__bgWinAmt`, and `window.__bgWindow` once per animation frame from the polled scroll position.

### Requirement 11: Narrow viewport behaviour

**User Story:** As a visitor on a phone, I want the new list and research rows to read well on a narrow screen, so that the content is usable without horizontal panning.

#### Acceptance Criteria

1. WHILE the viewport is a Narrow Viewport, THE System SHALL render each Project Row such that the full project name text and the full discipline label text are visible without clipping or ellipsis, and SHALL keep the document's horizontally scrollable width equal to the viewport width.
2. WHILE the viewport is a Narrow Viewport, THE System SHALL stack each research row's text block and Media Placeholder vertically in a single full-width column, with the text block preceding the Media Placeholder in both document order and visual order for both of the two research rows.
3. WHILE the viewport is a Narrow Viewport, THE System SHALL apply zero vertical offset to every research row, so that consecutive rows are separated only by the section's standard vertical spacing and no row is visually staggered relative to another.
4. WHILE the viewport is a Narrow Viewport, THE System SHALL not create or display the pointer-following Hover Preview, and SHALL not attach pointer-tracking listeners for it.
5. IF the Reduced Motion Gate is not satisfied, THEN THE System SHALL not create or display the pointer-following Hover Preview at any viewport width.
6. WHILE the viewport is a Narrow Viewport, THE System SHALL render both Text Callout Panels of the Horizontal Track with each panel's rendered width no greater than the viewport width, with all panel text visible without clipping, and with zero horizontal overflow of the document.
7. WHEN the viewport width crosses the 767px boundary in either direction, THE System SHALL apply the layout set for the resulting viewport class without requiring a page reload.

### Requirement 12: Verification and delivery constraints

**User Story:** As the portfolio owner, I want everything finished and checked on localhost before anything reaches the repository, so that the deployed site never shows half-finished work.

#### Acceptance Criteria

1. WHEN verification is performed, THE System SHALL be loaded as `index.html` from the local dev server on port 5179 and scrolled continuously from the top of the page to the bottom edge of the footer at each of the viewport widths 375 px, 768 px, and 1440 px.
2. WHEN a verification pass completes, THE System SHALL show zero uncaught JavaScript errors and zero failed requests for locally hosted assets in the browser console, where locally hosted assets are those served from the port 5179 origin, and where requests to third-party origins (Webflow CDN images, Google Fonts, simple-icons CDN, unpkg rive.wasm) are excluded from this count.
3. IF a verification pass records one or more uncaught JavaScript errors or one or more failed locally hosted asset requests, THEN THE System SHALL be treated as unverified, and the defect SHALL be corrected and all three viewport passes in criterion 1 re-run from the start before verification is reported as complete.
4. THE System SHALL leave all changes for this feature in the Git working tree only, with zero commits, zero pushes, zero tags, and zero deployments performed, so that no automatic deployment is triggered by this work.
5. WHILE a Deferred Asset slot in the Project List or the Research Section has no image assigned, THE System SHALL render the slot at its final occupied dimensions so that the position of every surrounding element shifts by 0 px once an image is supplied.
6. THE System SHALL keep every Deferred Asset slot fillable by supplying an image file and setting the slot's `src` value and its `alt` text, with zero other markup changes and zero CSS changes required.

## Out of Scope

The following are acknowledged but not specified by this feature:

- Separate detail pages for individual projects and research entries.
- Final copy for the two Horizontal Track about-me panels.
- Real images for the Hover Preview and Research Section Media Placeholders.
- Making Project Rows or research rows clickable.
- Replacing the remaining OFF+BRAND Bundle JavaScript, Rive files, and hotlinked Webflow CDN photography (a known licensing exposure tracked separately).
- The reference site's list/grid toggle and "explore all work" link.
- Further readability or Salesforce-emphasis work beyond these four changes.
- The Horizontal Track's narrow-viewport scroll behaviour remains whatever the OFF+BRAND Bundle already provides.
