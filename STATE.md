# Current State

## Tasks in Progress
- **Wave 5/6**: CSS token polish, footer grain textures, page transitions
- **Gallery**: Firestore image loading verified only in authenticated context

## Recent Changes (Wave 3 & 4 — Cinematic Overhaul Session 2)
- **StatCounters**: New animated count-up component with IntersectionObserver trigger (500+, 4K, 5★, 48h)
- **ServiceCards**: Rebuilt with SpotlightCard hover, step number badges, image overlays, spring-lift animation
- **InfiniteHighlights**: Upgraded to bidirectional dual-row marquee (12 service labels, opposite directions)
- **HowItWorks**: Added oversized "PROCESS" watermark, alternating card gradient fills, top accent line, enhanced connector arrows
- **CtaSection**: Dramatic radial-glow background with 5rem serif headline and floating gold glow orb
- **Root Layout**: MagneticCursor + ScrollProgress injected globally; Playfair Display font added
- **Public Layout**: Removed padding-top offset (hero handles its own safe area)
- **globals.css**: `cursor: none` added for custom magnetic cursor (auto on touch devices)
- **tokens.css**: Added `--font-display: Playfair Display` variable

## Completed Waves
- **Wave 1**: Floating pill navbar with scroll % counter, MagneticCursor, ScrollProgress bar
- **Wave 2**: HeroSection cinematic rebuild (Ken Burns, staggered entry, floating stats card)
- **Wave 3**: StatCounters animated component
- **Wave 4**: ServiceCards + InfiniteHighlights + HowItWorks + CtaSection upgrades

## Next Steps (Wave 5)
- Add Playfair Display to key headings (HeroSection, CtaSection title) for typographic contrast
- Footer: Add noise grain texture overlay and social proof strip
- Add page transition fade between routes
- Consider adding a "Selected Works" horizontal scroll section

## Blockers
- None.
