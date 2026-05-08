# PSZ Developer Handover (Main Web Complete + Paksarzameen Store Kickoff)

## 1. Purpose
This document provides a practical handover of the current PSZ codebase status for another developer.
It covers:
- What has been implemented.
- What remains.
- What should be implemented next.
- How to run, validate, and continue safely.

Date: 2026-03-05

## 2. Repository Snapshot
Root folders:
- `psz_main_web/` (Next.js App Router mission platform)
- `psz_commonwealth_app/` (Flutter web marketplace app)
- `docs/` (specifications, phase implementation docs, schema tracker)
- `.github/instructions/` (AI/context logs and project rules)

## 3. Main Web Status (Next.js)
Overall status: Core product implementation completed through Phases 1-5 from execution plan.

### 3.1 Implemented Work
#### Phase 1 - Foundation, Global Layout, Navigation
- Next.js TypeScript setup, Tailwind styling system, Framer Motion dependency.
- Global layout and branding foundations.
- Responsive navbar and footer.

Primary files:
- `psz_main_web/src/app/layout.tsx`
- `psz_main_web/src/app/globals.css`
- `psz_main_web/src/components/header/Navbar.tsx`
- `psz_main_web/src/components/header/MobileNav.tsx`
- `psz_main_web/src/components/footer/Footer.tsx`
- `psz_main_web/src/config/site.ts`

#### Phase 2 - Models and Dummy Services
- Typed models and dummy datasets.
- Async services with consistent 500ms delay simulation.
- Supabase schema tracker aligned with model fields.

Primary files:
- `psz_main_web/src/lib/models/Program.ts`
- `psz_main_web/src/lib/models/Article.ts`
- `psz_main_web/src/lib/models/ImpactStat.ts`
- `psz_main_web/src/lib/utils/delay.ts`
- `psz_main_web/src/lib/services/getPrograms.ts`
- `psz_main_web/src/lib/services/getArticles.ts`
- `psz_main_web/src/lib/services/getImpactStats.ts`
- `docs/database/supabase_schema_tracker.md`

#### Phase 3 - Homepage Assembly
- Homepage built from modular sections.
- Data fetched through services, not hardcoded in page component.
- Impact section includes Framer Motion reveal/count-up behavior.

Primary files:
- `psz_main_web/src/app/page.tsx`
- `psz_main_web/src/features/home/home.content.ts`
- `psz_main_web/src/features/home/components/HeroBanner.tsx`
- `psz_main_web/src/features/home/components/WhatIsPSZ.tsx`
- `psz_main_web/src/features/home/components/ProgramsPreview.tsx`
- `psz_main_web/src/features/home/components/ImpactCounters.tsx`
- `psz_main_web/src/features/home/components/JoinCTA.tsx`
- `psz_main_web/src/features/home/components/NewsPreview.tsx`

#### Phase 4 - Programs/News Hubs + Dynamic Detail Pages
- Programs hub with search and category filters.
- Program detail dynamic route with metadata generation and route pre-generation.
- News hub with search/category filters and share affordances.
- Article detail dynamic route with related content and metadata generation.

Primary files:
- `psz_main_web/src/app/programs/page.tsx`
- `psz_main_web/src/app/programs/[slug]/page.tsx`
- `psz_main_web/src/app/news/page.tsx`
- `psz_main_web/src/app/news/[slug]/page.tsx`
- `psz_main_web/src/features/programs/components/ProgramsHubClient.tsx`
- `psz_main_web/src/features/news/components/NewsHubClient.tsx`
- `psz_main_web/src/lib/services/getProgramBySlug.ts`
- `psz_main_web/src/lib/services/getArticleBySlug.ts`

#### Phase 5 - SEO and Semantic Polish
- Strengthened metadata across layout/static/dynamic pages.
- Canonical links, OpenGraph, Twitter card fields, richer SEO metadata.
- Semantic heading/section adjustments.
- Image usage aligned with Next.js `Image` where used.

Primary files:
- `psz_main_web/src/app/layout.tsx`
- `psz_main_web/src/app/page.tsx`
- `psz_main_web/src/app/programs/page.tsx`
- `psz_main_web/src/app/programs/[slug]/page.tsx`
- `psz_main_web/src/app/news/page.tsx`
- `psz_main_web/src/app/news/[slug]/page.tsx`

### 3.2 Existing Implementation Docs
- `docs/web/psz_main_web_phase1_impl.md`
- `docs/web/psz_main_web_phase2_impl.md`
- `docs/web/psz_main_web_phase3_impl.md`
- `docs/web/psz_main_web_phase4_impl.md`
- `docs/web/psz_main_web_phase5_impl.md`

### 3.3 Remaining Work (Main Web)
Even with Phase 1-5 done from current execution plan, practical product completion still needs:
- Missing navigation destinations currently referenced by navbar:
  - `/about`
  - `/impact`
  - `/get-involved`
  - `/contact`
- Replace placeholder/demo media with production assets:
  - Hero video source.
  - Program/news image assets.
- Newsletter integration (footer currently placeholder/disabled).
- QA pass for real-device responsive behavior and accessibility checks.
- Production environment values (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_COMMONWEALTH_URL`) and deployment readiness checks.

### 3.4 Main Web Risks / Technical Debt
- Data layer is dummy-only by design; backend integration is pending.
- Some routes and visual content remain placeholder-oriented.
- Filtering/search are client-side and suited for current dummy dataset size only.

## 4. Paksarzameen Store App Status (Flutter Web)
Overall status: Scaffolding only; implementation has not started.

### 4.1 What Exists
- Project generated with default Flutter template.
- Required directory scaffolding created.

Existing paths:
- `psz_commonwealth_app/lib/core/error/safe_execute.dart` (currently empty)
- `psz_commonwealth_app/lib/core/models/` (empty)
- `psz_commonwealth_app/lib/core/repositories/` (empty)
- `psz_commonwealth_app/lib/core/riverpod/` (empty)
- `psz_commonwealth_app/lib/core/services/` (empty)
- `psz_commonwealth_app/lib/features/` (empty)
- `psz_commonwealth_app/lib/l10n/app_en.arb` (empty)
- `psz_commonwealth_app/lib/l10n/app_ur.arb` (empty)

### 4.2 What Is Missing
- Riverpod state architecture.
- `go_router` route map and deep-link setup.
- Core models, repository contracts, dummy services.
- `safeExecute` implementation.
- Localization keys and generated localization wiring.
- Marketplace feature screens (storefront, category, product detail, cart, checkout).
- Premium design system implementation per Paksarzameen Store spec.

## 5. Recommended Next Implementation Order
### 5.1 Immediate Next Steps (Main Web short completion)
1. Implement missing static routes (`about`, `impact`, `get-involved`, `contact`).
2. Replace hero/video and placeholder image assets with approved production assets.
3. Add real newsletter submission flow.
4. Run accessibility and responsive QA sweep.

### 5.2 Paksarzameen Store Day-1 Kickoff Plan
1. Update `pubspec.yaml` dependencies:
- `flutter_riverpod`, `go_router`, `intl`, and codegen packages.
2. Implement `safeExecute` in `lib/core/error/safe_execute.dart`.
3. Add core data models in `lib/core/models/`.
4. Add repository interfaces in `lib/core/repositories/`.
5. Add dummy service implementations in `lib/core/services/`.
6. Create provider layer in `lib/core/riverpod/`.
7. Wire `go_router` in app startup and replace default `main.dart` app shell.
8. Populate ARB files and enable localization generation.
9. Build routes/screens in this order:
- Storefront (`/`)
- Category hub (`/category/:id`)
- Product detail (`/product/:id`)
- Cart (`/cart`)
- Checkout (`/checkout`)

## 6. Run and Verify
### Main Web
Commands:
```powershell
cd d:\Code\psz\psz_main_web
npm install
npm run dev
npm run typecheck
npm run lint
```

Manual verification routes:
- `/`
- `/programs`
- `/programs/mahkma-shajarkari`
- `/news`
- `/news/dar-ul-aloom-community-learning-pods`

### Paksarzameen Store App (current scaffold)
Commands:
```powershell
cd d:\Code\psz\psz_commonwealth_app
flutter pub get
flutter run -d chrome
```

## 7. Handover Checklist
- Confirm env vars for production domains.
- Confirm approved media assets and delivery timeline.
- Confirm design tokens/fonts for Paksarzameen Store premium theme.
- Confirm checkout and payment scope (mock vs production integration).
- Confirm if auth/account flows are required for checkout.

## 8. Source of Truth Documents
- Project preferences/rules: `.github/instructions/ai_prefs.instructions.md`
- Main web plan: `docs/psz_main_web_execution_plan.md`
- Main web spec: `docs/psz_main_web_spec.md`
- Paksarzameen Store spec: `docs/psz_commonwealth_app_spec.md`
- Database tracker: `docs/database/supabase_schema_tracker.md`
- Implementation phase logs: `docs/web/psz_main_web_phase1_impl.md` to `docs/web/psz_main_web_phase5_impl.md`

## 9. Notes For Next Developer
- Keep Next.js code in `psz_main_web` and Flutter code in `psz_commonwealth_app` only.
- Continue using three-tier architecture and dummy services until Supabase migration phase.
- Update `.github/instructions/context.instructions.md` after each significant change.
