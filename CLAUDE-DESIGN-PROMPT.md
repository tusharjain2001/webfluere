# Prompt for Claude Design: Webfluere 3D scroll website

I'm sharing the code of my agency's current landing page. Please use it as the base and make it better: a premium 3D website with cinematic scroll animations. Keep what already works and push the 3D and motion further.

## About Webfluere

Webfluere is a small digital agency that designs and builds websites and apps. The one thing that makes us different is that **the same team designs and builds**. There is no hand-off between a design studio and a separate developer, so what the client approves is what ships.

Our audience is small and growing business owners who want a site that makes them look established, works on every phone and is easy to find.

**Services:** Websites, Responsive design, Apps, SEO foundations, Smooth UX.

**Main call to action:** a "Start a project" button that opens a short contact form (name, email, message) in a dialog. Submissions are emailed to us through Web3Forms (`src/components/project/project-dialog.tsx`). Instagram: [@web_fluere](https://www.instagram.com/web_fluere/), linked in the contact section and footer.

## Honesty rules (strict)

- The only claim you may make is **"20+ projects shipped"**.
- Do NOT invent clients, logos, testimonials, reviews, star ratings, metrics, percentages, prices, awards, team names or SEO/ranking promises.
- The six pieces of work on the page (Aurel, Tidewell, Kiln & Crumb, Fieldnote, Luma, Marrow) are **concepts we designed to show our range, not client projects**. Always label them as concepts.
- Real client projects and testimonials exist but haven't been added yet. Design empty, reusable slots for them (the code already has `clientProjects` and `testimonials` arrays in `src/lib/site.ts`, and that section hides itself while they are empty). Use clearly marked placeholders, never fake content.

## Current site (what you're getting in the code)

**Stack:**
- Vite, React **19.2** (pinned: @react-three/fiber 9.7 needs a React version below 19.3, so don't upgrade), TypeScript and Tailwind CSS v4.
- 3D: three.js, @react-three/fiber and @react-three/drei.
- Motion: framer-motion for scroll-linked transforms, Lenis for smooth scroll.
- Icons: @phosphor-icons/react.
- Fonts: Schibsted Grotesk (UI and headlines) and Cinzel (small uppercase captions).

**How the 3D works:**
- There is one fixed, full-screen R3F canvas (`src/components/three/story-scene.tsx`) behind the page content.
- Tall sections are pinned with `position: sticky` and tagged `data-chapter="..."`. `src/lib/scroll-chapters.ts` reads each chapter's scroll progress, and the scene blends between camera and device "poses" for each chapter.
- The devices (laptop, phone, tablet, browser window, ring panels) are built from rounded geometry in `src/components/three/devices.tsx`. Their screens use real screenshots of our concept sites as textures, with an emissive "light up" effect.

**Page flow:**
1. **Nav:** logo (a two-tone blue ribbon mark plus the "Webfluere" wordmark) and a small "Start a project" button.
2. **Hero:** "Designed and built by the *same hands.*" A 3D laptop shows a colour concept site, and a light follows the mouse.
3. **Story** (pinned, 300vh):
   - The problem: "A slow, broken or hard-to-find website quietly costs you trust and customers."
   - Then Sketch, Design and Build steps while the laptop screen explodes into three layers (wireframe, design, built site) and collapses back.
   - Then: "What you approve is what *ships.*"
4. **Services** (pinned, 520vh): the five services light up one by one while the 3D stage restages the devices for each.
5. **Work** (pinned, 520vh): "Six concepts, *made from scratch.*" The concept screens rotate in a 3D coverflow ring, with captions synced to scroll.
6. **Client proof:** hidden until real data exists.
7. **Contact:** a closing line ending in "We'll build the rest." plus the "Start a project" button and an Instagram link.
8. **Footer:** a large wordmark.

**Fallback:** with `prefers-reduced-motion`, the site skips the 3D canvas and uses static Statement, Services and Work sections.

**Look:**
- Navy-black ground (#070a12, raised #0d1220, deep #13203d).
- Silver text (#e6ecf5) and pewter secondary text (#9aa7ba).
- Accent blues taken from the logo: sky #5ca6ff for highlights, royal #1e6fe6 for buttons.
- A soft blue glow behind the canvas, a blue rim light on the 3D devices and a fine stipple grain overlay.

I love the current animations and the overall mood. **Please enhance, don't replace.**

## What I want from you

Make this feel like an award-level 3D agency site (the level of Awwwards "Site of the Day"), while staying fast and readable.

**1. Richer 3D:**
- More convincing materials on the devices: brushed aluminium, glass screens with subtle reflections, soft contact shadows and an environment map in cool blue tones.
- Better lighting with depth, such as a subtle volumetric or bloom feel on the lit screens. Keep it tasteful, not neon.
- Optionally one signature 3D moment built around the ribbon logo mark. For example, the ribbon could form or unfold in 3D in the hero or at the contact section.
- The 3D must stay meaningful (devices, screens and the work itself). No abstract blobs or random floating shapes.

**2. Premium scroll choreography:**
- Smoother, more cinematic camera moves between chapters, with anticipation and easing rather than linear blends.
- Scroll-linked text reveals such as line-by-line masks and per-word lighting, in sync with the 3D beats.
- Clear transitions between chapters so the page reads like one continuous film.
- A stronger Work chapter: a more dramatic ring or gallery, where the active concept screen comes forward and lights up.
- Tiny details: magnetic buttons, cursor-reactive light and a subtle parallax on the depth layers.

**3. Keep and respect:**
- The chapter system (`data-chapter` + poses) and the React 19.2 / R3F stack.
- The navy + logo-blue palette, the fonts and the grain.
- One CTA intent everywhere: "Start a project" opens the contact form. Keep the form to name, email and message, and keep it working (Web3Forms submit, success and error states).
- The reduced-motion fallback, keyboard focus styles, alt text and good contrast.
- Mobile at 390px wide: no clipped devices and no horizontal scroll. Text must stay readable over the 3D (use gradient scrims where needed).
- Performance: lazy-load the 3D, cap the device pixel ratio, avoid heavy postprocessing on mobile and keep the headline visible before WebGL loads.

**4. Copy style:**
- Short and plain; talk about the client's business, not our tech.
- No em dashes, no eyebrow labels above headings and no "scroll down" cues.

## Deliverables

1. A short direction note: what you changed and why, section by section.
2. Updated code for the files you touch, as complete files that drop into the existing structure (`src/components/three/*`, `src/components/sections/*`, `src/lib/*`, `src/style.css`).
3. A list of any new packages, which must be compatible with React 19.2 and @react-three/fiber 9.
4. Placeholders I still need to fill: real client projects and testimonials.
