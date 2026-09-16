---
name: Webfluere
description: Websites and apps, designed and built by one team, surfacing from a velvet-black mezzotint plate.
colors:
  plate: "#0b0a09"
  plate-raised: "#13110f"
  plate-deep: "#2a2119"
  plate-brown: "#5a4a3a"
  silver: "#dbd6d1"
  pewter: "#a7a39a"
  smoke: "#3c3a37"
  burnished-base: "#c9c3bb"
typography:
  display:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 4.6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Cinzel, Trajan Pro, Times New Roman, serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.9
    letterSpacing: "0.18em"
  control:
    fontFamily: "Cinzel, Trajan Pro, Times New Roman, serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.22em"
rounded:
  plate: "2px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "40px"
  section-mobile: "96px"
  section-desktop: "144px"
  container: "1400px"
  nav-height: "68px"
components:
  button-primary:
    backgroundColor: "{colors.burnished-base}"
    textColor: "{colors.plate}"
    typography: "{typography.control}"
    rounded: "{rounded.plate}"
    padding: "0 28px"
    height: "48px"
  button-primary-sm:
    backgroundColor: "{colors.burnished-base}"
    textColor: "{colors.plate}"
    rounded: "{rounded.plate}"
    padding: "0 20px"
    height: "40px"
  button-hairline:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.silver}"
    typography: "{typography.control}"
    rounded: "{rounded.plate}"
    padding: "0 28px"
    height: "48px"
  nav:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.pewter}"
    height: "68px"
    padding: "0 40px"
  work-image:
    backgroundColor: "{colors.plate-raised}"
    rounded: "{rounded.plate}"
---

# Design System: Webfluere

## Overview

**Creative North Star: "The Mezzotint Plate"**

The page is a mezzotint plate: a copper ground rocked to velvet warm-black, from which work is scraped and burnished into light. One raking light does the burnishing. Screens, controls and concept plates surface from darkness only where that light reaches them, so the whole system reads as a single lit object rather than a stack of evenly lit panels.

Density is low and cinematic. Copy sits in a narrow column on one side of a full-bleed black field while a single React Three Fiber stage carries real devices (laptop, tablet, phones, a browser window) through pinned scroll chapters. Material is literal: a raster burr stipple over everything, a brushed raster silver on the primary control, warm plate-brown only where the plate has been half-scraped. Type is a tight grotesk for everything spoken and an engraved roman for the plate's captions and its one command.

The world refuses the dark agency hero with neon glow and evenly lit floating mockups, and (a user-pinned product rejection) abstract blobs, liquid or amoeba forms in place of real devices and screens.

**Key Characteristics:**
- Velvet warm-black ground (#0b0a09) under a fixed rocked-burr grain at 10% opacity.
- Burnished silver is a brushed raster image, the only light-bearing material in the DOM.
- One point light, no ambient or environment fill, in the one 3D stage.
- Schibsted Grotesk for headings and UI; Cinzel uppercase for 13px engraved captions and the DM "BUILD" control.
- 2px corners everywhere a corner shows.
- Pinned scroll chapters drive the 3D stage; reduced motion gets static sections.

## Colors

A near-monochrome warm-black and silver palette, where colour exists only as the light that surfaces work.

### Primary
- **Burnished Silver** (burnished-base, with the `/material/burnished.webp` raster over it): the lit face of primary controls and of the one "finished" tile in the static services grid. The hex is only the load fallback; the raster is the material.

### Neutral
- **Velvet Plate** (plate): page ground, nav glass when scrolled (85% alpha), text on burnished silver, selection text, mobile legibility scrims.
- **Raised Plate** (plate-raised): resting ground behind work images before they load or burnish.
- **Deep Plate** (plate-deep): a warm, scarcely lifted plate tone declared in the token set for half-scraped passages; no shipped surface uses it yet.
- **Plate Brown** (plate-brown): the scraped-back copper showing through under rocked black, used in the static services passes only.
- **Silver** (silver): headings, wordmark, focus outline, selection background, caret.
- **Pewter** (pewter): body copy, nav links at rest, engraved captions.
- **Smoke** (smoke): hairlines (usually at 50-60% alpha), the hairline control border, scrollbar thumb, browser-window dots in 3D.

### Named Rules
**The Only Light Rule.** Silver as a material appears only as the burnished raster. Never draw it with a CSS gradient; gradients in this system are plate-coloured scrims and image masks only.

**The Half-Scraped Rule.** Plate-brown (and plate-deep, when it is used) appears only in passages that read as partially scraped plate (rocked black laid over them at varying opacity), never as flat section fills.

## Typography

**Display Font:** Schibsted Grotesk Variable (with ui-sans-serif, system-ui)
**Label Font:** Cinzel (with Trajan Pro, Times New Roman), weights 400 and 500

**Character:** A compact, slightly condensed grotesk carries every sentence in plain, tight-tracked voice; Cinzel is the engraver's hand, used as incised plate lettering in small uppercase with wide tracking.

### Hierarchy
- **Display** (600, clamp(2.75rem, 4.6vw, 4.5rem), line-height 1, -0.035em): the hero headline. The closing call to action scales it up to clamp(2.5rem, 6vw, 5.5rem) at 16ch, and the footer wordmark to clamp(2.5rem, 6vw, 5rem) at -0.04em.
- **Headline** (500, clamp(2rem, 3.6vw, 3.5rem), 1.05, -0.03em): chapter statements in the pinned story and work chapters; static fallbacks use 4vw.
- **Title** (600, 1.5rem to 1.875rem, -0.02em): story steps, service names, concept names in the ring.
- **Body** (400, 1.125rem, 1.625): offers and explanations in pewter, capped at 38-52ch.
- **Label** (500, 13px, 0.18em, uppercase Cinzel): plate captions ("Plate I, Kiln & Crumb, a concept") and concept kinds ("Bakery website, concept").
- **Control** (500, 13px, 0.22em, uppercase Cinzel; 12px at 0.18em in the nav): the DM "BUILD" control only.

### Named Rules
**The Engraved Caption Rule.** Cinzel is set at 13px, weight 500, uppercase, tracked 0.18em, in pewter. It captions a plate or labels a concept with real content; it never introduces a heading.

**The Lining Figures Rule.** Body sets `font-variant-numeric: lining-nums` so "20+" sits on the grotesk's cap line.

## Layout

A 1400px container with 20px gutters on phones and 40px from the md breakpoint (768px). Static sections breathe at 96px vertical padding, 144px on desktop; the closing call to action opens to 112px and 176px. The nav is a fixed 68px bar that hides on downward scroll past 320px and returns on upward scroll or focus.

The signature layout is the pinned chapter: a tall section (story 300vh, services 520vh, work 520vh) marked `data-chapter`, holding a sticky full-viewport frame. On wide screens copy stays in the left 36% and the 3D subject occupies the right; on phones the subject sits in the upper half and copy anchors to the bottom over a plate-coloured scrim (from plate through 85% plate to transparent). The first viewport shows headline, offer and the burnished control on load, never behind a reveal. The static work grid alternates asymmetric spans (8/4, 5/7, 4/8) across 12 columns.

**The Pinned Chapter Rule.** Every scroll-driven 3D beat belongs to a `data-chapter` section whose sticky span is measured once (load, resize, fonts ready) and read inside the render loop, never from a scroll listener.

## Elevation & Depth

The DOM is flat plate. Depth comes from light, not lift: the fixed burr stipple sits above everything at 10% opacity with no pointer events, and real depth lives in the single fixed WebGL stage behind the content. In that stage, device shells are dark metal (#15130f, metalness 0.85, roughness 0.42) with near-black bezels (#050404), lit only by one warm point light (#f1ebe2, intensity 55, decay 2). Screens surface through emissive intensity driven by the light's position (roughly 0.05 at rest to 0.62-0.72 when burnished); unfocused ring plates fall back to 0.03.

### Shadow Vocabulary
- **Burnished lift** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.45), 0 12px 28px -14px rgb(0 0 0 / 0.9)`): only on burnished silver, giving the metal a lit top edge and a soft fall into the plate.

### Named Rules
**The One Raking Light Rule.** The 3D stage has exactly one light, a point light: no ambient, hemisphere or environment map. It follows the mouse in the hero, sweeps on its own on touch, and rakes each chapter from above and in front of the look target.

**The Burnish Is Emissive Rule.** A screen is revealed by raising its emissive intensity, never by adding a light or an outline. Only the plate facing the camera is burnished; its neighbours stay dark.

## Shapes

Corners are nearly square (2px) on every DOM surface that shows one: controls, image frames, the static services grid, the skip link. Hairlines are 1px smoke at 50-60% alpha dividing sections and captioning images. In 3D, devices carry softer physical radii (rounded boxes and bevelled extrusions) because they are objects, not plate. The only round DOM form is the scrollbar thumb.

## Components

### Buttons
The one control language: a plate state, either lit or rocked.
- **Shape:** near-square (2px).
- **Primary (burnished):** the brushed silver raster (640 x 160 tile) with plate-coloured Cinzel uppercase, 48px tall with 28px side padding; the nav size is 40px tall, 20px padding, 12px text. Label is always DM "BUILD", with an up-right arrow (Phosphor SVG) in the large size.
- **Hover / Focus:** the raster slides 220px left over 900ms on cubic-bezier(0.16, 1, 0.3, 1), like a burnisher passing; the arrow nudges up-right; active presses down 1px. The large button sits in a magnetic wrapper that pulls toward a mouse (strength 0.3). Focus is the global 1px silver outline at 4px offset.
- **Hairline (secondary):** transparent with a 1px smoke border that warms to pewter on hover, silver Cinzel text. Built into the control API; no shipped surface renders it yet, because the page has one action.

### Cards / Containers
- **Work image (burnish image):** 2px frame on raised plate. At rest the work is shown in plate tones (brightness 0.62, contrast 1.08, grayscale, sepia 0.18); a mouse burnishes true colour through a radial mask that follows the pointer; touch reveals full colour once in view; reduced motion shows full colour.
- **Caption rule:** a 1px smoke hairline above name (grotesk) and kind (engraved label).

### Navigation
- Text wordmark "Webfluere" (600, 1.125rem, -0.02em, silver) left; Work and Services links in pewter at 14px, silver on hover, hidden on phones; the small burnished DM "BUILD" control always visible. Transparent at top; after 24px of scroll it becomes 85% plate with a medium backdrop blur and a 60% smoke bottom hairline.

### Scroll Stage (signature)
One fixed, pointer-free React Three Fiber canvas (fov 30, dpr up to 1.75, fades in over 1.2s) behind the page, lazy-loaded after first paint. Its chapters:
- **Hero:** laptop, browser window and two phones clustered beside the headline, each screen surfacing as the light passes.
- **Story:** the camera flies into the laptop; its screen separates into sketch, design and build layers in an exploded view, each lit in turn, then presses back into one shipped screen.
- **Services:** five staged arrangements (laptop alone; laptop, tablet and phone; a phone forward and turning; the sketch layer for SEO structure; every device together).
- **Work:** a coverflow arc of six framed concept plates (0.52 rad apart) that turns one plate to the front per step.
Copy in each chapter crossfades against the same progress values, with unfocused items held at 26-30% opacity.

### Static Fallback
Under prefers-reduced-motion the canvas renders only inside the hero, static and on demand; the story, services and work chapters are replaced by static sections (a statement, a five-pass services grid scraped from rocked black toward plate-brown and ending on burnished silver, and the asymmetric work grid). Smooth scrolling (Lenis) is off.

## Do's and Don'ts

### Do:
- **Do** set every surface on plate (#0b0a09) under the fixed burr stipple (256px tile, 10% opacity).
- **Do** use the burnished raster for the primary control, with plate-coloured Cinzel uppercase at 13px and 0.22em tracking.
- **Do** keep corners at 2px on controls, image frames and grids.
- **Do** reveal screens and work by burnishing: emissive intensity in 3D, a pointer mask over plate-toned images in the DOM.
- **Do** give every new 3D beat a `data-chapter` pinned section and a static equivalent for reduced motion.
- **Do** label every concept as a concept in its engraved caption, and keep "20+ projects shipped" as the only number.
- **Do** keep client proof hidden (rendering nothing in production) until real, permitted projects or quotes exist.

### Don't:
- **Don't** draw silver with a CSS gradient; the silver is the brushed raster.
- **Don't** add ambient, hemisphere or environment lighting, or a second light, to the stage.
- **Don't** light devices evenly or add neon glow; the world rejects the evenly lit floating-mockup agency hero.
- **Don't** replace devices and screens with abstract blobs, liquid or amoeba shapes.
- **Don't** hold the headline, offer or DM "BUILD" control behind a reveal in the first viewport.
- **Don't** use plate-brown as a flat section fill.
- **Don't** invent clients, logos, quotes, prices or metrics.
