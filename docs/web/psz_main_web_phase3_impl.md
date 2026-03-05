# Implementation: PSZ Main Web Phase 3 (Homepage Assembly)

## Overview
Phase 3 assembles `src/app/page.tsx` into modular homepage sections, using service-driven data from the Phase 2 dummy layer.
The page remains a server component and delegates interactivity to isolated client components where required.

## Sections Implemented
- `HeroBanner`: full-width hero with looping muted video background and mobile fallback image, with required headline and CTA pair.
- `WhatIsPSZ`: mission overview with four icon cards (community empowerment, ethical enterprise, cultural heritage, grassroots development).
- `ProgramsPreview`: top four programs rendered from `getPrograms()` in a clean card grid.
- `ImpactCounters`: impact metrics rendered from `getImpactStats()` with framer-motion reveal and count-up animation on scroll.
- `JoinCTA`: action-oriented section encouraging volunteering and partnership.
- `NewsPreview`: latest three updates rendered from `getArticles()`.

## Architecture Notes
- `src/app/page.tsx` fetches data via `Promise.all` from services only.
- All section components are modularized under `src/features/home/components/`.
- Stateful/animated logic is isolated to client component `ImpactCounters`.
- No direct data hardcoding in `page.tsx`; all data comes through service layer interfaces.

## Files Added
- `psz_main_web/src/features/home/home.content.ts`
- `psz_main_web/src/features/home/components/HeroBanner.tsx`
- `psz_main_web/src/features/home/components/WhatIsPSZ.tsx`
- `psz_main_web/src/features/home/components/ProgramsPreview.tsx`
- `psz_main_web/src/features/home/components/ImpactCounters.tsx`
- `psz_main_web/src/features/home/components/JoinCTA.tsx`
- `psz_main_web/src/features/home/components/NewsPreview.tsx`
- `psz_main_web/public/images/hero-fallback.svg`
- `docs/web/psz_main_web_phase3_impl.md`

## Files Updated
- `psz_main_web/src/app/page.tsx`

## Validation Target
- Homepage loads with all six sections in sequence.
- Hero displays video on desktop and fallback image on mobile.
- Programs/News previews use service data.
- Impact counters animate once when scrolled into view.
