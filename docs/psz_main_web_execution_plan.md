# Phased Execution Plan: PSZ Main Web (Next.js)

**AI Agent Directive:** Do NOT attempt to execute this entire document at once. Wait for the user to explicitly specify which Phase to execute. Follow the architectural rules in `ai_prefs.md` at all times.

## Phase 1: Foundation, Global Layout, & Navigation
**Objective:** Set up the Next.js root layout, global styling, and the persistent Header/Footer.
1. **Styling & Assets:** * Configure Tailwind CSS with the two-font typography system and the PSZ brand colors.
   * Install `framer-motion` for future UI animations.
2. **Global Header (Navigation):**
   * Build a responsive `<Navbar>` component.
   * [cite_start]Include standard links: Home, About PSZ, Programs, Impact, Get Involved, News & Resources, Contact[cite: 36, 37, 38, 39, 40, 41, 42, 44].
   * [cite_start]**The Bridge:** Add the "Commonwealth Lab" link[cite: 43]. [cite_start]This MUST be an `<a>` tag (or Next.js `<Link>`) with `target="_blank"` and `rel="noopener noreferrer"` pointing to the Flutter subdomain[cite: 46, 47, 48, 49]. Highlight this link visually so it replaces the traditional "Donate Now" button.
3. **Global Footer:**
   * Build a clean footer with social links, contact info, and a newsletter signup placeholder.
4. **Integration:** Wrap `src/app/layout.tsx` with these global components.

## Phase 2: Flexible Data Models & Dummy Services
**Objective:** Create the TypeScript interfaces and dummy data fetching functions to populate the UI without a real backend.
1. **Models (`src/lib/models/`):**
   * Create `Program.ts` (id, title, description, image, category, slug, fullContent).
   * Create `Article.ts` (id, title, excerpt, date, category, image, slug, fullContent).
   * Create `ImpactStat.ts` (id, label, value, icon).
2. **Dummy Services (`src/lib/services/`):**
   * Create `getPrograms()`: Must return an array of dummy programs representing the 6 core departments (Mahkma Shajarkari, Ehsas ul Haiwanat, Room Zia, Dar ul Aloom, Tibi Imdad, Wajood-e-Zan).
   * [cite_start]Create `getImpactStats()`: Must return dummy data (e.g., entrepreneurs supported, regions served [cite: 93, 94]).
   * Create `getArticles()`: Must return a list of dummy news updates.
   * *Rule:* Simulate network delay using `await new Promise(res => setTimeout(res, 500))` to ensure loading states work properly.

## Phase 3: The Homepage Assembly
[cite_start]**Objective:** Build `src/app/page.tsx` using modular sections[cite: 50].
1. [cite_start]**Hero Section (`<HeroBanner />`):** Full-width looping video background (muted) with a mobile fallback image[cite: 51, 54, 56, 57]. [cite_start]Add the overlay text ("PakSarZameen" / "Building Community Wealth.") and two CTA buttons[cite: 58, 59, 60, 62, 64].
2. [cite_start]**Mission Overview (`<WhatIsPSZ />`):** 4 icon cards for Community empowerment, Ethical enterprise, Cultural heritage, and Grassroots development[cite: 67, 72, 73, 74, 75, 76].
3. [cite_start]**Programs Preview (`<ProgramsPreview />`):** Fetch from `getPrograms()` and display the top 3-4 projects in a clean card grid[cite: 79, 80].
4. [cite_start]**Impact Section (`<ImpactCounters />`):** Use Framer Motion to animate the numbers counting up when the section scrolls into view[cite: 90, 91].
5. [cite_start]**Join the Mission (`<JoinCTA />`):** Action-oriented section encouraging volunteering and partnering[cite: 98, 99, 100].
6. [cite_start]**News Preview (`<NewsPreview />`):** Fetch from `getArticles()` and display the latest 3 updates[cite: 104, 105].

## Phase 4: Dynamic Hubs (Programs & News)
**Objective:** Build the dedicated pages for exploring the NGO's initiatives and updates.
1. [cite_start]**Programs Hub (`src/app/programs/page.tsx`):** Grid layout of all programs with category filters and a search bar[cite: 85, 86, 87, 88].
2. **Program Detail (`src/app/programs/[slug]/page.tsx`):** Dynamic route. [cite_start]Layout must include overview, problem addressed, PSZ solution, and photos[cite: 119, 120, 121, 122, 123, 124]. Update the Next.js metadata dynamically based on the slug.
3. [cite_start]**News & Resources Hub (`src/app/news/page.tsx`):** Content hub with categories and article search[cite: 127, 128, 129, 130, 131].
4. **Article Detail (`src/app/news/[slug]/page.tsx`):** Dynamic route for reading full news posts.

## Phase 5: Final Polish & SEO Optimization
**Objective:** Ensure performance and search engine visibility.
1. Add strict metadata (Title, Description, OpenGraph) to `layout.tsx` and all static `page.tsx` files.
2. Ensure semantic HTML structure (`<main>`, `<article>`, `<section>`) is perfectly implemented across all components.
3. Verify all `<Image>` components use Next.js optimization and proper `alt` tags.