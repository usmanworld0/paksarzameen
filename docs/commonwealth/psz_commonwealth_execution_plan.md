# Phased Execution Plan: PSZ Commonwealth Marketplace (Flutter Web)

Date: 2026-03-05

## 1. Purpose
This document defines the full, phase-by-phase implementation plan for `psz_commonwealth_app`.
It is the operational source of truth for building the Flutter Web marketplace using strict dummy-data architecture first, with clear migration readiness for Supabase.

This plan aligns with:
- `docs/psz_commonwealth_app_spec.md`
- `docs/psz_developer_handover.md`
- `.github/instructions/ai_prefs.instructions.md`

## 2. Locked Scope For This Cycle
The following implementation decisions are locked for this cycle:
- Checkout: Mock checkout only.
- Authentication: Guest checkout only.
- Cart persistence: Local browser persistence.
- Localization: English first, Urdu scaffold with key parity.
- Visual direction: Strongly inspired by Louis Vuitton-style premium layouts while retaining PSZ trust language and tone.

Out of scope for this cycle:
- Real payment gateway integration.
- User auth/account flows.
- Live Supabase integration.

## 3. Non-Negotiable Constraints
- Use strict three-tier architecture:
  - UI Widgets/Screens -> Riverpod Providers -> Services/Repositories.
- No direct data fetching/service calls in widgets.
- Every async operation that can fail must use `safeExecute`.
- No hardcoded user-facing strings in UI.
- Use `go_router` for all internal routes and deep linking.
- Keep Flutter code only in `psz_commonwealth_app/`.

## 4. Route Map (Target)
The following deep-link routes must be implemented:
1. `/` -> Storefront
2. `/category/:id` -> Category Hub
3. `/product/:id` -> Product Detail
4. `/cart` -> Cart
5. `/checkout` -> Checkout

## 5. Data Domains (Phase-1 Dummy)
Core entities for this cycle:
- Category
- Product
- CartItem
- CartSummary
- CheckoutRequest
- CheckoutResult

Category set required by spec:
- Handicrafts
- Traditional dresses / clothing
- Artisan / cultural products
- PSZ merchandise

## 6. Implementation Phases

### Phase 0 - Baseline Alignment and Planning Setup
Objective:
- Establish execution readiness, doc scaffolding, and acceptance gates.

Tasks:
- Confirm scope decisions listed in Section 2.
- Create this plan file under `docs/commonwealth/`.
- Prepare implementation log file for phased completion tracking.
- Define quality gate commands and manual validation checklist.

Deliverables:
- `docs/commonwealth/psz_commonwealth_execution_plan.md`
- `docs/commonwealth/psz_commonwealth_phase1_impl.md` (stub or initial template)

Exit Criteria:
- Plan approved and ready for phased implementation.

---

### Phase 1 - Core App Foundation
Objective:
- Replace Flutter boilerplate with architecture-ready app shell.

Tasks:
- Update `pubspec.yaml` dependencies:
  - `flutter_riverpod`
  - `go_router`
  - `intl`
  - model/codegen packages (`freezed`, `freezed_annotation`, `json_serializable`, `json_annotation`, `build_runner`)
- Wire localization generation settings.
- Replace `lib/main.dart` with:
  - `ProviderScope`
  - `MaterialApp.router`
  - centralized router integration
- Add core theme system:
  - two-font structure (heading/body)
  - premium palette/tokens inspired by LV + PSZ
  - spacing/radius/shadow/motion tokens

Deliverables:
- Updated `pubspec.yaml`
- New app bootstrap in `lib/main.dart`
- Router config and shared theme files

Exit Criteria:
- App boots with router shell and no template counter code remains.

---

### Phase 2 - Models, Repository Contracts, Dummy Services, Safe Execute
Objective:
- Build data and error-handling foundations with clean boundaries.

Tasks:
- Implement `safeExecute` in `lib/core/error/safe_execute.dart`.
- Create models in `lib/core/models/` with immutable patterns and JSON support.
- Create repository interfaces in `lib/core/repositories/`.
- Create dummy service implementations in `lib/core/services/`.
- Implement local cart persistence adapter for web.

Deliverables:
- Model classes and generated code artifacts (where applicable)
- Repository contracts
- Dummy services with deterministic sample data
- Working `safeExecute`

Exit Criteria:
- Services are testable in isolation and do not leak into widget layer.

---

### Phase 3 - Riverpod State Orchestration
Objective:
- Provide reactive app state through provider layer only.

Tasks:
- Add providers/notifiers for:
  - categories
  - featured products
  - products by category
  - product detail by id
  - cart state
  - checkout action state
- Normalize loading, empty, and error states.
- Ensure async write actions route through `safeExecute`.

Deliverables:
- `lib/core/riverpod/` providers and notifiers
- Shared UI state contracts for all feature screens

Exit Criteria:
- Screens can consume provider state without direct service access.

---

### Phase 4 - Feature Screens and Route Completion
Objective:
- Implement full route flow with premium responsive UI.

Tasks:
- Build screens/components in `lib/features/`:
  - Storefront (`/`)
  - Category Hub (`/category/:id`)
  - Product Detail (`/product/:id`)
  - Cart (`/cart`)
  - Checkout (`/checkout`)
- Add premium component patterns:
  - large product media
  - clean grid system
  - restrained hover and transition effects
  - clear CTA hierarchy
- Integrate cart flows:
  - add to cart
  - update quantity
  - remove item
  - proceed to checkout
- Implement mock checkout confirmation behavior.

Deliverables:
- Full deep-link route coverage
- End-to-end cart and mock checkout flow

Exit Criteria:
- User can complete full browse-to-checkout journey.

---

### Phase 5 - Localization Integration
Objective:
- Eliminate hardcoded strings and enforce localization structure.

Tasks:
- Populate `lib/l10n/app_en.arb` with complete feature keys.
- Scaffold `lib/l10n/app_ur.arb` with matching keys.
- Wire generated localizations and replace inline strings in UI.
- Use namespaced key convention:
  - `[featureName]_[componentOrAction]_[propertyName]`

Deliverables:
- Fully localized English UI
- Urdu key parity scaffold

Exit Criteria:
- No user-facing hardcoded strings remain in implemented screens.

---

### Phase 6 - Schema Parity and Documentation Compliance
Objective:
- Keep Supabase migration readiness and implementation traceability intact.

Tasks:
- Update `docs/database/supabase_schema_tracker.md` with PostgreSQL table definitions for Commonwealth models.
- Add phase implementation logs under `docs/commonwealth/`.
- Update `.github/instructions/context.instructions.md` after significant milestones.

Deliverables:
- Updated schema tracker
- Commonwealth phase implementation docs
- Context log entries (`COPILOT_LOG`)

Exit Criteria:
- Every model field has corresponding schema tracking entry.

---

### Phase 7 - Validation, QA, and Readiness Gate
Objective:
- Verify functional quality, architecture compliance, and responsiveness.

Tasks:
- Run technical checks:
  - `flutter pub get`
  - `dart run build_runner build --delete-conflicting-outputs`
  - `flutter analyze`
  - `flutter test`
- Runtime validation:
  - `flutter run -d chrome`
  - verify deep links and route rendering
- QA scenarios:
  - cart persistence across refresh
  - error handling behavior via `safeExecute`
  - responsive layout across mobile/tablet/desktop
  - localization fallback behavior
- Architecture checks:
  - no direct service access in widgets
  - providers mediate state

Deliverables:
- Validation summary in phase implementation doc

Exit Criteria:
- All quality gates pass or known issues are documented with explicit follow-up tasks.

## 7. Suggested File Targets By Layer
Core and config:
- `lib/main.dart`
- `lib/config/router.dart`
- `lib/config/theme.dart`

Error handling:
- `lib/core/error/safe_execute.dart`

Models:
- `lib/core/models/category.dart`
- `lib/core/models/product.dart`
- `lib/core/models/cart_item.dart`
- `lib/core/models/cart_summary.dart`
- `lib/core/models/checkout_models.dart`

Repositories:
- `lib/core/repositories/i_product_repository.dart`
- `lib/core/repositories/i_cart_repository.dart`
- `lib/core/repositories/i_checkout_repository.dart`

Services:
- `lib/core/services/dummy_product_service.dart`
- `lib/core/services/dummy_cart_service.dart`
- `lib/core/services/dummy_checkout_service.dart`
- `lib/core/services/local_cart_storage_service.dart`

Riverpod:
- `lib/core/riverpod/product_providers.dart`
- `lib/core/riverpod/cart_providers.dart`
- `lib/core/riverpod/checkout_providers.dart`

Features:
- `lib/features/storefront/storefront_screen.dart`
- `lib/features/storefront/storefront_components/*`
- `lib/features/category/category_screen.dart`
- `lib/features/category/category_components/*`
- `lib/features/product_detail/product_detail_screen.dart`
- `lib/features/product_detail/product_detail_components/*`
- `lib/features/cart/cart_screen.dart`
- `lib/features/cart/cart_components/*`
- `lib/features/checkout/checkout_screen.dart`
- `lib/features/checkout/checkout_components/*`

Localization:
- `lib/l10n/app_en.arb`
- `lib/l10n/app_ur.arb`

Docs and tracking:
- `docs/commonwealth/psz_commonwealth_phase1_impl.md`
- `docs/commonwealth/psz_commonwealth_phase2_impl.md` (and onward)
- `docs/database/supabase_schema_tracker.md`
- `.github/instructions/context.instructions.md`

## 8. Dependencies Between Phases
- Phase 1 depends on Phase 0.
- Phase 2 depends on Phase 1.
- Phase 3 depends on Phase 2.
- Phase 4 depends on Phase 3.
- Phase 5 can start during late Phase 4 once keys stabilize.
- Phase 6 runs alongside implementation but must be complete before final sign-off.
- Phase 7 is final gate after phases 1-6.

## 9. First Implementation Slice (Immediate Next Action)
Start with Phase 1 and Phase 2 in sequence:
1. Foundation (deps, bootstrap, router, theme).
2. Core domain (safeExecute, models, repositories, dummy services).

This gives a stable platform for fast route implementation in Phase 4.
