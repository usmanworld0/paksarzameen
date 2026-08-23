# Changelog - August 19 Session

## Paksarzameen Main Site
- **Core Mission Text**: Increased the font size and contrast for the core mission statement ("Systemic unequal systems of power...") to make it much more prominent using new CSS classes (`.highlightText`, `.highlightTextLight`) in `HomeClient.tsx`.
- **News & Features Section**: Created a new `NewsPaperShowcase` component designed to look like a physical, vintage newspaper stack (flat, minimalist, high-contrast, multi-column broadsheets with big watermark numbers). Removed department logos from news slides in favor of actual photography.

## Education Counselling Site
### 1. Hero Section (`TunnelHero.tsx`)
- Changed the pre-title to **"PakSarZameen Education Advisory"**.
- Replaced the main headline with **"Undergraduate & Graduate Study Abroad Crash Course"**.
- Added the date text **"4th September 2026 - 15 December 2026"** in a minimal size.
- Removed the "View Track Record" button from the hero.

### 2. Navigation (`Navbar.tsx`)
- Removed the "About Us" tab and replaced it with a **"Scholarships"** tab.
- Removed the Call to Action button (previously "Book 30 minutes free consultation") entirely from the navbar across both desktop and mobile views.

### 3. Admissions Pathways & Scholarships
- **Admissions Pathways**: Added a new, ultra-minimal and professional section right below the hero with two pathways (cards) for **Graduate** and **Undergraduate** admissions. These cards link to the relevant counselling service pages. Included a subtle micro-marquee for extra polish.
- **Global Scholarships Section**: Removed the old "Admissions Track Record" section and replaced it with a highly interactive `ScholarshipsShowcase` component. This section showcases top global scholarships (Fulbright, Chevening, DAAD, Erasmus+, Australia Awards, Gates/Rhodes) with custom, high-fidelity SVG logos, region filtering, and detailed scholarship data. 

### 4. Color Scheme Overhaul
- **Removed Orange Accents**: Completely removed all orange accent colors (`#FF5A26`, `#f23a00`) across the entire education counselling site to ensure consistency with the main site.
- **Applied Forest Green Theme**: Replaced the orange with the main site's forest green (`#0f7a47`, `#0b5c35`). Updated `globals.css`, buttons, hover states, focus borders, active tabs, and bullet points in files including `UniversitiesDirectory.tsx`, `Footer.tsx`, `TunnelHero.module.css`, `CounsellingClient.tsx`, and `UniversityDetailClient.tsx`.
