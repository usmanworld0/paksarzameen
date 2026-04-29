# Dog Hero Video Implementation

## Overview
This feature adds a scroll-linked landing hero for the dog adoption site using Framer Motion and a local frame sequence. The UI now follows a Nike-inspired monochrome system with editorial typography, pill buttons, and minimal surfaces, and the hero itself was pared back to the absolute essentials.

## Requirements
- Sticky hero section with a `400vh` scroll container.
- Background playback linked to scroll position.
- Headline fades in at `0.5` scroll progress.
- Attribution paragraph fades in at `0.75` scroll progress.
- Grid of mock dog cards appears after the sticky hero ends.
- Tailwind-only styling with mobile-safe text overlay.

## Data Sources
- `dog-site/public/hero-sequence/` contains the copied frame sequence used for the scroll-synced background.
- `dog-site/data/mockDogs.ts` contains the post-scroll adoption cards.

## Implementation Notes
- The hero is implemented in `dog-site/components/HeroVideo.tsx` as a client component.
- `useScroll` drives frame selection from the 240-frame local sequence.
- `useSpring` smooths scroll progress before it maps to frame selection and the progress bar.
- `useTransform` controls the headline and attribution fade-in timing.
- The post-scroll card grid reuses the same local frame set for its mock dog imagery.
- The adoption listing and profile pages share the same monochrome editorial treatment so the full site feels like one reconstructed UI.
- The final hero iteration removes the frame counter, progress panel, top bar, and bottom prompt strip so the landing experience remains image-first.

## Edge Cases
- Reduced-motion users are shown a static first frame instead of scroll-driven frame updates.
- If a frame is missing, the hero falls back to the first frame in the sequence.
