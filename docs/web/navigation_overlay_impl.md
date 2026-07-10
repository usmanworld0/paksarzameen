# PSZ Main Web Navigation Overlay Implementation

## Overview
Rebuilt the main-site header navigation into a fullscreen overlay experience while keeping PSZ branding, typography, and colors intact.

## What Changed
- Replaced the old drawer with a GSAP-driven fullscreen overlay.
- Added a data-driven navigation config for the main menu and accordion child links.
- Styled the overlay as a two-part fullscreen menu with a top search bar, grouped column layout, and Landing Page accordion.
- Wired the homepage sections to real anchor targets for Problem, Solution, and Life at PSZ.
- Added a FAQ anchor target for direct deep-linking from navigation.

## Behavior
- Body scroll is locked while the menu is open.
- ESC closes the overlay.
- Focus is trapped while the menu is open and restored to the trigger when closed.
- The menu trigger morphs between Menu and Close states.
- Landing Page expands as an accordion with staggered child-item reveal.

## Notes
- The overlay keeps PSZ colors and typography, but uses the reference menu structure and animation rhythm.
- All destination links stay aligned to current live routes.