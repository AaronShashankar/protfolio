# Portfolio project review

**Review date:** 2026-10-04 (Asia/Katmandu)  
**Project:** React 18 + Vite 6 + Tailwind CSS 3 + Three.js portfolio  
**Scope:** UI implementation, responsive design, accessibility, interactions, performance, maintenance, and build readiness.

## Overall assessment

The production build succeeds, but the project has confirmed styling, accessibility, and interaction defects. The most urgent fixes are missing theme opacity utilities, mobile navigation, reduced-motion support, button contrast, and incorrect clipboard success feedback. The portfolio also needs links or case studies for its projects.

This is a source and compiled-output review, **not a completed visual browser audit**. No browser connection was available through the computer-use tool. Responsive clipping concerns below are explicitly marked as risks, not observed screenshot failures. No application source was changed during this review; the build regenerated `dist/`.

## Checks performed and evidence

| Check | Result | Details |
| --- | --- | --- |
| Active entry and imports | Checked | `index.html` loads `src/main.jsx`, which imports `src/index.css` and renders `App` in StrictMode. |
| Components and data | Checked | Reviewed all React components, project/skill data, theme setup, Vite and Tailwind configuration. |
| Legacy implementation | Checked | Root `js/` and `css/` contain a separate implementation; neither entry is loaded by the React app. |
| Production build | **Passed** | `npm run build`: 1,602 modules transformed; Vite 6.4.3; build completed in about 69 seconds in this environment. Build duration is not a page-speed measurement. |
| Installed direct dependencies | **Passed** | `npm ls --depth=0` listed installed dependencies without dependency errors. This does not establish security status. |
| Development server | **Passed after permission retry** | Initial sandbox run failed with `spawn EPERM`; approved retry started Vite. This was an environment restriction, not a confirmed project defect. |
| Local HTTP response | **Passed** | `http://127.0.0.1:3000` returned HTTP 200 and included the React entry. This does not prove browser rendering or interactions work. |
| Generated CSS selectors | **Defect confirmed** | Several used opacity utilities are absent from the production CSS; ordinary `.bg-card` and `.text-ink` are present. |
| Contrast calculations | Checked | Calculated from declared color values; results appear below. No screenshot-based contrast scan was possible. |
| UTF-8 content | Checked | Active HTML, Hero, About, and Contact files contain no tested mojibake sequences. Garbled punctuation in default PowerShell output was an output-decoding artifact and is not reported as a UI bug. |
| Tests and lint configuration | Missing | No project test files, lint configuration, or test/lint scripts found outside dependencies/build output. |
| Browser/screenshots | **Blocked** | Browser inventory returned no available browsers or apps. Desktop/mobile screenshots, console inspection, and real interaction testing were not completed. |
| Security advisory audit and deployed links | Not performed | No registry advisory audit, external link verification, deployment review, or server-header inspection. |

## Confirmed findings

### F01 — High: theme colors do not support the opacity classes used throughout the UI

**Evidence:** [tailwind.config.js:10](tailwind.config.js#L10), [Navbar.jsx:18](src/components/Navbar.jsx#L18), [AboutSection.jsx:87](src/components/AboutSection.jsx#L87), [WorkSection.jsx:169](src/components/WorkSection.jsx#L169).

Colors are configured as complete values such as `bg: 'var(--bg)'`. In this Tailwind 3 build, opacity variants used in JSX are not emitted. Direct string checks against the generated CSS confirmed these selectors are absent:

```text
.bg-bg\/75
.bg-bg\/60
.from-bg\/90
.text-ink\/80
.border-line\/60
.bg-pink\/10
```

**Impact:** The scrolled header lacks its intended translucent background, the portrait gradient lacks its intended bottom color stop, and multiple badges, borders, and text treatments lose their intended styling. Actual readability over images still needs visual testing.

**Fix:** Use color channels with an alpha-aware Tailwind definition, such as `rgb(var(--bg-rgb) / <alpha-value>)`, or implement explicit CSS colors for translucent surfaces. Update all affected tokens, including `line` and `card`, consistently.

**Acceptance:** The expected selectors exist in a fresh build and computed styles match the intended opacity in both themes.

### F02 — High: mobile users lose primary section navigation

**Evidence:** [Navbar.jsx:30](src/components/Navbar.jsx#L30).

The primary navigation has `hidden md:block`; there is no mobile menu or equivalent section navigation. Below 768 CSS pixels, users lose direct links to Work, About, Skills, and Contact. Hero links only cover Work and Contact.

**Fix:** Add an accessible mobile menu or compact section navigation. A disclosure menu needs an accessible name, expanded state, keyboard operation, and sensible focus behavior.

**Acceptance:** At 320–767 CSS pixels, every main section is reachable from navigation with touch and keyboard.

### F03 — High: the active application does not respect reduced motion

**Evidence:** [src/index.css](src/index.css), [App.jsx:68](src/App.jsx#L68), [SkillsRing.jsx:29](src/components/SkillsRing.jsx#L29), [Background3D.jsx:223](src/components/Background3D.jsx#L223), [css/reduced-motion.css](css/reduced-motion.css).

The React path has no `prefers-reduced-motion` handling. The rule in the legacy stylesheet is not imported. Smooth scrolling, marquee movement, CSS art, character reveals, magnetic/tilt interactions, rotating skills, and WebGL motion remain active.

**Fix:** Add active CSS and JavaScript motion-preference handling. Provide a static skills display and normal project layout where appropriate; disabling CSS animations alone does not stop JavaScript animation loops.

**Acceptance:** With reduced motion enabled, content remains readable and usable without continuous decorative motion.

### F04 — High: the primary button has insufficient text contrast

**Evidence:** [src/index.css:103](src/index.css#L103).

The solid button uses white text on dark-theme pink `#FF5C8A`. Calculated contrast is **2.94:1**, below the 4.5:1 threshold for normal-sized text. The button uses 1rem text, so it does not qualify as large text under ordinary defaults.

**Fix:** Darken the button background or use a suitably dark foreground. Check default, hover, keyboard focus, and both themes.

**Acceptance:** Normal-sized button text meets at least 4.5:1 in each state.

### F05 — Medium: About text deliberately becomes difficult to read

**Evidence:** [AboutSection.jsx:20](src/components/AboutSection.jsx#L20), [AboutSection.jsx:136](src/components/AboutSection.jsx#L136).

Words start at 0.14 opacity and become visible according to scroll position. On the declared solid dark background, the starting text contrast is approximately **1.42:1**. Visitors can have visible words that remain faint while the reveal is incomplete.

**Fix:** Keep a readable baseline or animate a decorative overlay instead of essential text. Show the complete statement for reduced motion and avoid requiring additional scrolling to read it.

**Acceptance:** All visible statement text remains readable at every scroll position.

### F06 — Medium: light-theme marquee outlines use a dark-theme color

**Evidence:** [Marquee.jsx:46](src/components/Marquee.jsx#L46), [Marquee.jsx:65](src/components/Marquee.jsx#L65).

Outlined words use fixed `#EEEAFF` instead of the theme's ink color. That stroke against light background `#F4F1FD` has approximately **1.06:1** contrast. The marquee is `aria-hidden`, so this is principally a visual theme-consistency problem rather than missing essential screen-reader content.

**Fix:** Bind the stroke to `var(--ink)`. Review other fixed pale borders and glows in light mode.

### F07 — Medium: “Copied!” can appear when copying failed

**Evidence:** [ContactSection.jsx:35](src/components/ContactSection.jsx#L35).

`navigator.clipboard?.writeText(email)` is not awaited or caught. `setCopied(true)` runs even when the Clipboard API is unavailable or the write rejects. A rejected promise can also become unhandled. The reset timeout is not cleaned up on unmount, and success feedback has no live status announcement.

**Fix:** Await the write, show success only after resolution, handle errors with clear manual-copy guidance, announce status, and clear the timeout on cleanup.

**Acceptance:** Test successful copy, rejected copy, and missing Clipboard API; each produces truthful feedback.

### F08 — Medium: project cards have no route to the actual work

**Evidence:** [WorkSection.jsx:105](src/components/WorkSection.jsx#L105), [src/data/projects.js](src/data/projects.js).

Cards render descriptions, decorative artwork, and tags, but contain no demo link, repository link, or case-study destination. The data has no corresponding URL fields. Visitors cannot inspect the stated full-stack builds from their cards.

**Fix:** Add available source/demo links and short case studies describing role, implementation, and results. Use actual product screenshots where available. Validate factual claims with the owner; this review cannot establish whether the projects are deployed.

### F09 — Medium: the hero advertises dragging that is not implemented

**Evidence:** [Hero.jsx:106](src/components/Hero.jsx#L106), [CursorProgress.jsx:11](src/components/CursorProgress.jsx#L11), [Background3D.jsx:198](src/components/Background3D.jsx#L198).

The copy says “Drag the 3D shape.” Pointer movement influences the camera/rotation globally, and pointer-down triggers a pulse. There is no held-pointer drag interaction, pointer capture, or object hit-testing.

**Fix:** Change the instruction to accurately describe the current interaction, or implement deliberate drag controls with touch and keyboard alternatives.

### F10 — Medium: theme changes rebuild the WebGL scene unnecessarily

**Evidence:** [Background3D.jsx:179](src/components/Background3D.jsx#L179), [Background3D.jsx:279](src/components/Background3D.jsx#L279).

The scene effect depends on `theme`, so every toggle tears it down and creates new geometry, materials, particles, and a renderer. A MutationObserver already updates scene colors. Rebuilding also resets animation state and randomly regenerates the starfield.

**Fix:** Keep scene initialization stable and update colors through one dedicated mechanism.

**Acceptance:** Toggling themes changes colors without recreating the renderer or resetting the scene.

### F11 — Medium: Three.js resource cleanup is incomplete

**Evidence:** [Background3D.jsx:269](src/components/Background3D.jsx#L269).

Cleanup cancels the frame, removes listeners, disconnects the observer, and disposes the renderer, but does not explicitly dispose mesh/particle geometries and materials. Those resources need their own disposal. The catch path also lacks equivalent cleanup if initialization fails after partial setup. StrictMode and theme toggles make repeated setup more likely.

**Fix:** Centralize idempotent cleanup; dispose each owned geometry/material once, including shared geometry, and invoke cleanup on partial failure.

**Acceptance:** Repeated mount/unmount and theme changes do not accumulate owned rendering resources. No memory growth was measured in this session.

### F12 — Medium: animation code repeatedly measures layout and runs when unnecessary

**Evidence:** [WorkSection.jsx:18](src/components/WorkSection.jsx#L18), [Background3D.jsx:207](src/components/Background3D.jsx#L207), [AboutSection.jsx:23](src/components/AboutSection.jsx#L23).

Several components run separate perpetual frame loops. WorkSection writes height and then reads bounding rectangles/height every frame. Background3D queries sections and reads their positions every frame. AboutSection creates an opacity array and schedules a React update on every scroll event, even outside the relevant section.

**Impact:** Avoidable layout work and rendering can reduce scroll smoothness and increase power use. This is a confirmed code pattern; no FPS, long-task, or battery measurements were collected.

**Fix:** Cache measurements, refresh them on meaningful layout changes, schedule scroll updates at most once per frame, and suspend decorative work when offscreen or the document is hidden. Consider a shared animation scheduler.

### F13 — Low: cursor listeners and counter animation cleanup are incomplete

**Evidence:** [CursorProgress.jsx:46](src/components/CursorProgress.jsx#L46), [CursorProgress.jsx:83](src/components/CursorProgress.jsx#L83), [AboutSection.jsx:236](src/components/AboutSection.jsx#L236).

CursorProgress adds pointer-enter/leave handlers directly to interactive elements but does not remove them in cleanup. Counter frames are not tracked/cancelled when a counter unmounts mid-animation. Current static-page behavior limits the impact, but remounts and future dynamic content make lifecycle problems more likely.

**Fix:** Remove every registered handler and track/cancel counter frames. Use delegated handlers if interactive elements can change.

### F14 — Medium: theme storage errors can prevent the application from rendering

**Evidence:** [App.jsx:16](src/App.jsx#L16), [App.jsx:51](src/App.jsx#L51).

Theme initialization reads localStorage without protection; persistence writes are also unguarded. In environments where storage access throws, initialization can fail. Any truthy stored string is accepted, even if it is neither `dark` nor `light`. HTML starts in dark mode and the stored theme is applied after rendering, creating a possible initial theme flash.

**Fix:** Guard storage access, validate values, choose a fallback, and initialize the root theme before paint where practical.

**Acceptance:** Invalid stored values and denied storage access do not break rendering; stored light mode does not visibly flash dark on reload.

### F15 — Low: fonts are declared twice and the portrait is eagerly loaded

**Evidence:** [index.html:10](index.html#L10), [src/index.css:1](src/index.css#L1), [AboutSection.jsx:78](src/components/AboutSection.jsx#L78).

The same Google Fonts stylesheet is declared in HTML and via CSS import. Caching may deduplicate transfer, so duplicate downloads are not claimed. The below-fold portrait has no lazy-loading or decoding hint; the JPEG build asset is **342.54 kB**. Its aspect-ratio wrapper already reserves space.

**Fix:** Keep one font-loading path; consider responsive WebP/AVIF sources, `loading="lazy"`, and `decoding="async"` for the portrait. Confirm visual quality before changing the image.

### F16 — Medium: no automated quality checks or project documentation

**Evidence:** [package.json:6](package.json#L6), repository file inventory.

Only `dev`, `build`, and `preview` scripts exist. No tests, lint configuration, README, or `.gitignore` were found. A successful build therefore does not detect broken clipboard states, inaccessible navigation, or responsive layout regressions. Root `js/` and `css/` duplicate the current implementation and can mislead maintainers into fixing inactive files. `duration-400` is used in App but is absent from generated CSS because it is not configured.

**Fix:** Document the active entry and setup; archive/remove legacy files after checking their purpose; add a `.gitignore` for generated/local files; configure linting and focused tests for meaningful interactions. Fix or configure `duration-400`.

### F17 — Low: portfolio sharing metadata is incomplete

**Evidence:** [index.html](index.html).

The page has language, viewport, title, description, and font preconnects. It has no favicon, Open Graph/Twitter preview metadata, or canonical URL. Essential content is rendered client-side into an initially empty root, which can limit previews and crawlers that do not execute JavaScript.

**Fix:** Add an appropriate icon and social preview metadata. Set a canonical only after the deployment URL is known. Consider prerendering if search discovery is important. Missing metadata is confirmed; actual indexing was not measured.

## Responsive and usability risks requiring visual verification

These are supported by implementation details but were not reproduced in a browser.

| ID | Priority | Evidence and risk | Suggested remedy |
| --- | --- | --- | --- |
| R01 | High | Hero's nine-letter second line uses `15vw` display text plus up to `9vw` left padding, with no fitting logic. `overflow-x: clip` can hide overflow rather than correct it. See `Hero.jsx:71,86`. | Fit text to available width; verify with the actual loaded font and fallback fonts at every target width. |
| R02 | High | Project cards use `h-[min(66svh,35rem)]` and `overflow-hidden`, while metadata has fixed padding and wrapping text/tags. Short landscape viewports or text zoom can leave too little space. See `WorkSection.jsx:109`. | Allow content-driven height or a stacked layout for small/short screens. |
| R03 | Medium | Skills radius has a minimum of 200px and otherwise depends on label width, without a viewport-width cap; back faces are hidden. See `SkillsRing.jsx:12–21` and `src/index.css:276`. | Provide a readable static grid/list on small screens; inspect clipping, overlap, and full skill discoverability. |
| R04 | Medium | Footer links use a non-wrapping inner flex row with 24px gaps, despite the outer footer wrapping. See `ContactSection.jsx:105`. | Let the inner links wrap/stack and check at 320px and text zoom. |
| R05 | Medium | Work scrolling uses `window.innerHeight` to calculate pin distance, while sticky height uses `100svh`. Mobile browser toolbar changes can make those values differ. | Use consistent viewport measurements and verify first/last card alignment during toolbar and orientation changes. |
| R06 | Medium | Fixed header and section anchors have no active `scroll-margin-top`/`scroll-padding-top`. Work begins with a viewport-pinned region. | Verify anchor destinations are visible beneath the header; add offsets where needed. |
| R07 | Medium | Main project browsing requires a long vertical scroll translated into horizontal movement, with no next/previous control or direct card navigation. | Test keyboard and touch browsing; consider native horizontal scrolling, explicit controls, and a mobile vertical layout. |
| R08 | Medium | Active CSS does not carry over the legacy custom `focus-visible` styling. Browser default outlines may remain, but visibility against translucent surfaces has not been verified. | Test the complete Tab path and add consistent visible focus styles plus a skip-to-main link. |

## Build and performance observations

| Built asset | Raw size | Gzip size |
| --- | ---: | ---: |
| Application JavaScript | 47.54 kB | 13.89 kB |
| React vendor JavaScript | 141.74 kB | 45.48 kB |
| Three.js JavaScript | 466.93 kB | 116.89 kB |
| CSS | 31.16 kB | 7.13 kB |
| Portrait JPEG | 342.54 kB | Not reported |

The three JavaScript chunks total approximately **656.21 kB raw / 176.26 kB gzip**. Background3D is imported eagerly, so a separate Three.js chunk alone does not defer its loading. Consider lazy-loading the decorative background or a lightweight fallback after profiling. Actual transfer sizes depend on hosting compression and caching.

The installed Three.js geometry was directly instantiated to check its size: `IcosahedronGeometry(1.5, 8)` produces **1,620 triangles**. It is not an enormous exponential geometry in this installed version, so excessive polygon count is not a finding. Full-screen rendering, device pixel ratio up to 2, repeated layout work, and continuous animation still need device profiling.

This repository is a portfolio frontend. No backend/API implementation exists in the reviewed files. That is not inherently a defect for a static portfolio; project descriptions do not establish that those applications are included here.

## What is already sound

- Production compilation and local HTTP serving work.
- Semantic sections, headings, a main landmark, a labeled primary nav, and portrait alt text are present.
- Theme toggle has an accessible label, and the email link has an explicit accessible name.
- External links use `rel="noopener noreferrer"` with `target="_blank"`.
- Decorative canvas, marquee, cursor, and progress indicator are hidden from assistive technology.
- Many listeners and main animation frames already have cleanup; the gaps are specific to the findings above.
- The portrait wrapper reserves its aspect ratio, and project/skill content is stored separately from components.

## Recommended implementation order

1. Fix theme opacity token generation and primary-button contrast.
2. Add mobile navigation and reduced-motion alternatives; keep About text readable.
3. Correct clipboard feedback and the dragging instruction; add project destinations.
4. Resolve responsive risks using real desktop/mobile screenshots and keyboard testing.
5. Stabilize the WebGL scene, complete cleanup, and reduce repeated layout work.
6. Add focused quality checks, document the active code path, optimize assets, and improve sharing metadata.

## Follow-up acceptance checklist

- [ ] Desktop: 1280×800, 1440×900, and a wide display; both themes.
- [ ] Mobile: 320×568, 375×667, 390×844, and 430×932; both themes.
- [ ] Tablet: around 768px and 1024px; verify header content fits.
- [ ] Landscape/short viewport: e.g. 844×390; all project descriptions and tags remain visible.
- [ ] Browser zoom/text scaling: 200%; no hidden essential content.
- [ ] Keyboard: full Tab order, visible focus, menu operation, section navigation, clipboard action.
- [ ] Reduced motion: static readable content and no unnecessary continuous animation.
- [ ] Clipboard: success, rejection, and unavailable API; truthful and announced status.
- [ ] Storage: absent/invalid value and storage denial; application still renders.
- [ ] Theme persistence: reload in light mode and repeated toggles without scene reset.
- [ ] Work section: first and last cards reachable using keyboard/touch; orientation changes preserve access.
- [ ] Fonts: inspect loaded and fallback fonts; hero and footer do not clip.
- [ ] WebGL unavailable/context loss: content stays usable; no uncaught initialization errors.
- [ ] Chrome, Firefox, and Safari/iOS: rendering and interaction verification.
- [ ] Browser console/network: no application errors, failed assets, or missing project destinations.
- [ ] Performance: collect Lighthouse/Core Web Vitals and frame profiles before setting optimization targets.
- [ ] Security: run a current dependency advisory audit and inspect production headers separately.

**Review status:** Source/build review complete. Visual, cross-browser, accessibility-tool, and device-performance verification remain outstanding; this report does not claim those checks passed.
