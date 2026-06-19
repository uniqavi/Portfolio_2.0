# Continuation Handoff — `lando-demo` (Abdulqavi's de-cloned version)

> **You are in `D:\Lando Clone\lando-demo`** — the **already-de-cloned** Lando Norris mirror, set up
> as a working sandbox for Abdulqavi Mansuri's portfolio. **Don't restart from scratch.** All copy,
> logo, hero, marquee, and section structure are already his. Read this whole file before editing —
> it tells you exactly what's been done, what's left, and how things were wired so you don't undo work.

---

## 0. What this folder is (vs. its siblings)

Three folders under `D:\Lando Clone\`:

| Folder | Role |
|---|---|
| **`lando-demo`** (← **YOU ARE HERE**) | The working de-cloned version. Continue this. |
| `lando-demo-decloned-v1` | Committed git snapshot of the same state (safety backup, don't touch). |
| `lando-norris-fresh` | A separate **pristine** Lando clone for a different "swap, don't hide" approach in another chat. Ignore from this chat. |

Run it: `npm run dev` → http://localhost:5173. The OFF+BRAND preloader auto-dismisses after ~3.5s.
On Abdulqavi's machine the preview tool launches with sirv on port 5179 (see `.claude/launch.json`).

⚠️ This still runs **OFF+BRAND's proprietary JS** — sandbox/reference only, **do not deploy publicly**.
The deployable site lives at `D:\Portfolio\Portfolio\Portfolio Continue`.

---

## 1. The current state (already done — don't redo)

Everything below is **already applied** in `index.html` and verified live (0 console errors, 0 visible
Lando photos, 0 "lando/norris/mclaren/f1" text). All visual changes were injected via a single
`<style id="aq-declone">` block + targeted markup edits — **the 196KB Webflow CSS files were NOT edited.**

### Content / copy (✅ done)
- ~83 Lando→Abdulqavi text mappings applied via `rebrand.mjs` (kept as documentation).
  Includes: page title, OG/Twitter meta, ON/OFF Track → **ON/OFF PLATFORM**, Helmets Hall of Fame →
  **Superbadges Hall of Fame** (16 cards: 7 superbadges + Trailhead stats + projects + M.Sc. Weimar),
  store → **Operation Quiet Window**, partners → **skills & tools**, footer → "**Always building at
  the edges.**", nav, all hrefs (GitHub/LinkedIn/Instagram/Trailblazer/mailto/quietwindow demo),
  copyright, screen-reader headings.
- **Gotcha:** two `mclaren f1 since 2019` eyebrow strings contained a U+2028 line separator between
  "f1" and "since" — plain greps miss them. Already handled.

### Identity / tells (✅ done)
- Nav wordmark SVG "LANDO NORRIS" → styled text "ABDULQAVI MANSURI" (Mona Sans 800).
- Nav center monogram: `<canvas data-rive-ln4>` removed → **inline `aq-logo.svg`** (`.aq-nav-svg`,
  `width:40px height:52px !important` — a Webflow `.w-embed svg` rule overrides without `!important`;
  hover: scale 1.1, rotate -4°, fill → lime).
- Loading-screen "L7" Rive: the `data-rive-primary` canvas paints **both** the lime fill and the L7,
  so it was **kept** (owns dismiss/transition logic) and a lime overlay (`.aq-load` covering it) was
  injected inside `.transition-w` with the AQ doing a **stroke draw-on** then fill fade-in.
  Size: `clamp(52px,6vw,68px)`.
- Smoothness fix on the draw-on: scheduled via `requestIdleCallback({timeout:900})` so it doesn't
  fight load-time WebGL/Rive init; SVG gets `transform:translateZ(0)` for compositor isolation.
  Measured: 0 dropped frames during the 1.05s draw.
- Gotcha: `pathLength` on the flow path is ignored when combined with `vector-effect:non-scaling-stroke`.
- Favicon + apple-touch → `/favicon.svg` (AQ on lime). OG/Twitter image → `/og-image.svg`
  (raster PNG before any real deploy).
- Paid **Brier** serif (loaded from Lando's CDN) → free **Fraunces** (Google Fonts + override:
  `[class*="brier"]{font-family:'Fraunces',Georgia,serif !important}`). Mona Sans kept.
- Stripped active Google Analytics (`G-P8L2KTXDN0` + first-party tag + GA loader).
  `data-wf-domain="abdulqavi.me"`.

### Nav (updated)
- Top-right lime CTA pill is now **LinkedIn** (LinkedIn "in" SVG `fill=currentColor` + "LinkedIn" text +
  `linkedin.com/in/abdulqavimansuri`). The GitHub link that briefly sat beside it was **removed** at
  his request (GitHub already lives in the menu/footer). **Gotcha:** nav-theme naming is inverted vs
  intuition — `[data-nav-theme="dark"]` is set over the *light* hero and `"light"` over dark sections.
  Palette: grey-2 `#c8cbbd` (light), dark-green `#282c20`, white `#f4f4ed`, lime `#d2ff00`.

### Hero → window "picture-frame" gather (NEW — replaces the empty-window stage)
- **The effect:** the hero does NOT fade. On scroll a **dark-green contour frame** ramps in with a
  centred rectangular **cutout** (light window); simultaneously the **portrait slides right→centre
  (scaling up) and the name slides left→centre, ending BEHIND the head** (z-index). `.aq-hero-type`
  clips to the window so they sit inside the cutout. Then it holds, the window+hero rise+fade, and
  "Automating…" comes up on the dark green; later it fades back to light across the horizontal scroll.
- **Dark phase is in the shader, not a flat overlay.** `background.js` has two palettes — light
  (`bg #F4F4ED`/`line #D9D7CD`) + dark-green (`darkBg #20251A`/`darkLine #39402D`) — and outputs
  `mix(lightContour, darkContour, uDark*(1-inWindow))`. Surround = dark-green contour (Lando img 1);
  the `uWindow` rect stays light = the glimpse (Lando img 2). Globals read each frame: `__bgDark` (0–1),
  `__bgWinAmt`, `__bgWindow` (`[left,top,w,h]` CSS-px, top-left → shader flips Y & ×dpr). `#bgCanvas` z-2.
- **The gather** (script before `</body>`, rAF-throttled, drives CSS vars + globals by `scrollY`):
  base rects of portrait/name are measured at the top (`measure()`, only when `scrollY<0.05vh` so
  transforms are identity). Progress `e` (smoothstep over `0.10→0.80 vh`):
  - portrait → `--sx/--sy/--sc`: translate box-centre to `vw/2`, scale `1→1.3`, vertical target puts the
    eye-line ~window centre (`pcyTarget = winT + winH*0.5 + 0.24*h*scale`).
  - name → `--nsx/--nsy/--nsc`: translate box-centre to `vw/2`, scale `1→1.05`, centred ~window centre;
    `z-index:1` (BEHIND portrait `z-index:2`) so it sits behind the head and peeks at the sides. Name uses
    `width:max-content` so centring the box centres the text.
  - `.aq-hero-type` `clip-path: inset(...)` closes from full→window as `e→1` (`none` at `e≈0` to avoid
    clipping the portrait's drop-shadow). Eyebrow + Next-Cert card fade with `e`.
  - **`transform` combines parallax + gather vars** e.g. `translate3d(calc((var(--qx,0) + var(--sx,0)) *
    1px), …) scale(var(--sc,1))`. **GOTCHA: CSS `calc()` needs spaces around `+`** — `var(--a)+var(--b)`
    is invalid and silently drops the whole transform (cost an hour). Always `var(--a) + var(--b)`.
- **Exit:** `xp` over `1.05→1.50 vh` fades `.aq-hero-type` (opacity) + rises it (`translateY`), and the
  shader window fades (`__bgWinAmt = e*(1-xp)`) and rises (`__bgWindow` top `-rise`); dark-green holds to
  `hTop`, then lightens to light over the first 60% of the horizontal scroll. Window/statement share
  scroll space, so the hero must clear before the statement centres (~`1.5 vh`).
- The two portrait offsets (`0.24` eye-line, scale `1.3`) and name (`1.05`, vertical `winH*0.44`) are
  **image-tuned** — re-tune if the portrait asset changes.
- **Pinning gotcha:** the horizontal section (`.s.is-horizontal-track`) is GSAP-pinned, so its live
  `getBoundingClientRect` is wrong mid-scroll. Measure its doc position **once** near the top (cached in
  `measure()`, re-run on resize + a 1.2s settle), never per-frame.
- Signature intentionally **omitted** — Abdulqavi will supply his own to overlay the window later
  (see §8 for how). Old marquee label/signature block hidden via `.marquee-adv-top-w{display:none}`.

### Loader → logo-window reveal (NEW)
- After the lime preloader draws the AQ logo on, the logo becomes a **window that zooms out through
  to the hero** (like Lando's L7 reveal). Built on the existing `.aq-load` overlay + draw-on script.
- **Mechanism:** on reveal the script adds `.aq-reveal` to `.aq-load`, which masks the lime layer with
  `mask-image: linear-gradient(#000,#000), var(--aqlogo)` + `mask-composite:exclude` → lime everywhere
  **except** a logo-shaped hole (fixed size `--ms` = the drawn logo width). `var(--aqlogo)` is a data-URI
  of the AQ mark using the **full 2-subpath path** (identical to the drawn `.aq-fill`, nonzero fill) so
  the hole matches the logo exactly. **Gotcha:** the 2nd subpath is the logo's middle horizontal bar,
  NOT a counter-hole — dropping it leaves that bar as lime ("missing part") mid-zoom. Use the whole path.
- **The zoom = `transform:scale()` on `.aq-load`, NOT mask-size growth.** Mask-size growth anchors at the
  art's viewBox centre — which is a lime GAP below the bar, so lime balloons from the middle instead of
  the window. Instead the hole stays fixed and the layer transform-scales `1 → ~max(vw/barW,vh/barH)*1.7`
  over 1050ms (ease-in cubic), with **`transform-origin` placed at the middle bar's centre** so the camera
  flies *through the bar window*. Bar centre in the 1545×2000 art ≈ (954.3, 866.7); on screen (mask drawn
  centred at `ms`) that's `vw/2 + ms*0.1177`, `vh/2 − ms*0.0862`; bar size ≈ `ms*0.2987 × ms*0.1182`.
  GPU-composited, so smoother than animating mask-size too.
- **Routing the hole to the hero:** front-to-back inside `.transition-w` (z9999) is `.aq-load` (lime) →
  `.transition-rive` canvas (paints lime+L7 via WebGL) → hero. So reveal also does
  `.transition-rive{display:none}` (else the hole shows the Rive, not the hero), hides the drawn
  `.aq-load-svg`, and at the end sets `.transition-w` `visibility:hidden` itself (doesn't wait on the
  proprietary ~3.5s dismiss). Graceful fallback (just fades the lime) if `mask-composite` unsupported.
- Timing: draw-on (idle, ≤900ms) → +1650ms → zoom 950ms, all inside the ~3.5s preloader window.
- Tune: `dur`/`end` in the reveal script; `--ms` start = the drawn logo's rendered width (keeps the
  hole seamless with the just-drawn glyph).

### Hero — side-by-side layout + cursor parallax (updated)
- Was: centered, name (`z-index:1`) **behind** the portrait (`z-index:2`) → head split the name.
- Now: **name on the LEFT** (`.aq-hero-type .name`, `z-index:4`, in front), stacked two lines —
  "ABDULQAVI" (Mona Sans 800) over *Mansuri* (Fraunces italic, via `.s2{display:block}`), larger
  (`clamp(48px,8.4vw,134px)`), eyebrow left-aligned above it. **Portrait on the RIGHT**
  (`.aq-portrait`, bottom-anchored, larger: `max-height:90vh; max-width:60vw; right:2.5vw`).
  Mobile (≤767px) reverts to centered name-above-portrait.
- **Cursor parallax** (script before `</body>`, after the draw-on script): name & portrait float via
  CSS vars `--px/--py` (name) and `--qx/--qy` (portrait) on `transform:translate3d(...)`. **Both drift
  OPPOSITE the cursor** (move left → content eases right), very subtle (name amp 15px, portrait 10px;
  name a touch more for soft depth). rAF-lerped (0.08), gated to `(pointer:fine)` + non-`reduce` motion.
- To flip sides or revert to centered: edit the `.aq-hero-type .name` / `.aq-portrait` rules in
  `#aq-declone`. Side-by-side was chosen because it lets BOTH name and portrait be large without the
  occlusion the centered layout had.

### Hero — portrait + contour bg (✅ done — see §3 for the exact pattern)
- Hid: `canvas.gl` (Lando 3D head), `[data-gl="background"]`, helmet Rives (`.marquee-gl-rive-w`,
  `.base-helmet-rive`).
- Hero sections (`.s.home-hero, .sticky-item, .sticky-track`) transparent so `#bgCanvas` shows through.
- `background.js` (from `D:\Portfolio\...\background.js`) copied in and **retuned to match the faint
  Lando contour look:** `line:#D9D7CD`, `lines:5`, `width:0.007`, `speed:0.05` (was bold dark
  `#1F2937`/4/0.010/0.06). It's a self-contained cursor-reactive WebGL2 shader; makes its own
  fixed `#bgCanvas` at z-index −1.
- `Portrait_No_BG.png` at `.aq-portrait` (bottom-anchored, max-height 76vh, z-index 2, subtle
  contrast/saturate/drop-shadow filter).
- Name behind portrait (z-index 1) as single nowrap line so head splits "ABDU"[head]"Mansuri"
  (Mona Sans + Fraunces italic `.s2`).

### Hall of Fame — typographic cards (✅ done)
- `.helmet-grid-item-img-helmet` + `.helmet-grid-item-reveal-img` set `opacity:0` (keeps card height
  + lime notch frame intact).
- `.helmet-grid-item-text-w` re-centered absolutely with bigger Mona Sans label, mono date.
- All 16 cards labelled with his real data (7 superbadges, Trailhead stats, M.Sc. Weimar, Quiet
  Window, Smart Friction, Admin Cert WIP).
- **Hover-reveal markup intact** — when he provides screenshots, they drop into
  `.helmet-grid-item-reveal-img` and the existing JS hover will show them.

### Featured project — Quiet Window demo card (✅ done)
- `.exe-cta-img-w` (Champion merch) + `.exe-cta-sticker-w` (LN1 sticker) hidden.
- New `.aq-demo-card` in `.exe-col-2`: browser-frame mock (traffic lights, mono URL bar
  `quietwindow.netlify.app`, lime play button, label "Play the demo") linking to the live game.

### Skills marquee — tool logos (✅ done)
- 17 partner logo URLs (`cdn.prod.website-files.com/.../ln4-ln4-collab-*.svg`) → simple-icons CDN
  (`https://cdn.simpleicons.org/<slug>/15161a`):
  - mapped: salesforce, javascript, react, tailwindcss, html5, css3, unity, figma, git, python, github
- **Salesforce was removed from simple-icons** → local `tools/salesforce.svg` (small cloud SVG).
- **css3 slug renamed to `css`** → already fixed.
- Heading is "**SKILLS & TOOLS**" (was "partners & campaigns").
- `.home-collab-rive-w` (scribble Rive) hidden.

### Lando photos — globally hidden (this is the part to revisit; see §2)
- Global rule: `img[src*="website-files.com"], img[srcset*="website-files.com"]{opacity:0 !important}`
  (keeps layout, drops Lando photos).
- Hidden: `.nav-menu-images-w` (menu collage), `.callout-socials-card-layout` + socials Rive
  (phone reels), `.footer-marquee` (footer partner strip), `.footer-bg-helmet-w` (giant footer
  helmet), `.otot-img-w`/`.otot-home-img` (ON/OFF Track helmet+face).
- Montage placeholders: `.horizontal-item-img-w{background:rgba(128,128,128,.06); outline:1px solid
  rgba(128,128,128,.22)}` — intentional neutral frames so the captions read against something.

---

## 2. What's left / open decisions

**The biggest question:** Abdulqavi has now indicated the "hide-don't-swap" approach **stripped the
design too much**, which is why he opened a sibling chat in `lando-norris-fresh` to start over with
"swap, don't hide". So treat this `lando-demo` folder as **his de-cloned/minimal version** rather
than the goal-state portfolio. Things you can still polish here without contradicting that:

- **Real photos he provides** can drop straight in by removing the global `img[opacity:0]` rule and
  letting individual images load — but he's tracking the swap-in work in `lando-norris-fresh`, so
  don't double-track it here unless he explicitly says so.
- ~~**Minor tells still present**: Next-Cert circuit/track-map Rive, Hall-of-Fame CTA laurel/ball
  emblem, button-arrow Rives.~~ ✅ **DONE** — all three killed via `#aq-declone` + minimal markup:
  - Next-Cert `circuits` Rive (`.home-hero-next-race-rive`) hidden → inline `.aq-cert-mark` SVG
    (lime ~70% **progress ring** = "cert in progress"), injected in `.home-hero-next-race-rive-w`.
  - Trailblazer CTA `reef/helmet-reef` Rive + laurel placeholder (`.callout-rive-w .callout-icon`)
    hidden → inline `.aq-callout-mark` SVG (lime **trail/summit** mountain mark), injected in
    `.callout-rive-w`.
  - Button `btn-ui/arrow` Rives (`.btn-rive-w canvas`) hidden → static **up-right arrow** via
    `.btn-rive-w::after` data-URI background (all buttons are `data-theme="lime"`, so one dark
    `#15161a` arrow fits everywhere; removes the spin too). Gotcha: `.btn-rive-w` has `font-size:0`,
    so size it with `%`/px (`width:100%;height:100%;min-*:12px`), **not** `em`.
- **Type-only montage / OTOT / menu / socials** are intentionally sparse right now — could be
  filled with project text, code snippets, or stack visuals as a second pass.
- **External deps to self-host before any real deploy:** simple-icons CDN, Google Fonts (Fraunces).
- **OG image** is currently an SVG — needs a raster PNG (1200×630) before a real share.

---

## 3. Code patterns / where things live

- **Single style block:** `<style id="aq-declone">` (in `<head>`). All de-clone CSS goes here so it
  overrides the Webflow CSS via the cascade — no edits to `css/lando-offbrand.shared.*.css`.
- **Single logo style block:** `<style id="aq-logo-styles">`.
- **Font override:** `<style id="aq-font-override">`.
- **Hero markup:** `<div class="aq-hero-type">` is the **first child** of
  `<section data-hero-animation-container class="s home-hero">`. Contains `.eyebrow`,
  `<img class="aq-portrait" src="/Portrait_No_BG.png">`, and `.name` with `.s2` for Fraunces.
- **Demo card markup:** `<a class="aq-demo-card">` is the **first child** of
  `<div class="exe-col-2">` (id `w-node-cdf8cae6-…-0b17a7eb`).
- **Loading-screen overlay:** `<div class="aq-load">` sits inside `.transition-w`, right after the
  `data-rive-primary` canvas wrapper.
- **Draw-on trigger:** small `<script>` before `</body>` that runs the stroke transition via
  `requestIdleCallback`.
- **Scratch files removed during the work** (don't recreate): `_logotest.html`, `apply-logo.mjs`,
  `D:/_logo-trace/` (potrace scratch). The durable assets are: `aq-logo.svg`, `favicon.svg`,
  `og-image.svg`, `background.js`, `tools/salesforce.svg`, `rebrand.mjs`, the two `Portrait_*.png`.

---

## 4. His data (source of truth — already applied, here for context)

**Identity:** Abdulqavi Mansuri — Junior Salesforce & Front-End Developer · M.Sc. Computer Science for
Digital Media, Bauhaus-Universität Weimar (Apr 2025–ongoing). Weimar, Germany. Open to
Werkstudent/internship. Public email **qavimansuri@gmail.com** · abdulqavi.me ·
github.com/uniqavi · linkedin.com/in/abdulqavimansuri · instagram.com/qavi.mansuri ·
salesforce.com/trailblazer/iamqavi · demo **https://quietwindow.netlify.app/**

**Salesforce:** Platform Foundations (Jun 2023). Administrator cert **target Jul 2026**. Trailhead
Expeditioner — **92 badges, 71,825 points, 11 trails**. **7 superbadges:** Security Specialist,
Business Administration Specialist, Lightning Experience Reports & Dashboards Specialist, User
Authentication Specialist, User Authentication Settings, User Authentication Troubleshooting, MFA & SSO.

**Experience:** 8BIT Audio (Salesforce dashboards, Flow, client demos) Feb–May 2024 · SmartInternz/AICTE
(Salesforce Admin) Jul–Sep 2022 · 4LUNCHES (AR / Instagram filters / shaders) Jul–Aug 2022.

**Projects:** *Operation Quiet Window* — browser stealth-puzzle game, **Phaser 3 + Vite** (NOT Unity),
Agile team of 4, live at quietwindow.netlify.app. *Smart Home, Smart Friction* — M.Sc. HCI
mixed-methods research, supervised by Prof. Dr.-Ing. Eva Hornecker; access-control friction
analogous to Salesforce role/permission architecture.

**Skills:** Salesforce Flow/LWC/Reports/Security · React/Tailwind/HTML/CSS/JS/.NET · Java/Python/C++/C#/SQL ·
Claude Code · UX/HCI · Git/Figma/LaTeX/Unity.

**Education:** B.Tech CE, Sankalchand Patel University, 2020–2024, CGPA 8.01/10 First Class with
Distinction. **Languages:** English C1, German A2–B1, Hindi/Gujarati native.

---

## 5. Gotchas (the ones that bit us)

1. **U+2028 in eyebrow strings** — see §1 (Content).
2. **Brier is paid** — overridden to free Fraunces, not @font-face deleted (would still 404 → kept
   override pattern).
3. **Webflow `.w-embed svg` rule** silently overrides SVG widths inside `w-embed` divs — use
   `width:Npx !important` for nav logo or it collapses to ~30px.
4. **Rive `.riv` files cannot be authored/edited** — they're compiled binaries. The L7 was
   replaced by removing/overlaying the canvas, not by editing `ln4.riv`. Same for any future
   logo/animation tweaks: SVG/CSS substitute or build a new `.riv` in the free Rive editor.
5. **`pathLength` ignored with `vector-effect:non-scaling-stroke`** — bit us on the (reverted) flow
   prototype. Use raw path lengths instead.
6. **simple-icons quirks** — `css3`→`css`, `salesforce` removed (use local SVG).
7. **The Lando hero's 3D head and faint contour bg share ONE canvas** (`canvas.gl`) —
   inseparable. That's why a 2D portrait composited over a tuned copy of `background.js` is the
   working solution, not "bring back the Lando background without his face".
8. **`canvas.gl` in source HTML is COMMENTED OUT** — the head canvas is created by JS at runtime.
   Hide it via CSS (`canvas.gl{display:none}`) not by editing the markup.
9. **A short looping "flow/comet" effect on the loading logo was prototyped and reverted at his
   request.** Don't reintroduce unless he asks. He kept the draw-on.
10. **Lenis intercepts `window.scrollTo`** — during preview eval use `window.lenis.scrollTo(y,{immediate:true})`
    if available; raw scrolls during a Lenis frame mid-flight produce inconsistent positions. (Also: a
    preview screenshot taken right after a Lenis `scrollTo` can race the smooth scroll — settle ~800ms.)
11. **Layer stack:** `#bgCanvas` (contour shader, draws BOTH the light + dark-green phases, incl. the
    light window cutout) `z-index:-2` → page content `z auto` (incl. `.aq-hero-type` which clips its
    portrait/name into the window). Sections are transparent so the shader bg shows through. The
    dark-green surround + light window are in the SHADER (no CSS overlay); the old `.aq-stage` DOM box was
    removed — the window rect is computed in JS and fed to the shader as `__bgWindow`.

---

## 6. Asset checklist in this folder

| File | Purpose |
|---|---|
| `index.html` | The mirror, fully de-cloned (see §1). |
| `background.js` | Tuned cursor-reactive contour-gel shader (`line:#D9D7CD`, lines:5, width:0.007, speed:0.05). |
| `aq-logo.svg` | Single-path AQ silhouette (viewBox 0 0 1545 2000, fill `#15161a`). |
| `favicon.svg` | AQ on lime rounded square. |
| `og-image.svg` | OG share card (needs raster export before deploy). |
| `Portrait_No_BG.png` | Cutout portrait for hero. |
| `Portrait_White_BG.png` | Fallback. |
| `tools/salesforce.svg` | Local Salesforce cloud SVG (simple-icons removed it). |
| `rebrand.mjs` | Documentation of the ~83 text mappings (already applied). Not idempotent — don't re-run. |

---

## 7. Kickoff prompt for the new chat

> I'm continuing work on `D:\Lando Clone\lando-demo` — my de-cloned version of the Lando Norris
> mirror, set up as my portfolio sandbox. **Don't restart.** Read `_HANDOFF/HANDOFF.md` fully first
> — it has everything already done (logo, hero with portrait + contour bg, hall-of-fame typographic
> cards, demo card, skills marquee, hidden Lando photos, all gotchas) and the open items. The sibling
> chat is doing a different "swap, don't hide" approach in `lando-norris-fresh/` — that one isn't
> this one. Here we keep the minimal/typographic feel. Tell me what's currently rendered, confirm
> nothing's broken, and then we'll pick the next polish item (likely the small Rive tells in the
> Next-Cert card + Hall-of-Fame CTA, or filling in the type-only montage/menu/socials with code
> snippets and project text).

---

## 8. Adding Abdulqavi's own signature to the message window (his TODO → then we wire it)

The `.aq-stage-window` is currently an empty dark panel. When he provides a signature, it overlays the
window (and ideally draws on as it zooms in). Two ways, easiest first:

**A. Static SVG/PNG (simplest, recommended first):**
1. Make the signature: sign on paper → photo, or draw in Figma/Illustrator. Vectorize to a **single-color
   SVG path** (Illustrator Image Trace, or free: <https://www.svgviewer.dev> / Inkscape "Trace Bitmap").
   Lime stroke `#d2ff00` on transparent. Save as `signature.svg` in the project root.
2. Drop it into the window: inside `.aq-stage-window` add `<img class="aq-stage-sig" src="/signature.svg">`,
   and style `.aq-stage-sig{ position:absolute; inset:12% ; width:76%; margin:auto; opacity:var(--win-op); }`.

**B. Animated "draw-on" (nicer, reuses the loader pattern):**
   Use the same stroke-dash trick as the loading-logo draw-on (search `.aq-load-svg` / `getTotalLength`
   in `index.html`): inline the signature `<svg>` with a `.aq-sig-stroke` path, set `stroke-dasharray=len`
   and animate `stroke-dashoffset` from `len`→`0` driven by the stage's `--win-op` (or a scroll range).

**C. True Rive (most work):** build a new `.riv` in the free Rive editor, drop a `<canvas data-rive-*>`
   in the window. Only worth it if he wants interactive/looping motion — A or B cover the look.

Note: the window aspect is `16/10`; design the signature landscape to fit. Keep it one color for clean
theming. The dark→light scroll won't affect the window (it fades with the surround before the montage).
