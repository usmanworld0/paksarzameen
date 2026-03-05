# Specification: PakSarZameen (PSZ) Main Mission Platform

## 1. Project Overview & Tech Stack
[cite_start]This is the primary public-facing website for the PakSarZameen NGO[cite: 8]. [cite_start]Its goal is to clearly present the organization's mission, showcase impact, and drive community involvement[cite: 11, 12].
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (or similar utility-first framework)
* **Animation:** Framer Motion (for scroll-triggered fade-ins and number counters)
* **Data Strategy:** Phase 1 (Current) uses strict Dummy Data Services via interfaces. Phase 2 will implement Supabase.

## 2. Design & UX System
* [cite_start]**Inspiration:** Akhuwat Foundation[cite: 25]. [cite_start]The site must radiate credibility and trust[cite: 26, 159].
* [cite_start]**Visual Rules:** Clean layouts, large visuals, minimal clutter, and premium feel[cite: 162, 163, 165].
* [cite_start]**Typography:** Strictly limited to TWO fonts maximum (one for headings, one for body text)[cite: 166, 167, 168, 169].
* [cite_start]**Animations:** Must be soft, subtle, and elegant[cite: 171]. [cite_start]Required animations include fade-in sections on scroll, hover effects on cards, and animated counters[cite: 173, 174, 175]. [cite_start]Avoid heavy/distracting animations[cite: 177].

## 3. Navigation Structure
[cite_start]The top navigation must include the following links[cite: 36]:
1. [cite_start]Home [cite: 37]
2. [cite_start]About PSZ [cite: 38]
3. [cite_start]Programs [cite: 39]
4. [cite_start]Impact [cite: 40]
5. [cite_start]Get Involved [cite: 41]
6. [cite_start]News & Resources [cite: 42]
7. [cite_start]Commonwealth Lab [cite: 43]
8. [cite_start]Contact [cite: 44]

[cite_start]**CRITICAL ROUTING RULE:** The "Commonwealth Lab" button replaces the traditional "Donate Now" CTA[cite: 45, 46]. [cite_start]It MUST open in a new tab (`target="_blank"`) and link to the external Flutter marketplace subdomain[cite: 47, 48, 49].

## 4. Core Page Requirements

### A. Homepage (`/src/app/page.tsx`)
Must be assembled using modular components:
1. [cite_start]**Hero Banner:** Full-width, auto-playing, looping background video (muted)[cite: 51, 54, 56]. [cite_start]Must have a mobile fallback image[cite: 57]. 
   * [cite_start]Overlay Headline: "PakSarZameen" [cite: 59, 60]
   * [cite_start]Overlay Subtext: "Building Community Wealth." [cite: 61, 62] + [cite_start]a short mission line[cite: 63].
   * [cite_start]CTA Buttons: "Explore Programs" and "Join the Mission"[cite: 64, 65, 66].
2. [cite_start]**"What is PakSarZameen?":** Short introduction to the mission, approach, and values[cite: 67, 68, 69, 70, 71]. [cite_start]Must use 4 icon cards: Community empowerment, Ethical enterprise, Cultural heritage, Grassroots development[cite: 72, 73, 74, 75, 76].
3. [cite_start]**Programs Preview:** A grid displaying top projects[cite: 79]. [cite_start]Cards must include project name, short description, image, and "learn more" button[cite: 80, 81, 82, 83, 84].
4. [cite_start]**Impact Section:** Animated statistics that count up when scrolled into view[cite: 90, 91, 97]. [cite_start]Metrics: Entrepreneurs supported, regions served, products sold, beneficiaries[cite: 93, 94, 95, 96].
5. [cite_start]**Join the Mission:** CTA section for volunteering, partnering, and collaborating[cite: 98, 99, 100, 101, 102].
6. [cite_start]**News Preview:** Grid showing the latest updates and stories[cite: 104, 105, 111].

### B. Programs Hub (`/src/app/programs/page.tsx`)
* [cite_start]Must include a filtering system, category tags, and a search bar[cite: 85, 86, 87, 88].
* [cite_start]The underlying data models must support the 6 core PSZ departments[cite: 221]:
  1. [cite_start]Mahkma Shajarkari (Plantation) [cite: 222]
  2. [cite_start]Ehsas ul Haiwanat (Animal Welfare) [cite: 223]
  3. [cite_start]Room Zia (Orphan Welfare) [cite: 224]
  4. [cite_start]Dar ul Aloom (Educational Development) [cite: 225]
  5. [cite_start]Tibi Imdad (Health Standards) [cite: 226]
  6. [cite_start]Wajood-e-Zan (Women Empowerment) [cite: 227]

### C. Program Detail Template (`/src/app/programs/[slug]/page.tsx`)
* [cite_start]Layout must include: Overview, Problem Being Addressed, PSZ Solution, Media Gallery, Updates, and a dedicated CTA[cite: 120, 121, 122, 123, 124, 125, 126].

### D. News & Resources (`/src/app/news/page.tsx`)
* [cite_start]Functions as a content hub with categories, article search, related articles, and social sharing functionality[cite: 128, 129, 130, 131, 133, 134].

## 5. Technical Directives for AI Agents
* [cite_start]**SEO-First:** You MUST use Next.js `metadata` exports on every page[cite: 183]. Use strictly semantic HTML tags (`<article>`, `<section>`, etc.) inside components.
* [cite_start]**Component Split:** Keep stateful logic (like the Impact animated counters or search bars) in isolated `"use client"` components[cite: 91, 117]. The parent pages must remain Server Components.
* **Service Interfaces:** Do not hardcode data directly into UI components. Define a TypeScript interface (e.g., `Program`), create a dummy service (`getPrograms()`), and call that service from the Server Component.