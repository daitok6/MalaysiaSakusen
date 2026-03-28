# Full 3D Playground Redesign — Malaysia Sakusen

**Date:** 2026-03-29
**Status:** Draft
**Theme:** Playful & personal couple's relocation adventure with full interactive 3D

## Goals

- Transform the current flat, text-heavy tracker into an immersive 3D playground
- Each page has its own interactive Spline 3D scene
- Maintain bilingual JP/EN support throughout
- Lightweight enough for mobile with graceful degradation
- Evolve the existing pastel palette with deeper accents and glassmorphism

## Constraints

- Performance-conscious: lazy-load all 3D, pause off-screen scenes
- Mobile-first degradation: Nano Banana-generated illustrations replace runtime 3D on mobile (<768px) and when `prefers-reduced-motion` is set
- Existing data layer (Vercel KV, API routes) stays unchanged — this is a frontend-only redesign
- Keep all existing functionality intact (task CRUD, savings tracking, visa timeline, filters, currency/locale switching)

## Tech Stack Additions

| Package | Purpose | Size |
|---------|---------|------|
| `@splinetool/react-spline` | Embed interactive 3D Spline scenes | ~45KB gzip |
| Spline `.splinecode` files (5) | Per-page 3D scenes, loaded on-demand | ~200-500KB each |

No three.js or heavy 3D libraries. Spline handles rendering internally.

## Architecture

### 3D Scene Strategy

Each page gets a dedicated Spline scene, lazy-loaded via `React.lazy` + `Suspense`:

| Page | 3D Scene | Interaction |
|------|----------|-------------|
| Dashboard | Spinning globe with Tokyo to KL arc + orbiting airplane | Drag to rotate, auto-spins |
| Summary | Two low-poly mascot characters on a progress podium | Idle bounce, celebrate when progress >80% |
| Checklist | Floating clipboard with checkmarks that pop off | Hover to tilt |
| Finances | Piggy bank that fills based on savings % | Click to drop coin |
| Visa | Passport with stamps for completed phases | Flip open on scroll |

### Performance Guardrails

- `React.lazy` + `Suspense` with skeleton fallback for all Spline scenes
- `IntersectionObserver` to call `.pause()` / `.play()` on off-screen scenes
- `prefers-reduced-motion` media query: disable all animations, show static Nano Banana images
- Mobile (<768px): static illustrated fallback images instead of runtime 3D
- Only one Spline scene active at a time (page-level code splitting)

## Layout & Visual Design

### Overall Layout

- Full-width layout with `max-w-6xl` content container (up from `max-w-5xl`)
- Hero sections go edge-to-edge with 3D scene as background/centerpiece
- Below hero: asymmetric bento grid with mixed card sizes (not uniform)

### Navigation

- Sticky top bar with glassmorphism: `backdrop-blur-xl bg-card/40 border-b border-white/10`
- Logo "saku" becomes a small 3D rotating cube
- Mobile bottom nav: floating pill style, detached from edges, rounded with blur background

### Card System

- Flat `.bento` cards replaced with glassmorphic cards:
  - `bg-white/60 backdrop-blur-md border border-white/20 shadow-xl`
- 3D tilt on hover via CSS `perspective(1000px) rotateX/Y` (mouse-tracked, no library)
- Depth layering: hero 3D at z-0, floating stat cards at z-10 with scroll parallax

### Color Evolution

Current pastel palette retained with additions:
- New primary accent: `#6C63FF` (deeper purple) for interactive elements
- Extended gradients: `from-lavender/20 via-transparent to-coral/10`
- Card borders: `border-white/20` for glass effect (replacing solid `border-border`)
- Background: soft radial gradient with subtle animated CSS grain texture (replacing flat `#FBF8F4`)

### Typography

- Hero titles: `text-5xl md:text-7xl` with gradient text fills via `bg-clip-text`
- Keep M PLUS Rounded 1c for Japanese text (suits playful tone)
- Nunito Sans continues as Latin font

## Page-by-Page Design

### Dashboard

- Full-viewport hero with 3D globe centered, gradient text overlay: "Tokyo to Kuala Lumpur"
- Countdown floats as glassmorphic card overlapping hero bottom edge
- Stats grid: 4 asymmetric bento cards with 3D tilt, savings card is 2x wide
- Current SVG flight path replaced entirely by the globe's arc
- Encouragement banner: floating with CSS-only animated sparkle particles

### Summary

- Hero: mascot pair on podium, overall completion % as massive gradient text behind them
- Big numbers grid: cards get depth, highest-progress card visually pops forward
- Milestones timeline: vertical path with mascots walking along it (position = current date)
- Action items: pulsing glow border when overdue tasks exist

### Checklist

- Hero: 3D clipboard floating with gentle wobble
- Category tabs: floating pill style with icons, horizontally scrollable
- Task cards: swipe-to-complete gesture on mobile + 3D checkmark pop animation
- Filter bar: collapsible drawer on mobile (replacing inline selects)

### Finances

- Hero: 3D piggy bank, fill level = savings percentage
- Savings progress: liquid fill animation inside glassmorphic container
- Income layer cards: stacked card layout that fans out / expands on tap
- Cost comparison: side-by-side animated bar race (Tokyo vs KL)

### Visa

- Hero: 3D passport that flips open, stamps appear for completed phases
- Timeline: vertical stepper with connecting fill line
- Document checklist: cards slide in from side with stagger
- Countdown: circular progress ring around the days number

## Interactions & Animation

### Scroll-Driven

- Hero 3D scenes: parallax at 0.5x scroll speed
- Cards: fade-in-up on `IntersectionObserver` intersection (replacing CSS-only `.stagger`)
- Section headings: slide in from left

### Hover/Touch Micro-Interactions

- Cards: 3D tilt via CSS perspective + rotateX/Y, mouse-position-tracked via `onMouseMove`
- Buttons: scale 1.02x + shadow deepen
- Pills/badges: bounce on first appearance
- Nav items: underline slides in from left

### 3D Scene Interactions

- Globe: drag rotate, auto-rotate idle, airplane follows arc
- Piggy bank: click = coin drop + bounce
- Passport: scroll = flip open, stamps pop in
- Clipboard: checkmarks detach and float away on task completion
- Mascots: idle breathing, wave on load, jump celebration when progress >80%

### Page Transitions

- CSS `@view-transition` with subtle fade (graceful fallback to instant swap)

## Mobile Strategy

- Breakpoint: 768px
- Below 768px: all Spline scenes replaced with Nano Banana-generated static illustrations
- Bottom nav: floating pill bar with blur
- Task cards: swipe gestures for status changes
- Filter bar: collapsible drawer
- Cards: tilt disabled (touch-only), tap feedback instead
- All animations respect `prefers-reduced-motion`

## MCP Tool Usage Plan

| Tool | Purpose |
|------|---------|
| Stitch | Generate screen layouts, apply design system, create hero patterns |
| Nano Banana | Generate mobile fallback illustrations for each page's 3D scene |
| 21st.dev (manual) | Source Globe and other 3D-compatible components |

## Files to Create/Modify

### New Files
- `components/spline-scene.tsx` — Lazy-loaded Spline wrapper with fallback
- `components/tilt-card.tsx` — Glassmorphic card with 3D tilt
- `components/floating-nav.tsx` — Mobile floating pill nav
- `components/parallax-hero.tsx` — Full-width hero with parallax 3D scene
- `components/liquid-progress.tsx` — Animated liquid fill progress
- `components/circular-progress.tsx` — Ring progress for visa countdown
- `public/scenes/*.splinecode` — 5 Spline scene files
- `public/illustrations/*.png` — 5 Nano Banana mobile fallback images

### Modified Files
- `app/globals.css` — Glassmorphism utilities, grain texture, gradient backgrounds, updated card styles
- `app/layout.tsx` — Full-width layout, updated container
- `app/page.tsx` — Dashboard hero + globe + redesigned stat grid
- `app/summary/page.tsx` — Mascot hero + redesigned sections
- `app/checklist/page.tsx` — Clipboard hero + pill tabs + swipe cards
- `app/finances/page.tsx` — Piggy bank hero + liquid progress + bar race
- `app/visa/page.tsx` — Passport hero + stepper timeline + ring progress
- `components/app-shell.tsx` — Updated container width
- `components/nav.tsx` — Glassmorphism + floating mobile nav
- `components/countdown.tsx` — Floating overlap card treatment
- `components/encouragement-banner.tsx` — Sparkle particles
- `components/flight-path.tsx` — Removed (replaced by globe)
- `components/stat-card.tsx` — Glassmorphic + tilt
- `components/task-card.tsx` — Swipe gesture + 3D check animation
- `components/progress-bar.tsx` — Updated styling
- `components/cost-comparison.tsx` — Animated bar race
- `components/visa-timeline.tsx` — Vertical stepper redesign
- `components/document-checklist.tsx` — Slide-in animation

## Out of Scope

- Backend/API changes
- New pages or routes
- Data model changes
- Authentication
- Dark mode (can be added later)
