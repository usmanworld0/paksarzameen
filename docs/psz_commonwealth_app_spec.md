# Specification: Commonwealth Lab Marketplace (Flutter Web)

## 1. Project Overview & Tech Stack
[cite_start]The Commonwealth Lab is the economic arm of PakSarZameen[cite: 136]. [cite_start]Its purpose is to connect regional micro-entrepreneurs and artisans with global buyers[cite: 14, 138]. This is a standalone, premium e-commerce web application hosted on a subdomain.
* **Framework:** Flutter Web
* **State Management:** Riverpod
* **Routing:** `go_router` (Mandatory for web deep-linking)
* **Data Strategy:** Phase 1 uses strict Dummy Data Repositories via interfaces. [cite_start]Phase 2 will transition to Supabase for inventory and order management[cite: 150].

## 2. Design & UX System
* [cite_start]**Inspiration:** Louis Vuitton website aesthetic[cite: 29]. [cite_start]The app must combine NGO credibility with the visual sophistication of a premium product store[cite: 20, 21].
* [cite_start]**Visual Rules:** Clean layouts, large visuals, premium feel, minimal clutter, and elegant product displays[cite: 30, 31, 32, 33, 34].
* [cite_start]**Typography:** Strictly limited to TWO fonts maximum (one for headings, one for body text)[cite: 167, 168, 169].
* [cite_start]**Animations:** Animations should be subtle and elegant[cite: 171]. [cite_start]Examples include soft hover effects on product cards and smooth screen transitions[cite: 174, 176]. [cite_start]Avoid heavy or distracting animation[cite: 177].

## 3. Core Features & Routing (`go_router`)
The app requires a fully functional e-commerce flow. The router must support deep links for the following paths:
1. **Storefront (`/`):** A visually striking landing page highlighting featured artisan collections.
2. [cite_start]**Category Hub (`/category/:id`):** Filterable grids for specific product lines[cite: 145]. Categories include:
   * [cite_start]Handicrafts [cite: 15, 140]
   * [cite_start]Traditional dresses / clothing [cite: 16, 139]
   * [cite_start]Artisan / Cultural products [cite: 17, 141]
   * [cite_start]PSZ merchandise [cite: 18, 142]
3. [cite_start]**Product Detail Page (`/product/:id`):** Elegant layouts focusing heavily on large product images (AI-generated graphics will be provided by the client)[cite: 146, 147, 151]. Must include an "Add to Cart" action.
4. [cite_start]**Cart (`/cart`):** Order summary and quantity management[cite: 148].
5. [cite_start]**Checkout (`/checkout`):** The final purchase flow[cite: 149].

## 4. Technical Directives for AI Agents
* **Three-Tier Architecture:** You MUST separate UI, State (Riverpod), and Data (Services). Direct data fetching or complex business logic inside Flutter widgets is strictly forbidden.
* **Localization (`l10n`):** NO HARDCODED STRINGS. Every piece of user-facing text must use the `AppLocalizations` system with our strict namespacing convention (e.g., `marketplace_productDetail_addToCartButton`).
* **Error Handling:** You MUST use the `safeExecute` wrapper for all asynchronous actions (like adding items to the cart or checking out) to ensure the UI never crashes and the user receives a graceful error message.
* **Dummy Data Requirement:** Build abstract interfaces (e.g., `IProductRepository`) and implement them with dummy data classes (e.g., `DummyProductService`). The UI should not know it is consuming fake data.
* [cite_start]**Responsive Design:** The app must be mobile-first and scale gracefully to large desktop monitors[cite: 180]. Use `LayoutBuilder` or `MediaQuery` to adapt the grid column counts for product displays.