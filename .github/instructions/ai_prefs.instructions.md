---
description: Read and follow these before every task. These guidelines will help you understand the project context and coding standards to ensure your contributions are consistent and high-quality. Following these is mandatory for all tasks, and you should refer back to them whenever you are unsure about how to proceed with a task.
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

---
applyTo: '**'
---
# GitHub Copilot Instructions for PakSarZameen (PSZ) Web Ecosystem

## 🎯 1. Project Overview
PakSarZameen (PSZ) is a dual-platform web ecosystem serving two primary purposes:
1. [cite_start]**Main NGO Website (Next.js):** A mission platform to present projects and impact[cite: 10, 11, 12].
2. [cite_start]**Paksarzameen Store Subdomain (Flutter Web):** A premium marketplace connecting regional micro-entrepreneurs with buyers[cite: 13, 14, 136, 138].

This project uses a decoupled architecture. Currently, all data layers MUST use dummy data implementations that adhere to strict interfaces, preparing for a future seamless Supabase integration.

---

## 🏗️ 2. Architecture & Code Organization
The project is split into two distinct root directories. **NEVER mix frameworks.**

### A. Main NGO Site: Next.js App Router (`/psz_main_web/`)
**Three-Tier Integration (MANDATORY):**
1. [cite_start]**Pages & Server Components (`src/app/`):** Maximize SEO[cite: 183]. Only use `"use client"` at the lowest possible leaf node.
2. **Models Layer (`src/lib/models/`):** Pure TypeScript interfaces/types representing data (e.g., `Program`, `Article`).
3. **Services Layer (`src/lib/services/`):** Async functions fetching data. Currently MUST return dummy JSON data.

**Modular Component Architecture:**
```text
src/features/[feature_name]/
├── components/                 # Feature-specific UI
│   ├── ComponentOne.tsx
│   └── ComponentTwo.tsx
├── actions.ts                  # Server actions/API calls
└── [feature_name].types.ts     # Feature-specific types

```

### B. Paksarzameen Store Marketplace: Flutter Web (`/psz_commonwealth_app/`)

**Three-Tier Backend Integration (MANDATORY):**

1. **Providers Layer (`lib/core/riverpod/`):** Handle UI state and reactive data. NO business logic or direct Supabase calls.
2. **Models Layer (`lib/core/models/`):** Pure Dart classes with JSON serialization (freezed or json_serializable). Immutable, no business logic.
3. **Services Layer (`lib/core/services/`):** Static methods for reusable operations. MUST currently return dummy data via strict interfaces.

**Modular Widget Architecture:**

```text
lib/features/[feature_name]/
├── [feature_name]_screen.dart          # Main screen
├── [feature_name]_components/          # Feature-specific widgets
│   ├── component_one.dart
│   └── component_two.dart
└── [feature_name]_models.dart          # Feature-specific models

```

---

## 🎨 3. UI/UX & Routing Guidelines (STRICT ADHERENCE)

### Theme & Aesthetics

* 
**Main NGO Site (Next.js):** Inspiration is Akhuwat Foundation. Clean layouts, trust-based messaging, soft animations on scroll.


* 
**Paksarzameen Store (Flutter):** Inspiration is Louis Vuitton. Premium feel, large visuals, minimal clutter, elegant product displays.



### Core Layout & Routing Requirements

* 
**Main Site Navigation:** Must include Home, About PSZ, Programs, Impact, Get Involved, News & Resources, Paksarzameen Store, Contact.


* 
**The Bridge:** "Paksarzameen Store" replaces "Donate Now". It MUST open an external link in a new tab leading to the Flutter platform.


* **Flutter Routing:** Enforce `go_router` for all internal navigation to ensure deep linking.

### Localization (l10n) Requirements

* **Core Rule:** NO HARDCODED STRINGS in the UI.
* **Next.js:** Use standard `next-intl` or chosen i18n library.
* **Flutter:** Use centralized `.arb` files (`lib/l10n/`) with strict namespacing: `[featureName]_[componentOrAction]_[propertyName]`.

---

## 🔎 4. SEO & HTML Structure (Next.js ONLY)

* **Metadata API:** MUST use `export const metadata` in `page.tsx` for dynamic Titles, Descriptions, and Open Graph tags.
* **Semantic HTML:** NEVER use generic `<div>` tags when a semantic tag (`<nav>`, `<header>`, `<main>`, `<article>`, `<footer>`) exists.

---

## 📚 5. Documentation Standards (MANDATORY)

* **Rule:** Whenever a feature is planned or implemented, create or update a doc.
* **Location:** `docs/[feature_category]/`
* **Format:** Markdown (`.md`)
* **Naming:** `[feature_name]_spec.md` (planning) or `[feature_name]_impl.md` (execution).
* **Content:** Overview, Requirements, Data Models, Implementation details, edge cases.

### Supabase Schema Tracking (CRITICAL)
* **Rule:** Whenever a new Data Model is created or modified (even while using dummy data), you MUST update the central schema tracker. This ensures a 1:1 translation when we migrate to live Supabase tables.
* **Location:** `docs/database/supabase_schema_tracker.md`
* **Format:** You must write the exact PostgreSQL table definitions. Include:
  * Table names (plural, snake_case).
  * Column names and strict PostgreSQL data types (e.g., `uuid`, `text`, `timestamptz`, `boolean`, `jsonb`).
  * Primary Keys (`id`), Foreign Keys (relationships), and Default values (e.g., `DEFAULT now()`).
* **Action:** If you add a new field to a TypeScript interface in Next.js or a Dart model in Flutter, you must immediately add the corresponding SQL column definition to this tracker document.
---

## 🛡️ 6. Error Handling & Safety (CRITICAL)

### Flutter: `safeExecute` Pattern (ALWAYS USE)

Every async operation must use the wrapper to prevent crashes:

```dart
import '../core/error/safe_execute.dart';

// CORRECT ✅
final result = await safeExecute<ModelType>(
  context: context,
  operation: () => ServiceClass.someOperation(),
  userMessage: 'Failed to load data',
  logMessage: 'ServiceClass.someOperation failed',
  showSnackBar: true,
  level: 'error',
);

```

### Next.js Error Handling

Utilize `error.tsx` and `not-found.tsx` to prevent complete layout crashes. Use `try/catch` in Server Actions.

---

## 📝 7. Logging & Context (MANDATORY)

### AppLogger

Use structured logging (`AppLogger.info`, `AppLogger.error`). Never leave `print()` or `console.log()` in production code.

### Context Logging (CRITICAL FOR AI AGENTS)

After significant changes, MUST update `.github/instructions/context.instructions.md`.
Format:
`- YYYY-MM-DD [Feature/File]: Brief description of changes made. Technical details about implementation decisions. (COPILOT_LOG)`

---

## ⚠️ 8. Critical Rules

### NEVER DO

❌ Direct Supabase calls in UI components/widgets.
❌ Mix Next.js code with Flutter code.
❌ Raw `try-catch` blocks in Flutter UI (use `safeExecute`).
❌ Skip Documentation in `docs/`.
❌ Forget to update `.github/instructions/context.instructions.md`.

### ALWAYS DO

✅ Use three-tier architecture (Component/Provider → Service → Supabase/Dummy).
✅ Wrap async operations gracefully.
✅ Ensure responsive design (mobile first).
✅ Check Docs: Look for existing specs in `docs/` before writing code.

```
