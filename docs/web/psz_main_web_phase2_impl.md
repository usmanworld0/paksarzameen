# Implementation: PSZ Main Web Phase 2 (Flexible Data Models and Dummy Services)

## Overview
Phase 2 adds typed model contracts and dummy service functions for the Next.js mission platform.
The data layer is intentionally backend-agnostic and designed for seamless future Supabase integration.

## Requirements Addressed
- Added `Program`, `Article`, and `ImpactStat` models in `src/lib/models/`.
- Added dummy datasets for all three models, including all six core PSZ departments.
- Added async service functions `getPrograms()`, `getArticles()`, and `getImpactStats()` in `src/lib/services/`.
- Enforced simulated network delay (500ms) to support realistic loading-state behavior.
- Maintained strict separation between UI, models, and services.

## Data Model Notes
- `Program` includes: `id`, `title`, `description`, `image`, `category`, `slug`, `fullContent`.
- `Article` includes: `id`, `title`, `excerpt`, `date`, `category`, `image`, `slug`, `fullContent`.
- `ImpactStat` includes: `id`, `label`, `value`, `icon`.

## Service Notes
- Services are async and return typed data only.
- Services do not import UI code and do not make external API calls.
- Delay is centralized via `src/lib/utils/delay.ts` and used consistently in each service.

## Files Added
- `psz_main_web/src/lib/models/Program.ts`
- `psz_main_web/src/lib/models/Article.ts`
- `psz_main_web/src/lib/models/ImpactStat.ts`
- `psz_main_web/src/lib/utils/delay.ts`
- `psz_main_web/src/lib/services/getPrograms.ts`
- `psz_main_web/src/lib/services/getArticles.ts`
- `psz_main_web/src/lib/services/getImpactStats.ts`
- `docs/web/psz_main_web_phase2_impl.md`

## Validation
- Type checking and linting should pass with these additions.
- Service outputs are ready for server-component consumption in Phase 3 homepage and hub pages.
