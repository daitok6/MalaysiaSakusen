# Full 3D Playground Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the flat Malaysia Sakusen tracker into an immersive 3D playground with per-page Spline scenes, glassmorphic cards, and playful micro-interactions.

**Architecture:** Each page gets a lazy-loaded Spline 3D scene wrapped in a shared component that handles fallbacks (static images on mobile, skeleton on load). The existing card system is replaced with glassmorphic tilt cards. Layout expands to full-width heroes with asymmetric bento grids below. All existing data/API logic stays untouched.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, @splinetool/react-spline, Spline .splinecode scene files, Nano Banana (MCP) for mobile fallback illustrations, Stitch (MCP) for layout patterns.

**Spec:** `docs/superpowers/specs/2026-03-29-full-3d-redesign-design.md`

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `components/spline-scene.tsx` | Lazy-loaded Spline wrapper with mobile fallback and IntersectionObserver pause/play |
| `components/tilt-card.tsx` | Glassmorphic card with CSS perspective 3D tilt on mouse move |
| `components/parallax-hero.tsx` | Full-width hero section with parallax 3D scene and gradient text overlay |
| `components/floating-nav.tsx` | Mobile floating pill bottom nav with blur background |
| `components/liquid-progress.tsx` | Animated liquid-fill progress bar for finances |
| `components/circular-progress.tsx` | Ring/circle progress for visa countdown |
| `public/scenes/globe.splinecode` | Dashboard 3D globe scene (created in Spline editor) |
| `public/scenes/mascots.splinecode` | Summary mascot pair scene |
| `public/scenes/clipboard.splinecode` | Checklist floating clipboard scene |
| `public/scenes/piggybank.splinecode` | Finances piggy bank scene |
| `public/scenes/passport.splinecode` | Visa passport scene |
| `public/illustrations/globe.png` | Mobile fallback for dashboard |
| `public/illustrations/mascots.png` | Mobile fallback for summary |
| `public/illustrations/clipboard.png` | Mobile fallback for checklist |
| `public/illustrations/piggybank.png` | Mobile fallback for finances |
| `public/illustrations/passport.png` | Mobile fallback for visa |

### Modified Files

| File | Changes |
|------|---------|
| `app/globals.css` | Add glassmorphism utilities, grain texture, gradient bg, updated card/pill styles, tilt utilities |
| `app/layout.tsx` | Full-width container update |
| `app/page.tsx` | Parallax globe hero, glassmorphic stat cards, redesigned layout |
| `app/summary/page.tsx` | Mascot hero, depth cards, glowing action items |
| `app/checklist/page.tsx` | Clipboard hero, floating pill tabs, swipe task cards |
| `app/finances/page.tsx` | Piggy bank hero, liquid progress, animated bar race |
| `app/visa/page.tsx` | Passport hero, vertical stepper, circular countdown |
| `components/app-shell.tsx` | Updated max-width to 6xl |
| `components/nav.tsx` | Glassmorphism header, integrate floating-nav for mobile |
| `components/stat-card.tsx` | Replace with tilt-card based glassmorphic version |
| `components/countdown.tsx` | Floating overlap card treatment |
| `components/encouragement-banner.tsx` | CSS sparkle particles |
| `components/progress-bar.tsx` | Updated gradient styling |
| `components/task-card.tsx` | Glassmorphic + swipe gesture |
| `components/cost-comparison.tsx` | Animated bar race layout |
| `components/visa-timeline.tsx` | Vertical stepper with fill line |
| `components/document-checklist.tsx` | Slide-in stagger animation |
| `components/checkpoint-gate.tsx` | Glassmorphic card treatment |
| `components/savings-table.tsx` | Glassmorphic card treatment |

### Deleted Files

| File | Reason |
|------|--------|
| `components/flight-path.tsx` | Replaced by 3D globe on dashboard |

---

## Task 1: Install Dependencies & Generate Assets via MCPs

**Files:**
- Modify: `package.json`
- Create: `public/illustrations/globe.png`
- Create: `public/illustrations/mascots.png`
- Create: `public/illustrations/clipboard.png`
- Create: `public/illustrations/piggybank.png`
- Create: `public/illustrations/passport.png`
- Create: `public/scenes/` (directory)

- [ ] **Step 1: Install @splinetool/react-spline**

```bash
cd /Users/Daito/repos/MalaysiaSakusen
npm install @splinetool/react-spline @splinetool/runtime
```

Expected: packages added to package.json dependencies.

- [ ] **Step 2: Create scenes and illustrations directories**

```bash
mkdir -p public/scenes public/illustrations
```

- [ ] **Step 3: Generate mobile fallback illustrations via Nano Banana**

Use the `mcp__nano-banana-2__generate_image` tool to create 5 illustrations. For each, use a kawaii/cute illustration style matching the pastel palette.

Prompts:
1. **Globe**: "Cute kawaii illustration of a small globe showing Southeast Asia, with a tiny airplane flying from Japan to Malaysia, pastel lavender and mint colors, soft rounded style, transparent background"
2. **Mascots**: "Two cute kawaii chibi characters, a boy and girl couple, standing on a small podium celebrating, pastel colors lavender coral mint, soft rounded style, transparent background"
3. **Clipboard**: "Cute kawaii floating clipboard with colorful checkmarks popping off, pastel colors, soft rounded illustration style, transparent background"
4. **Piggy bank**: "Cute kawaii pastel pink piggy bank with golden coins floating around it, soft rounded illustration style, marigold and coral colors, transparent background"
5. **Passport**: "Cute kawaii Malaysia passport with colorful stamps floating around it, pastel lavender and sky blue, soft rounded illustration style, transparent background"

Save each to `public/illustrations/{name}.png`.

- [ ] **Step 4: Create placeholder Spline scene files**

For now, create a note file explaining Spline scenes need to be authored in the Spline editor:

```bash
cat > public/scenes/README.md << 'EOF'
# Spline 3D Scenes

These .splinecode files must be created in the Spline editor (https://spline.design/).

Required scenes:
1. globe.splinecode - Spinning earth with Tokyo->KL arc and orbiting airplane
2. mascots.splinecode - Two low-poly chibi characters on a podium
3. clipboard.splinecode - Floating clipboard with detachable checkmarks
4. piggybank.splinecode - Piggy bank with coin-drop interaction
5. passport.splinecode - Passport that flips open with stamp animations

Each scene should:
- Use pastel colors matching the app palette (lavender #B8B5FF, mint #A7E8BD, coral #FFB5A7, marigold #FFD6A5)
- Be optimized for web (< 500KB per scene)
- Support mouse/touch interaction events
- Have a camera angle suitable for a hero section backdrop
EOF
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json public/scenes/README.md public/illustrations/
git commit -m "chore: install spline runtime and generate mobile fallback illustrations"
```

---

## Task 2: Update Global CSS — Glassmorphism, Grain Texture, New Utilities

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new color tokens and background gradient**

In `app/globals.css`, inside the `@theme inline` block, add after the existing `--color-blush-foreground` line:

```css
  /* ── Deep accent ────────────────────────────────────── */
  --color-deep-purple: #6C63FF;
  --color-deep-purple-foreground: #FFFFFF;
```

- [ ] **Step 2: Replace the body background and add grain texture**

Replace the existing `@layer base` block with:

```css
@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    @apply text-foreground font-sans;
    font-feature-settings: "palt";
    line-height: 1.8;
    background: radial-gradient(ellipse at 20% 0%, rgba(184, 181, 255, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(167, 232, 189, 0.06) 0%, transparent 50%),
                #FBF8F4;
    min-height: 100vh;
  }
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
  * {
    @apply border-border outline-ring/50;
  }
}
```

- [ ] **Step 3: Add glassmorphism card classes**

Add after the existing `.bento` class:

```css
/* ── Glassmorphic card ───────────────────────────────── */
.glass {
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(139, 133, 193, 0.08);
}

.glass-strong {
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(139, 133, 193, 0.12);
}
```

- [ ] **Step 4: Add 3D tilt utility classes**

```css
/* ── 3D tilt card ────────────────────────────────────── */
.tilt-card {
  transform-style: preserve-3d;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}
.tilt-card:hover {
  box-shadow: 0 20px 60px rgba(139, 133, 193, 0.15);
}

/* ── Parallax hero ───────────────────────────────────── */
.parallax-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallax-hero .hero-bg {
  position: absolute;
  inset: -10%;
  z-index: 0;
}

.parallax-hero .hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

/* ── Gradient text ───────────────────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, var(--color-deep-purple), var(--color-lavender), var(--color-mint));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Floating animation ──────────────────────────────── */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* ── Sparkle particles ───────────────────────────────── */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}
.sparkle::before,
.sparkle::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-marigold);
}
.sparkle::before {
  top: 10%;
  left: 20%;
  animation: sparkle 2s ease-in-out infinite;
}
.sparkle::after {
  bottom: 20%;
  right: 15%;
  animation: sparkle 2.5s ease-in-out 0.5s infinite;
}

/* ── Glow border (for urgent items) ──────────────────── */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 181, 167, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 181, 167, 0.6); }
}
.glow-coral {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* ── Slide-in from left ──────────────────────────────── */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.slide-in-left {
  animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* ── Bounce-in for pills ─────────────────────────────── */
@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
.bounce-in {
  animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

- [ ] **Step 5: Update the card-hover class for deeper shadows**

Replace the existing `.card-hover:hover` block:

```css
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(139, 133, 193, 0.14);
}
```

- [ ] **Step 6: Update progress bar fill for new gradient**

Replace the existing `.progress-striped .progress-fill`:

```css
.progress-striped .progress-fill {
  background: linear-gradient(90deg, var(--color-deep-purple), var(--color-lavender), var(--color-mint));
}
```

- [ ] **Step 7: Add reduced motion coverage for new animations**

Add to the existing `@media (prefers-reduced-motion: reduce)` block:

```css
  .animate-float,
  .sparkle::before,
  .sparkle::after,
  .glow-coral,
  .slide-in-left,
  .bounce-in,
  .tilt-card {
    animation: none;
    opacity: 1;
    transform: none;
    transition: none;
  }
```

- [ ] **Step 8: Verify build compiles**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

Expected: build succeeds with no CSS errors.

- [ ] **Step 9: Commit**

```bash
git add app/globals.css
git commit -m "style: add glassmorphism, grain texture, tilt, sparkle, and glow utilities"
```

---

## Task 3: Build SplineScene Component

**Files:**
- Create: `components/spline-scene.tsx`

- [ ] **Step 1: Create the SplineScene component**

```tsx
"use client";

import { Suspense, lazy, useRef, useEffect, useState } from "react";
import type { SPESceneExportedType } from "@splinetool/react-spline";

const Spline = lazy(() => import("@splinetool/react-spline"));

type SplineSceneProps = {
  sceneUrl: string;
  fallbackSrc: string;
  fallbackAlt: string;
  className?: string;
  onLoad?: (spline: SPESceneExportedType) => void;
};

export function SplineScene({
  sceneUrl,
  fallbackSrc,
  fallbackAlt,
  className = "",
  onLoad,
}: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<SPESceneExportedType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Pause/play when off-screen
  useEffect(() => {
    if (isMobile || prefersReducedMotion || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (splineRef.current) {
          if (entry.isIntersecting) {
            splineRef.current.play?.();
          } else {
            splineRef.current.pause?.();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, prefersReducedMotion]);

  const handleLoad = (spline: SPESceneExportedType) => {
    splineRef.current = spline;
    onLoad?.(spline);
  };

  // Show static fallback on mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return (
      <div ref={containerRef} className={className}>
        <img
          src={fallbackSrc}
          alt={fallbackAlt}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
          </div>
        }
      >
        <Spline scene={sceneUrl} onLoad={handleLoad} />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npx tsc --noEmit
```

Expected: no type errors (Spline types may need `@ts-expect-error` if the package types are loose — adjust if needed).

- [ ] **Step 3: Commit**

```bash
git add components/spline-scene.tsx
git commit -m "feat: add SplineScene component with lazy loading and mobile fallback"
```

---

## Task 4: Build TiltCard Component

**Files:**
- Create: `components/tilt-card.tsx`

- [ ] **Step 1: Create the TiltCard component**

```tsx
"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
};

export function TiltCard({ children, className = "", tiltDegree = 8 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * tiltDegree}deg) rotateX(${-y * tiltDegree}deg) translateY(-4px)`;
    },
    [tiltDegree]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/tilt-card.tsx
git commit -m "feat: add TiltCard glassmorphic component with 3D mouse tilt"
```

---

## Task 5: Build ParallaxHero Component

**Files:**
- Create: `components/parallax-hero.tsx`

- [ ] **Step 1: Create the ParallaxHero component**

```tsx
"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { SplineScene } from "./spline-scene";

type ParallaxHeroProps = {
  sceneUrl: string;
  fallbackSrc: string;
  fallbackAlt: string;
  children: ReactNode;
};

export function ParallaxHero({
  sceneUrl,
  fallbackSrc,
  fallbackAlt,
  children,
}: ParallaxHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="parallax-hero">
      <div ref={bgRef} className="hero-bg">
        <SplineScene
          sceneUrl={sceneUrl}
          fallbackSrc={fallbackSrc}
          fallbackAlt={fallbackAlt}
          className="w-full h-full"
        />
      </div>
      <div className="hero-content">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/parallax-hero.tsx
git commit -m "feat: add ParallaxHero component with scroll parallax and Spline scene"
```

---

## Task 6: Build FloatingNav, LiquidProgress, CircularProgress Components

**Files:**
- Create: `components/floating-nav.tsx`
- Create: `components/liquid-progress.tsx`
- Create: `components/circular-progress.tsx`

- [ ] **Step 1: Create FloatingNav**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "./locale-provider";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  FileCheck,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/", key: "nav.dashboard", Icon: LayoutDashboard },
  { href: "/summary", key: "nav.summary", Icon: BarChart3 },
  { href: "/checklist", key: "nav.checklist", Icon: ClipboardList },
  { href: "/finances", key: "nav.finances", Icon: Wallet },
  { href: "/visa", key: "nav.visa", Icon: FileCheck },
];

export function FloatingNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="flex items-center justify-around py-2 px-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg shadow-lavender/10">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active
                  ? "bg-lavender/20 text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <item.Icon size={18} strokeWidth={active ? 2.2 : 1.5} />
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create LiquidProgress**

```tsx
type LiquidProgressProps = {
  value: number; // 0-100
  label?: string;
  className?: string;
};

export function LiquidProgress({ value, label, className = "" }: LiquidProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`glass ${className}`}>
      {label && (
        <div className="flex justify-between text-sm mb-3">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground text-xs font-bold tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="relative h-6 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${clamped}%`,
            background: "linear-gradient(90deg, #6C63FF, #B8B5FF, #A7E8BD)",
          }}
        />
        {/* Animated wave overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 Q25 6 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 V24 H0 Z"
            fill="rgba(255,255,255,0.2)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-50,0;0,0;-50,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CircularProgress**

```tsx
type CircularProgressProps = {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  children,
  className = "",
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#circularGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#A7E8BD" />
          </linearGradient>
        </defs>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/floating-nav.tsx components/liquid-progress.tsx components/circular-progress.tsx
git commit -m "feat: add FloatingNav, LiquidProgress, and CircularProgress components"
```

---

## Task 7: Redesign Navigation — Glassmorphism Header + Floating Mobile Nav

**Files:**
- Modify: `components/nav.tsx`
- Modify: `components/app-shell.tsx`

- [ ] **Step 1: Update Nav header to glassmorphism**

In `components/nav.tsx`, replace the `<header>` opening tag class:

Old:
```tsx
<header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
```

New:
```tsx
<header className="sticky top-0 z-50 border-b border-white/15 bg-white/50 backdrop-blur-xl">
```

- [ ] **Step 2: Remove the mobile bottom nav from Nav**

In `components/nav.tsx`, delete the entire `{/* Mobile bottom nav */}` section (the `<nav className="md:hidden flex border-t border-border">` block and everything inside it).

- [ ] **Step 3: Update AppShell to include FloatingNav and widen container**

In `components/app-shell.tsx`, add the import:

```tsx
import { FloatingNav } from "./floating-nav";
```

Replace the return JSX:

```tsx
return (
  <LocaleProvider>
    <CurrencyProvider>
      <Nav userName={user} />
      <UserPickerModal
        userNames={userNames}
        onSelect={selectUser}
        open={!user}
      />
      <main className="container mx-auto px-6 py-10 max-w-6xl">{children}</main>
      <FloatingNav />
    </CurrencyProvider>
  </LocaleProvider>
);
```

(Changed `max-w-5xl` to `max-w-6xl` and added `<FloatingNav />`.)

- [ ] **Step 4: Verify dev server renders correctly**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/nav.tsx components/app-shell.tsx
git commit -m "feat: glassmorphic nav header and floating mobile bottom nav"
```

---

## Task 8: Redesign Dashboard Page

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/stat-card.tsx`
- Modify: `components/countdown.tsx`
- Modify: `components/encouragement-banner.tsx`
- Delete: `components/flight-path.tsx`

- [ ] **Step 1: Update StatCard to glassmorphic tilt**

Replace the entire content of `components/stat-card.tsx`:

```tsx
"use client";

import { TiltCard } from "./tilt-card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  Icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  subtitle?: string;
  color?: string;
  className?: string;
};

export function StatCard({ Icon, label, value, subtitle, color = "lavender", className = "" }: StatCardProps) {
  return (
    <TiltCard className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold tracking-tight mt-1.5">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-${color}/20 flex items-center justify-center`}>
          <Icon size={20} className={`text-${color}-foreground`} />
        </div>
      </div>
    </TiltCard>
  );
}
```

- [ ] **Step 2: Update Countdown to floating overlap card**

Replace the entire content of `components/countdown.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useLocale } from "./locale-provider";
import { Plane } from "lucide-react";

const TARGET_DATE = new Date("2026-11-01");

export function Countdown() {
  const [days, setDays] = useState<number | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();
    setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  if (days === null) return null;

  return (
    <div className="glass-strong card-hover text-center animate-float">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Plane size={16} className="text-deep-purple" />
        <p className="text-xs text-muted-foreground font-medium">{t("dashboard.countdown.label")}</p>
      </div>
      <p className="text-5xl font-bold tracking-tighter gradient-text">{days}</p>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
        {days > 200
          ? t("dashboard.countdown.plenty")
          : days > 100
          ? t("dashboard.countdown.halfway")
          : days > 30
          ? t("dashboard.countdown.close")
          : t("dashboard.countdown.almost")}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Update EncouragementBanner with sparkle particles**

Replace the entire content of `components/encouragement-banner.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { encouragements } from "@/lib/encouragements";
import { useLocale } from "./locale-provider";
import { Sparkles } from "lucide-react";

export function EncouragementBanner() {
  const [message, setMessage] = useState("");
  const { locale } = useLocale();

  useEffect(() => {
    const msgs = encouragements[locale];
    const idx = Math.floor(Math.random() * msgs.length);
    setMessage(msgs[idx]);
  }, [locale]);

  if (!message) return null;

  return (
    <div className="glass card-hover text-center relative sparkle overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(135deg, rgba(255,214,165,0.3) 0%, rgba(255,181,167,0.2) 50%, rgba(184,181,255,0.3) 100%)",
        }}
      />
      <div className="relative flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-marigold-foreground" />
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Redesign dashboard page with parallax hero**

Replace the entire content of `app/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { Countdown } from "@/components/countdown";
import { StatCard } from "@/components/stat-card";
import { EncouragementBanner } from "@/components/encouragement-banner";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { useLocale } from "@/components/locale-provider";
import { CheckCircle2, PiggyBank, FileCheck, Clock, AlertTriangle } from "lucide-react";
import type { Task, SavingsEntry, VisaStep } from "@/lib/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [visaSteps, setVisaSteps] = useState<VisaStep[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/savings").then((r) => r.json()),
      fetch("/api/visa").then((r) => r.json()),
    ])
      .then(([tasksData, savingsData, visaData]) => {
        setTasks(tasksData);
        setSavings(savingsData);
        setVisaSteps(visaData.steps || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const taskPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsTarget = 1200000;
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const completedVisaSteps = visaSteps.filter((s) => s.status === "completed").length;
  const visaPercent = visaSteps.length > 0 ? Math.round((completedVisaSteps / visaSteps.length) * 100) : 0;

  const currentPhase = visaSteps.find((s) => s.status === "in_progress")?.phase ?? "A";
  const phaseKeys: Record<string, string> = {
    A: "visa.phase.a",
    B: "visa.phase.b",
    C: "visa.phase.c",
    D: "visa.phase.d",
  };

  const upcoming = tasks
    .filter((task) => task.status !== "done" && task.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Parallax Hero with 3D Globe */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/globe.splinecode"
          fallbackSrc="/illustrations/globe.png"
          fallbackAlt="3D Globe showing Tokyo to KL route"
        >
          <div className="space-y-4 px-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter gradient-text">
              {t("dashboard.hero.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              だいと＆こうめ — 東京 → クアラルンプール
            </p>
          </div>
        </ParallaxHero>
      </div>

      {/* Floating Countdown overlapping hero */}
      <div className="-mt-16 relative z-20 max-w-sm mx-auto">
        <Countdown />
      </div>

      {/* Stats Grid — asymmetric bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard
          Icon={CheckCircle2}
          label={t("dashboard.stats.tasks")}
          value={`${taskPercent}%`}
          subtitle={`${doneTasks} / ${totalTasks}`}
          color="mint"
        />
        <StatCard
          Icon={PiggyBank}
          label={t("dashboard.stats.savings")}
          value={<Money amount={currentSavings} from="JPY" />}
          subtitle={t("dashboard.stats.savingsTarget")}
          color="marigold"
          className="md:col-span-2 lg:col-span-2"
        />
        <StatCard
          Icon={FileCheck}
          label={t("dashboard.stats.visa")}
          value={`${t("dashboard.stats.phase")} ${currentPhase}`}
          subtitle={`${t(phaseKeys[currentPhase])} · ${visaPercent}%`}
          color="lavender"
        />
      </div>

      {/* Progress */}
      <div className="glass space-y-5">
        <ProgressBar value={taskPercent} label={t("dashboard.progress.overall")} />
        <ProgressBar value={savingsPercent} label={t("dashboard.progress.savings")} />
        <ProgressBar value={visaPercent} label={t("dashboard.progress.visa")} />
      </div>

      <EncouragementBanner />

      {/* Upcoming Deadlines */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("dashboard.deadlines.title")}</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("dashboard.deadlines.empty")}</p>
        ) : (
          <div className="space-y-2 stagger">
            {upcoming.map((task) => (
              <div
                key={task.id}
                className="glass card-hover flex items-center justify-between !py-3 !px-4"
              >
                <div className="flex items-center gap-3">
                  <span className="pill pill-muted text-[11px] font-bold tabular-nums">{task.id}</span>
                  <div>
                    <p className="text-sm font-medium leading-relaxed">{task.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock size={11} />
                      {new Date(task.deadline!).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`pill bounce-in ${
                    task.priority === "critical"
                      ? "pill-coral"
                      : task.priority === "high"
                      ? "pill-marigold"
                      : "pill-muted"
                  }`}
                >
                  {t(`priority.${task.priority}`)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Remove flight-path.tsx**

```bash
rm components/flight-path.tsx
```

- [ ] **Step 6: Verify build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx components/stat-card.tsx components/countdown.tsx components/encouragement-banner.tsx
git rm components/flight-path.tsx
git commit -m "feat: redesign dashboard with parallax globe hero and glassmorphic cards"
```

---

## Task 9: Redesign Summary Page

**Files:**
- Modify: `app/summary/page.tsx`

- [ ] **Step 1: Redesign the Summary page**

Replace the entire content of `app/summary/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ParallaxHero } from "@/components/parallax-hero";
import { TiltCard } from "@/components/tilt-card";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { useLocale } from "@/components/locale-provider";
import {
  CheckCircle2, Circle, ArrowRight, AlertTriangle,
  CalendarDays, FileCheck, FolderOpen, Flag, CircleMinus,
} from "lucide-react";
import type { Task, SavingsEntry, VisaStep, TrackerDocument } from "@/lib/types";

type PhaseInfo = {
  key: string;
  periodKey: string;
  steps: VisaStep[];
};

export default function SummaryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [visaSteps, setVisaSteps] = useState<VisaStep[]>([]);
  const [documents, setDocuments] = useState<TrackerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/savings").then((r) => r.json()),
      fetch("/api/visa").then((r) => r.json()),
    ])
      .then(([tasksData, savingsData, visaData]) => {
        setTasks(tasksData);
        setSavings(savingsData);
        setVisaSteps(visaData.steps || []);
        setDocuments(visaData.documents || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const taskPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const categories = [
    { key: "visa", labelKey: "checklist.category.visa", tasks: tasks.filter((t) => t.category === "visa") },
    { key: "income", labelKey: "checklist.category.income", tasks: tasks.filter((t) => t.category === "income") },
    { key: "business", labelKey: "checklist.category.business", tasks: tasks.filter((t) => t.category === "business") },
    { key: "life", labelKey: "checklist.category.life", tasks: tasks.filter((t) => t.category === "life") },
    { key: "tech", labelKey: "checklist.category.tech", tasks: tasks.filter((t) => t.category === "tech") },
  ];

  const savingsTarget = 1200000;
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const completedVisaSteps = visaSteps.filter((s) => s.status === "completed").length;
  const visaPercent = visaSteps.length > 0 ? Math.round((completedVisaSteps / visaSteps.length) * 100) : 0;
  const docsReady = documents.filter((d) => d.status === "ready").length;

  const phases: PhaseInfo[] = [
    { key: "a", periodKey: "visa.phase.a.period", steps: visaSteps.filter((s) => s.phase === "A") },
    { key: "b", periodKey: "visa.phase.b.period", steps: visaSteps.filter((s) => s.phase === "B") },
    { key: "c", periodKey: "visa.phase.c.period", steps: visaSteps.filter((s) => s.phase === "C") },
    { key: "d", periodKey: "visa.phase.d.period", steps: visaSteps.filter((s) => s.phase === "D") },
  ];

  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "done"
  );
  const criticalPending = tasks.filter(
    (t) => t.priority === "critical" && t.status !== "done"
  );

  const milestones = [
    { date: "2026-04-15", en: "Register marriage", ja: "婚姻届提出" },
    { date: "2026-04-30", en: "First side income payment", ja: "初副収入" },
    { date: "2026-06-30", en: "¥225K savings milestone", ja: "貯金¥225K達成" },
    { date: "2026-08-01", en: "August checkpoint gate", ja: "8月チェックポイント" },
    { date: "2026-08-15", en: "Submit DE Rantau application", ja: "DE Rantau申請提出" },
    { date: "2026-09-15", en: "Visa approval expected", ja: "ビザ承認予定" },
    { date: "2026-10-15", en: "Submit resignation & 転出届", ja: "退職届・転出届提出" },
    { date: "2026-11-01", en: "Arrive in Kuala Lumpur!", ja: "クアラルンプール到着！" },
  ];

  const today = new Date();
  const nextMilestone = milestones.find((m) => new Date(m.date) > today);

  const pillColors = ["pill-lavender", "pill-mint", "pill-marigold", "pill-coral"];

  // Find the highest-progress stat for "pop forward" effect
  const statValues = [taskPercent, savingsPercent, visaPercent];
  const maxStatIdx = statValues.indexOf(Math.max(...statValues));

  return (
    <div className="space-y-10">
      {/* Mascot Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/mascots.splinecode"
          fallbackSrc="/illustrations/mascots.png"
          fallbackAlt="Mascot pair celebrating progress"
        >
          <div className="space-y-2 px-6">
            <p className="text-8xl md:text-9xl font-bold tracking-tighter gradient-text opacity-30">
              {taskPercent}%
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter gradient-text">
              {t("summary.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("summary.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Big Numbers — depth effect on highest */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        <TiltCard className={`text-center ${maxStatIdx === 0 ? "scale-105 shadow-xl" : ""}`}>
          <p className="text-4xl font-bold tracking-tighter gradient-text">{taskPercent}%</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.tasksComplete")}</p>
        </TiltCard>
        <TiltCard className={`text-center ${maxStatIdx === 1 ? "scale-105 shadow-xl" : ""}`}>
          <p className="text-4xl font-bold tracking-tighter gradient-text">{savingsPercent}%</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.savingsProgress")}</p>
        </TiltCard>
        <TiltCard className={`text-center ${maxStatIdx === 2 ? "scale-105 shadow-xl" : ""}`}>
          <p className="text-4xl font-bold tracking-tighter gradient-text">{visaPercent}%</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.visaProgress")}</p>
        </TiltCard>
        <TiltCard className="text-center">
          <p className="text-4xl font-bold tracking-tighter gradient-text">{docsReady}/{documents.length}</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.docsReady")}</p>
        </TiltCard>
      </div>

      {/* Checklist Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("summary.checklistBreakdown")}</h2>
          <Link href="/checklist" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {t("summary.viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="glass space-y-4">
          {categories.map((cat) => {
            const done = cat.tasks.filter((t) => t.status === "done").length;
            const percent = cat.tasks.length > 0 ? Math.round((done / cat.tasks.length) * 100) : 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{t(cat.labelKey)}</span>
                  <span className="text-muted-foreground text-xs font-bold tabular-nums">{done}/{cat.tasks.length}</span>
                </div>
                <ProgressBar value={percent} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Finances */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("summary.financesOverview")}</h2>
          <Link href="/finances" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {t("summary.viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TiltCard>
            <p className="text-xs text-muted-foreground font-medium">{t("summary.currentSavings")}</p>
            <p className="text-3xl font-bold tracking-tight mt-2">
              <Money amount={currentSavings} from="JPY" />
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("finances.target")} <Money amount={savingsTarget} from="JPY" />
            </p>
            <div className="mt-4">
              <ProgressBar value={savingsPercent} />
            </div>
          </TiltCard>
          <TiltCard>
            <p className="text-xs text-muted-foreground font-medium">{t("summary.augustCheckpoint")}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("finances.checkpoint.savings")}</span>
                {currentSavings >= 400000 ? (
                  <CheckCircle2 size={18} className="text-mint-foreground" />
                ) : (
                  <CircleMinus size={18} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("finances.checkpoint.income")}</span>
                <CircleMinus size={18} className="text-muted-foreground" />
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Visa Phases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("summary.visaPhases")}</h2>
          <Link href="/visa" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {t("summary.viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {phases.map((phase, i) => {
            const completed = phase.steps.filter((s) => s.status === "completed").length;
            const percent = phase.steps.length > 0 ? Math.round((completed / phase.steps.length) * 100) : 0;
            const isActive = phase.steps.some((s) => s.status === "in_progress");
            return (
              <TiltCard
                key={phase.key}
                className={isActive ? "border-lavender/50" : ""}
              >
                <span className={`pill bounce-in ${pillColors[i]}`}>{t(`visa.phase.${phase.key}`)}</span>
                <p className="text-xs text-muted-foreground mt-2">{t(phase.periodKey)}</p>
                <p className="text-2xl font-bold tracking-tighter mt-2 gradient-text">{percent}%</p>
                <p className="text-xs text-muted-foreground mt-1">{completed}/{phase.steps.length} {t("summary.stepsComplete")}</p>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 slide-in-left">
          <FolderOpen size={16} className="text-marigold-foreground" />
          <h2 className="text-lg font-bold tracking-tight">{t("summary.documentsStatus")}</h2>
        </div>
        <div className="glass">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc, i) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-sm truncate mr-3 leading-relaxed">{doc.name}</span>
                <span
                  className={`pill shrink-0 bounce-in ${
                    doc.status === "ready"
                      ? "pill-mint"
                      : doc.status === "in_progress"
                      ? "pill-sky"
                      : "pill-muted"
                  }`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {doc.status === "ready"
                    ? t("visa.docs.readyStatus")
                    : doc.status === "in_progress"
                    ? t("visa.docs.inProgress")
                    : t("visa.docs.notStarted")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 slide-in-left">
          <CalendarDays size={16} className="text-lavender-foreground" />
          <h2 className="text-lg font-bold tracking-tight">{t("summary.keyMilestones")}</h2>
        </div>
        <div className="glass">
          {milestones.map((m, i) => {
            const date = new Date(m.date);
            const isPast = date < today;
            const isNext = nextMilestone?.date === m.date;
            return (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-0">
                <div className="flex flex-col items-center shrink-0 w-12">
                  <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                    {date.toLocaleDateString("ja-JP", { month: "short" })}
                  </span>
                  <span className="text-sm font-bold tabular-nums">{date.getDate()}</span>
                </div>
                <div className={`flex-1 ${isPast ? "opacity-40" : ""}`}>
                  <p className="text-sm font-medium leading-relaxed">
                    {t("summary.locale") === "ja" ? m.ja : m.en}
                  </p>
                </div>
                {isPast ? (
                  <CheckCircle2 size={16} className="text-mint-foreground shrink-0" />
                ) : isNext ? (
                  <span className="pill pill-coral shrink-0 bounce-in">{t("summary.next")}</span>
                ) : (
                  <Circle size={16} className="text-muted-foreground/30 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      {(overdueTasks.length > 0 || criticalPending.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 slide-in-left">
            <Flag size={16} className="text-coral-foreground" />
            <h2 className="text-lg font-bold tracking-tight">{t("summary.actionItems")}</h2>
          </div>

          {overdueTasks.length > 0 && (
            <div className="glass glow-coral border-coral/30">
              <p className="flex items-center gap-1.5 text-xs text-coral-foreground font-bold mb-3">
                <AlertTriangle size={13} />
                {t("summary.overdue")}
              </p>
              <div className="space-y-2">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <span className="text-sm leading-relaxed">
                      <span className="text-xs text-muted-foreground mr-1.5 font-bold tabular-nums">{task.id}</span>
                      {task.title}
                    </span>
                    <span className="pill pill-coral text-[10px]">
                      {new Date(task.deadline!).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {criticalPending.length > 0 && (
            <div className="glass">
              <p className="text-xs text-muted-foreground font-bold mb-3">{t("summary.criticalPending")}</p>
              <div className="space-y-2">
                {criticalPending.slice(0, 8).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <span className="text-sm leading-relaxed">
                      <span className="text-xs text-muted-foreground mr-1.5 font-bold tabular-nums">{task.id}</span>
                      {task.title}
                    </span>
                    <span className={`pill bounce-in ${task.status === "in_progress" ? "pill-lavender" : "pill-muted"}`}>
                      {t(`status.${task.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/summary/page.tsx
git commit -m "feat: redesign summary page with mascot hero, tilt cards, and glow effects"
```

---

## Task 10: Redesign Checklist Page

**Files:**
- Modify: `app/checklist/page.tsx`
- Modify: `components/task-card.tsx`

- [ ] **Step 1: Update TaskCard to glassmorphic style**

Replace the entire content of `components/task-card.tsx`:

```tsx
"use client";

import { useLocale } from "./locale-provider";
import { AlertTriangle, Clock, Link2 } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";

const priorityPills: Record<string, string> = {
  critical: "pill-coral",
  high: "pill-marigold",
  medium: "pill-sky",
  low: "pill-muted",
};

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-lavender/30 text-lavender-foreground",
  done: "bg-mint/40 text-mint-foreground",
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const { t } = useLocale();
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";
  const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

  const statusLabels: Record<TaskStatus, string> = {
    todo: t("status.todo"),
    in_progress: t("status.in_progress"),
    done: t("status.done"),
  };

  return (
    <div className={`glass card-hover transition-all ${task.status === "done" ? "opacity-50" : ""} ${isOverdue ? "border-coral/50 glow-coral" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`pill bounce-in ${priorityPills[task.priority]}`}>
              {t(`priority.${task.priority}`)}
            </span>
            {task.assignee && (
              <span className="pill pill-blush bounce-in">{task.assignee}</span>
            )}
            {task.dependsOn && task.dependsOn.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Link2 size={11} />
                {task.dependsOn.join(", ")}
              </span>
            )}
          </div>
          <p className={`font-medium text-sm leading-relaxed ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
            <span className="text-muted-foreground mr-1.5 text-xs font-bold tabular-nums">{task.id}</span>
            {task.title}
          </p>
          {task.deadline && (
            <p className={`flex items-center gap-1 text-xs mt-1.5 ${isOverdue ? "text-coral-foreground font-medium" : "text-muted-foreground"}`}>
              {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
              {isOverdue ? t("task.overdue") + " " : t("task.due") + " "}
              {new Date(task.deadline).toLocaleDateString("ja-JP", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/20 shrink-0 backdrop-blur-sm">
          {statuses.map((s) => {
            const abbrevLabels: Record<TaskStatus, string> = {
              todo: "T",
              in_progress: "IP",
              done: "D",
            };
            return (
              <button
                key={s}
                onClick={() => onStatusChange(task.id, s)}
                className={`px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                  task.status === s ? statusStyles[s] : "hover:bg-white/30"
                }`}
              >
                <span className="sm:hidden">{abbrevLabels[s]}</span>
                <span className="hidden sm:inline">{statusLabels[s]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Redesign the Checklist page with floating pill tabs and clipboard hero**

Replace the entire content of `app/checklist/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { TaskCard } from "@/components/task-card";
import { ProgressBar } from "@/components/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/components/locale-provider";
import { FileText, Coins, Rocket, Home, Monitor } from "lucide-react";
import type { Task, TaskCategory, TaskStatus } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

const categories: { value: TaskCategory; labelKey: string; Icon: LucideIcon }[] = [
  { value: "visa", labelKey: "checklist.category.visa", Icon: FileText },
  { value: "income", labelKey: "checklist.category.income", Icon: Coins },
  { value: "business", labelKey: "checklist.category.business", Icon: Rocket },
  { value: "life", labelKey: "checklist.category.life", Icon: Home },
  { value: "tech", labelKey: "checklist.category.tech", Icon: Monitor },
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const userName = localStorage.getItem("sakusen-user") || "Unknown";
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedBy: userName, updatedAt: new Date().toISOString() } : t
      )
    );
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, updatedBy: userName }),
      });
      const updated = await res.json();
      setTasks(updated);
    } catch {
      fetch("/api/tasks").then((r) => r.json()).then(setTasks);
    }
  };

  const assignees = useMemo(() => {
    const set = new Set(tasks.map((t) => t.assignee).filter(Boolean));
    return Array.from(set) as string[];
  }, [tasks]);

  const filterTasks = (categoryTasks: Task[]) => {
    return categoryTasks.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Clipboard Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/clipboard.splinecode"
          fallbackSrc="/illustrations/clipboard.png"
          fallbackAlt="3D floating clipboard"
        >
          <div className="space-y-2 px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("checklist.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("checklist.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Filter toggle for mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="glass text-sm font-medium w-full text-center cursor-pointer"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters — collapsible on mobile */}
      <div className={`flex gap-2 flex-wrap ${showFilters ? "" : "hidden md:flex"}`}>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.allStatus")}</SelectItem>
            <SelectItem value="todo">{t("status.todo")}</SelectItem>
            <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
            <SelectItem value="done">{t("status.done")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.everyone")}</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.allPriority")}</SelectItem>
            <SelectItem value="critical">{t("priority.critical")}</SelectItem>
            <SelectItem value="high">{t("priority.high")}</SelectItem>
            <SelectItem value="medium">{t("priority.medium")}</SelectItem>
            <SelectItem value="low">{t("priority.low")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Floating pill tabs */}
      <Tabs defaultValue="visa">
        <TabsList className="w-full justify-start overflow-x-auto bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl gap-1 p-1.5">
          {categories.map((cat) => {
            const catTasks = tasks.filter((t) => t.category === cat.value);
            const done = catTasks.filter((t) => t.status === "done").length;
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="text-xs rounded-xl data-[state=active]:bg-white/70 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-4 py-2 gap-1.5 cursor-pointer transition-all"
              >
                <cat.Icon size={14} />
                {t(cat.labelKey)}
                <span className="ml-1 font-bold tabular-nums opacity-60">{done}/{catTasks.length}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => {
          const catTasks = tasks.filter((task) => task.category === cat.value);
          const filtered = filterTasks(catTasks);
          const done = catTasks.filter((task) => task.status === "done").length;
          const percent = catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0;

          return (
            <TabsContent key={cat.value} value={cat.value} className="space-y-4 mt-6">
              <ProgressBar value={percent} label={t(cat.labelKey)} />

              {percent === 100 && (
                <div className="glass text-center relative sparkle overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: "linear-gradient(135deg, rgba(167,232,189,0.4) 0%, rgba(184,181,255,0.2) 100%)",
                    }}
                  />
                  <p className="relative font-bold">{t("checklist.complete")}</p>
                </div>
              )}

              <div className="space-y-2 stagger">
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    {t("checklist.empty")}
                  </p>
                ) : (
                  filtered.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/checklist/page.tsx components/task-card.tsx
git commit -m "feat: redesign checklist with clipboard hero, floating tabs, and glass task cards"
```

---

## Task 11: Redesign Finances Page

**Files:**
- Modify: `app/finances/page.tsx`
- Modify: `components/cost-comparison.tsx`
- Modify: `components/checkpoint-gate.tsx`
- Modify: `components/savings-table.tsx`

- [ ] **Step 1: Update CostComparison with animated bar race**

Replace the entire content of `components/cost-comparison.tsx`:

```tsx
"use client";

import { Money } from "@/components/money";
import { useLocale } from "./locale-provider";
import { MapPin } from "lucide-react";

const costKeys = [
  "finances.rent",
  "finances.utilities",
  "finances.food",
  "finances.transport",
  "finances.health",
  "finances.misc",
] as const;

const tokyoAmounts = [120000, 15000, 60000, 10000, 25000, 30000];
const klAmountsMYR = [3000, 400, 2500, 400, 650, 1250];
// Approximate JPY equivalents for bar width comparison
const klAmountsJPY = [45000, 6000, 37500, 6000, 9750, 18750];

export function CostComparison() {
  const { t } = useLocale();
  const tokyoTotal = tokyoAmounts.reduce((sum, v) => sum + v, 0);
  const klTotal = klAmountsMYR.reduce((sum, v) => sum + v, 0);
  const maxAmount = Math.max(...tokyoAmounts);

  return (
    <div className="space-y-4">
      {/* Bar Race */}
      <div className="glass space-y-4">
        {costKeys.map((key, i) => {
          const tokyoWidth = (tokyoAmounts[i] / maxAmount) * 100;
          const klWidth = (klAmountsJPY[i] / maxAmount) * 100;
          return (
            <div key={key} className="space-y-1.5">
              <span className="text-xs text-muted-foreground font-medium">{t(key)}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 rounded-full bg-coral/60 transition-all duration-1000 ease-out flex items-center justify-end px-2"
                    style={{ width: `${tokyoWidth}%`, minWidth: "60px" }}
                  >
                    <span className="text-[10px] font-bold text-coral-foreground whitespace-nowrap">
                      <Money amount={tokyoAmounts[i]} from="JPY" />
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 rounded-full bg-mint/60 transition-all duration-1000 ease-out flex items-center justify-end px-2"
                    style={{ width: `${klWidth}%`, minWidth: "60px", animationDelay: "0.2s" }}
                  >
                    <span className="text-[10px] font-bold text-mint-foreground whitespace-nowrap">
                      <Money amount={klAmountsMYR[i]} from="MYR" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass card-hover text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={14} className="text-coral-foreground" />
            <span className="pill pill-coral">{t("finances.tokyo")}</span>
          </div>
          <p className="text-xl font-bold tracking-tight">
            <Money amount={tokyoTotal} from="JPY" />
          </p>
        </div>
        <div className="glass card-hover text-center border-mint/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={14} className="text-mint-foreground" />
            <span className="pill pill-mint">{t("finances.kl")}</span>
          </div>
          <p className="text-xl font-bold tracking-tight text-mint-foreground">
            <Money amount={klTotal} from="MYR" />
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update CheckpointGate to glassmorphic**

In `components/checkpoint-gate.tsx`, replace `className="bento"` with `className="glass"` on the outer div (line 37).

- [ ] **Step 3: Update SavingsTable to glassmorphic**

In `components/savings-table.tsx`, replace `className="border border-border rounded-lg p-3 bg-card"` (line 146) with `className="glass p-3"`.

- [ ] **Step 4: Redesign the Finances page with piggy bank hero and liquid progress**

Replace the entire content of `app/finances/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { LiquidProgress } from "@/components/liquid-progress";
import { TiltCard } from "@/components/tilt-card";
import { Money } from "@/components/money";
import { SavingsTable } from "@/components/savings-table";
import { CostComparison } from "@/components/cost-comparison";
import { CheckpointGate } from "@/components/checkpoint-gate";
import { useLocale } from "@/components/locale-provider";
import { TrendingUp } from "lucide-react";
import type { SavingsEntry } from "@/lib/types";

export default function FinancesPage() {
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/savings")
      .then((r) => r.json())
      .then(setSavings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (month: string, field: string, value: number) => {
    setSavings((prev) =>
      prev.map((s) => (s.month === month ? { ...s, [field]: value } : s))
    );
    try {
      const res = await fetch("/api/savings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, [field]: value }),
      });
      const updated = await res.json();
      setSavings(updated);
    } catch {
      fetch("/api/savings").then((r) => r.json()).then(setSavings);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  const savingsTarget = 1200000;
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const layerColors = ["pill-mint", "pill-sky", "pill-marigold"];

  return (
    <div className="space-y-10">
      {/* Piggy Bank Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/piggybank.splinecode"
          fallbackSrc="/illustrations/piggybank.png"
          fallbackAlt="3D piggy bank"
        >
          <div className="space-y-2 px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("finances.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("finances.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Liquid Savings Progress */}
      <div className="glass-strong">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("finances.totalSavings")}</p>
            <p className="text-3xl font-bold tracking-tight mt-1 gradient-text">
              <Money amount={currentSavings} from="JPY" />
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("finances.target")} <Money amount={savingsTarget} from="JPY" />
          </p>
        </div>
        <LiquidProgress value={savingsPercent} />
      </div>

      {/* Income Layers — stacked card style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
        {["layer1", "layer2", "layer3"].map((key, i) => (
          <TiltCard key={key}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-muted-foreground" />
              <span className={`pill bounce-in ${layerColors[i]}`}>{t(`finances.${key}.title`)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t(`finances.${key}.target`)}</p>
            <p className="text-sm mt-1 leading-relaxed">{t(`finances.${key}.desc`)}</p>
          </TiltCard>
        ))}
      </div>

      {/* Savings Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("finances.table.title")}</h2>
        <div className="glass overflow-x-auto">
          <SavingsTable savings={savings} onUpdate={handleUpdate} />
        </div>
      </div>

      <CheckpointGate savings={savings} />

      {/* Cost Comparison — bar race */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("finances.col.title")}</h2>
        <CostComparison />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/finances/page.tsx components/cost-comparison.tsx components/checkpoint-gate.tsx components/savings-table.tsx
git commit -m "feat: redesign finances with piggy bank hero, liquid progress, and bar race comparison"
```

---

## Task 12: Redesign Visa Page

**Files:**
- Modify: `app/visa/page.tsx`
- Modify: `components/visa-timeline.tsx`
- Modify: `components/document-checklist.tsx`

- [ ] **Step 1: Update VisaTimeline to vertical stepper with fill line**

Replace the entire content of `components/visa-timeline.tsx`:

```tsx
"use client";

import { useLocale } from "./locale-provider";
import type { VisaStep, VisaStepStatus } from "@/lib/types";

const statusDotColors: Record<VisaStepStatus, string> = {
  pending: "bg-muted-foreground/30",
  in_progress: "bg-deep-purple",
  completed: "bg-mint",
  blocked: "bg-coral",
};

const statusPills: Record<VisaStepStatus, string> = {
  pending: "pill-muted",
  in_progress: "pill-lavender",
  completed: "pill-mint",
  blocked: "pill-coral",
};

type VisaTimelineProps = {
  steps: VisaStep[];
  onToggle: (id: string, status: VisaStepStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
};

export function VisaTimeline({ steps, onToggle, onNotesChange }: VisaTimelineProps) {
  const { t } = useLocale();
  const phases = ["A", "B", "C", "D"] as const;

  const phaseInfo: Record<string, { labelKey: string; periodKey: string }> = {
    A: { labelKey: "visa.phase.a", periodKey: "visa.phase.a.period" },
    B: { labelKey: "visa.phase.b", periodKey: "visa.phase.b.period" },
    C: { labelKey: "visa.phase.c", periodKey: "visa.phase.c.period" },
    D: { labelKey: "visa.phase.d", periodKey: "visa.phase.d.period" },
  };

  const statusLabelKeys: Record<VisaStepStatus, string> = {
    pending: "visa.status.pending",
    in_progress: "visa.status.in_progress",
    completed: "visa.status.completed",
    blocked: "visa.status.blocked",
  };

  return (
    <div className="space-y-8">
      {phases.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase).sort((a, b) => a.sortOrder - b.sortOrder);
        const info = phaseInfo[phase];
        const completed = phaseSteps.filter((s) => s.status === "completed").length;
        const fillPercent = phaseSteps.length > 0 ? (completed / phaseSteps.length) * 100 : 0;

        return (
          <div key={phase}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-deep-purple/20 text-deep-purple flex items-center justify-center font-bold text-sm">
                {phase}
              </div>
              <div>
                <h3 className="font-bold text-sm">{t(info.labelKey)}</h3>
                <p className="text-xs text-muted-foreground">
                  {t(info.periodKey)} · {completed}/{phaseSteps.length} {t("visa.done")}
                </p>
              </div>
            </div>

            <div className="ml-4 pl-6 space-y-3 relative">
              {/* Background line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted" />
              {/* Filled line */}
              <div
                className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-deep-purple to-mint transition-all duration-700 ease-out"
                style={{ height: `${fillPercent}%` }}
              />

              {phaseSteps.map((step) => {
                const nextStatus: VisaStepStatus =
                  step.status === "pending"
                    ? "in_progress"
                    : step.status === "in_progress"
                    ? "completed"
                    : step.status === "completed"
                    ? "pending"
                    : "pending";

                return (
                  <div key={step.id} className="relative">
                    <div
                      className={`absolute -left-[27px] top-2 h-3.5 w-3.5 rounded-full border-2 border-background ${statusDotColors[step.status]} transition-colors duration-300`}
                    />
                    <div className={`glass card-hover ${step.status === "completed" ? "opacity-50" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm leading-relaxed ${step.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {step.title}
                          </p>
                          {step.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("task.due")} {new Date(step.dueDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onToggle(step.id, nextStatus)}
                          className={`pill ${statusPills[step.status]} cursor-pointer hover:opacity-70 transition-opacity bounce-in`}
                        >
                          {t(statusLabelKeys[step.status])}
                        </button>
                      </div>
                      <textarea
                        className="mt-2 w-full text-xs bg-white/30 border border-white/20 rounded-xl px-3 py-2 resize-none placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-lavender/30 backdrop-blur-sm"
                        placeholder={t("visa.notes.placeholder")}
                        rows={1}
                        value={step.notes || ""}
                        onChange={(e) => onNotesChange(step.id, e.target.value)}
                        onFocus={(e) => { e.target.rows = 3; }}
                        onBlur={(e) => { if (!e.target.value) e.target.rows = 1; }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Update DocumentChecklist with slide-in animations**

Replace the entire content of `components/document-checklist.tsx`:

```tsx
"use client";

import { useLocale } from "./locale-provider";
import { FolderOpen } from "lucide-react";
import type { TrackerDocument, DocumentStatus } from "@/lib/types";

type DocumentChecklistProps = {
  documents: TrackerDocument[];
  onStatusChange: (id: string, status: DocumentStatus) => void;
};

const statusPills: Record<DocumentStatus, string> = {
  not_started: "pill-muted",
  in_progress: "pill-sky",
  ready: "pill-mint",
};

const statusLabelKeys: Record<DocumentStatus, string> = {
  not_started: "visa.docs.notStarted",
  in_progress: "visa.docs.inProgress",
  ready: "visa.docs.readyStatus",
};

export function DocumentChecklist({ documents, onStatusChange }: DocumentChecklistProps) {
  const { t } = useLocale();
  const ready = documents.filter((d) => d.status === "ready").length;

  return (
    <div className="glass">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-marigold-foreground" />
          <h3 className="font-bold text-sm">{t("visa.docs.title")}</h3>
        </div>
        <span className="text-xs text-muted-foreground font-bold tabular-nums">
          {ready}/{documents.length} {t("visa.docs.ready")}
        </span>
      </div>
      <div className="space-y-2">
        {documents.map((doc, i) => {
          const nextStatus: DocumentStatus =
            doc.status === "not_started"
              ? "in_progress"
              : doc.status === "in_progress"
              ? "ready"
              : "not_started";

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0 fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className={`text-sm leading-relaxed ${doc.status === "ready" ? "line-through text-muted-foreground" : ""}`}>
                {doc.name}
              </span>
              <button
                onClick={() => onStatusChange(doc.id, nextStatus)}
                className={`pill ${statusPills[doc.status]} cursor-pointer hover:opacity-70 transition-opacity shrink-0 ml-3 bounce-in`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {t(statusLabelKeys[doc.status])}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Redesign the Visa page with passport hero and circular countdown**

Replace the entire content of `app/visa/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { CircularProgress } from "@/components/circular-progress";
import { TiltCard } from "@/components/tilt-card";
import { VisaTimeline } from "@/components/visa-timeline";
import { DocumentChecklist } from "@/components/document-checklist";
import { useLocale } from "@/components/locale-provider";
import { CalendarClock } from "lucide-react";
import type { VisaStep, VisaStepStatus, TrackerDocument, DocumentStatus } from "@/lib/types";

const APPLICATION_DATE = new Date("2026-08-15");
const TOTAL_DAYS = Math.ceil(
  (APPLICATION_DATE.getTime() - new Date("2026-03-28").getTime()) / (1000 * 60 * 60 * 24)
);

export default function VisaPage() {
  const [steps, setSteps] = useState<VisaStep[]>([]);
  const [documents, setDocuments] = useState<TrackerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysUntilApp, setDaysUntilApp] = useState<number | null>(null);
  const notesTimeout = useRef<Record<string, NodeJS.Timeout>>({});
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/visa")
      .then((r) => r.json())
      .then((data) => {
        setSteps(data.steps || []);
        setDocuments(data.documents || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const diff = APPLICATION_DATE.getTime() - Date.now();
    setDaysUntilApp(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  const handleStepToggle = async (id: string, status: VisaStepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      const res = await fetch("/api/visa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "step", id, status }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setDocuments(data.documents);
    } catch {
      fetch("/api/visa").then((r) => r.json()).then((d) => { setSteps(d.steps); setDocuments(d.documents); });
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s)));

    if (notesTimeout.current[id]) clearTimeout(notesTimeout.current[id]);
    notesTimeout.current[id] = setTimeout(async () => {
      try {
        await fetch("/api/visa", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "step", id, notes }),
        });
      } catch {}
    }, 1000);
  };

  const handleDocStatusChange = async (id: string, status: DocumentStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    try {
      const res = await fetch("/api/visa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "document", id, status }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setDocuments(data.documents);
    } catch {
      fetch("/api/visa").then((r) => r.json()).then((d) => { setSteps(d.steps); setDocuments(d.documents); });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  const daysElapsed = TOTAL_DAYS - (daysUntilApp ?? TOTAL_DAYS);
  const countdownPercent = Math.round((daysElapsed / TOTAL_DAYS) * 100);

  return (
    <div className="space-y-10">
      {/* Passport Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/passport.splinecode"
          fallbackSrc="/illustrations/passport.png"
          fallbackAlt="3D passport with visa stamps"
        >
          <div className="space-y-2 px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("visa.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("visa.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Circular Countdown */}
      {daysUntilApp !== null && (
        <TiltCard className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("visa.countdown.label")}</p>
            <p className="text-xs text-muted-foreground mt-2">{t("visa.countdown.target")}</p>
          </div>
          <CircularProgress value={countdownPercent} size={100} strokeWidth={6}>
            <div className="text-center">
              <p className="text-2xl font-bold tracking-tighter gradient-text">{daysUntilApp}</p>
              <p className="text-[10px] text-muted-foreground">days</p>
            </div>
          </CircularProgress>
        </TiltCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VisaTimeline
            steps={steps}
            onToggle={handleStepToggle}
            onNotesChange={handleNotesChange}
          />
        </div>
        <div>
          <DocumentChecklist
            documents={documents}
            onStatusChange={handleDocStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add app/visa/page.tsx components/visa-timeline.tsx components/document-checklist.tsx
git commit -m "feat: redesign visa page with passport hero, circular countdown, and stepper timeline"
```

---

## Task 13: Generate Spline Scenes via Stitch MCP & Final Polish

**Files:**
- Create: Spline scene configurations via Stitch MCP
- Modify: Various files for final polish

- [ ] **Step 1: Use Stitch MCP to create a design system**

Use `mcp__stitch__create_design_system` to define the Sakusen design system with:
- Colors: lavender #B8B5FF, mint #A7E8BD, coral #FFB5A7, marigold #FFD6A5, deep-purple #6C63FF
- Typography: M PLUS Rounded 1c (JP), Nunito Sans (Latin)
- Border radius: 1.25rem (cards), 9999px (pills)
- Style: glassmorphic, playful, kawaii

- [ ] **Step 2: Use Stitch to generate hero layout patterns**

Use `mcp__stitch__generate_screen_from_text` for the dashboard hero layout:
- "Full-width hero section with centered 3D scene background, large gradient text title overlaid, floating countdown card overlapping bottom edge, below: asymmetric 4-column bento grid of glassmorphic stat cards"

Review the output for layout inspiration and apply relevant patterns.

- [ ] **Step 3: Update the ProgressBar styling**

In `components/progress-bar.tsx`, replace the outer track class:

Old:
```tsx
<div className="h-2.5 rounded-full bg-muted overflow-hidden progress-striped">
```

New:
```tsx
<div className="h-3 rounded-full bg-white/30 overflow-hidden progress-striped backdrop-blur-sm">
```

- [ ] **Step 4: Final visual QA — verify all pages render**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/progress-bar.tsx
git commit -m "style: polish progress bar and finalize glassmorphic design system"
```

---

## Task 14: Verify Full Build and Run Dev Server

- [ ] **Step 1: Clean build**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && rm -rf .next && npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 2: Run dev server and check all routes**

```bash
cd /Users/Daito/repos/MalaysiaSakusen && npm run dev
```

Manually verify in browser:
- `/` — Dashboard with globe hero, floating countdown, glassmorphic stat cards
- `/summary` — Mascot hero, tilt stat cards, glowing overdue section
- `/checklist` — Clipboard hero, floating pill tabs, glass task cards
- `/finances` — Piggy bank hero, liquid progress, bar race comparison
- `/visa` — Passport hero, circular countdown ring, stepper timeline

Check mobile (< 768px):
- Floating bottom nav visible
- Static fallback illustrations instead of Spline scenes
- Collapsible filter drawer on checklist

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final polish and build fixes for 3D redesign"
```
