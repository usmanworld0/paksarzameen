# Implementation: PSZ Main Web Phase 1 (Foundation, Global Layout, Navigation)

## Overview
Phase 1 initialized the Next.js App Router foundation for `psz_main_web` and implemented the persistent global shell:
- Tailwind CSS configuration with PSZ visual tokens.
- Two-font typography system.
- Responsive global Navbar including the external Commonwealth Lab bridge link.
- Global Footer with contact/social/newsletter placeholders.
- Root `layout.tsx` integration with semantic structure.

## Requirements Addressed
- Foundation and styling setup completed.
- `framer-motion` added as a dependency for upcoming phases.
- Navigation includes required links and external Commonwealth bridge behavior.
- Footer includes clean informational layout and placeholder newsletter capture.
- Layout wraps all pages with `header`, `main`, and `footer` semantics.

## Files Added
- `psz_main_web/package.json`
- `psz_main_web/next.config.ts`
- `psz_main_web/tsconfig.json`
- `psz_main_web/next-env.d.ts`
- `psz_main_web/tailwind.config.js`
- `psz_main_web/postcss.config.js`
- `psz_main_web/.eslintrc.json`
- `psz_main_web/.gitignore`
- `psz_main_web/src/app/layout.tsx`
- `psz_main_web/src/app/globals.css`
- `psz_main_web/src/app/page.tsx`
- `psz_main_web/src/components/header/Navbar.tsx`
- `psz_main_web/src/components/header/MobileNav.tsx`
- `psz_main_web/src/components/footer/Footer.tsx`
- `psz_main_web/src/config/site.ts`

## Notes
- The Commonwealth URL is configurable via `NEXT_PUBLIC_COMMONWEALTH_URL` with a temporary fallback until production domain setup is complete.
- Homepage feature sections from Phase 3 are intentionally not implemented in this phase.
