# Homepage Landing Logo Placement

## Overview

Moved the Paksarzameen logo and hero copy into the homepage hero so the landing-page treatment now lives on the site entry point instead of inside the menu.

## Implementation

- Replaced the homepage hero text stack with a centered logo and two-line landing message in `src/features/home/components/HomeClient.tsx`.
- Restored the homepage hero action row with `Healthcare`, `Store`, and `Shelter` links in `src/features/home/components/HomeClient.tsx`.
- Removed the logo block from `src/components/header/NavigationOverlay.tsx` so the overlay remains menu-only.

## Notes

- The logo asset uses the existing local `/paksarzameen_logo.png` file, and the tagline now reads `Reorganising Every Day Living` in white.
- The landing-page actions keep the existing `/healthcare`, external store, and `/dog-adoption` routes.
- Navigation routes and menu links remain unchanged.