# Current State

## ⛔ PERMANENT DESIGN RULES (Never Override)
- **NO custom cursor effects** — never replace or modify the browser's native cursor. No `cursor: none`, no magnetic cursor, no custom pointer components. EVER.

## Tasks in Progress
- None.

## Recent Changes (Wave 11 — De-scrolling)
- **Removed Lenis smooth scroll** and **ScrollProgress** bar from global layout.
- **HeroSection Simplified**: Removed parallax layers, scroll depth bar, and exit fade logic.
- **PinnedHowItWorks Simplified**: Converted from sticky-pinned reveal to a static 4-column grid layout.
- **ServiceCards Simplified**: Removed 3D scroll entrance animation (rotateX/scale).
- **ScrollMarquee Simplified**: Removed scroll-velocity reactive speed hooks.
- **ScrollCta Simplified**: Removed floating gold particles canvas and scroll-linked vignette.
- **Removed ScrollReveal**: All component wrappers removed from home screen for a static scroll experience.


## Recent Changes (Wave 9)
- Installed `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
- **`src/components/three/CameraScene.tsx`** [NEW]: Procedural cinema camera built from Three.js geometry (BoxGeometry, CylinderGeometry, TorusGeometry). Styled in anodized black + antique gold (Lumina Onyx). Animated with `useFrame` — responds to scrollY, mouseX/Y, and drag delta.
- **`src/components/three/Camera3D.tsx`** [NEW]: Client-side canvas wrapper. Tracks scroll via framer-motion `useScroll`/`useSpring`, mouse via window event, and drag via pointer events. Renders R3F `<Canvas>` with SSR disabled via `next/dynamic`.
- **`HeroSection.tsx`** [MODIFIED]: Replaced floating stats card with a `hero-right-panel` stacking the 3D camera on top + horizontal stats bar below. Dynamic import ensures no SSR hydration issues.

## Completed Wave 8

## Recent Changes (Wave 8)
- Configured **"Lumina Onyx" Design System** in Stitch with cinematic black, antique gold accents, Playfair Display and Outfit fonts, and glassmorphism elements.
- **Home Page**: Generated premium layout with cinematic hero, 3D scroll effects, stat counters, and infinite horizontal marquee.
- **Services Page**: Generated with 3D glassmorphism grid and premium FAQ section.
- **Portfolio Page**: Generated editorial layout with 3D depth reveals and cinematic images.
- **Gallery Page**: Generated masonry grid layout with high-fidelity photo cards and filter strip.
- **Blog / Journal Page**: Generated featuring cinematic hero post and article grid with 3D hover states.
- **Contact Page**: Generated split layout with glassmorphism contact form and floating labels.
- **Dhyey TV Page**: Generated sub-brand page with saffron accent override, live 24x7 player placeholder, and animated filter program schedule.

## Completed Waves
- **Wave 1**: Floating pill navbar + scroll % counter + ScrollProgress bar
- **Wave 2**: HeroSection cinematic rebuild (Ken Burns, staggered entry, floating stats card)
- **Wave 3**: StatCounters animated component
- **Wave 4**: ServiceCards + bidirectional InfiniteHighlights + HowItWorks + CtaSection upgrades
- **Wave 5**: Footer rebuild + PageTransition + Playfair Display typography + gold shimmer utilities
- **Wave 6**: Stock imagery fallback arrays, Premium stock photos for ServiceCards, cinematic dark theme applied, Playfair Display + Outfit typography standardized.
- **Wave 7**: Final review and client presentation prep.

## Accumulated Context

### Pending Todos
- [ ] **Generate epic background and improve whole public UI** (ui)
      User wants a high-impact, premium background and overall UI polish to stand out from generic sites.
      `src/components/layout/CinemaBackground.tsx`, `src/app/(public)/page.tsx`

## Next Steps
- Implement the "Epic Background" and UI polish as requested.
- Verify across all public pages.

## Blockers
- None.
