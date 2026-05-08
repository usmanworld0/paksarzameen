# Implementation: PSZ Main Web Phase 4 (Dynamic Hubs - Programs and News)

## Overview
Phase 4 adds dynamic, searchable content hubs and detail routes for Programs and News.
All pages use the existing typed service layer and preserve App Router server-first architecture.

## Implemented Routes
- `src/app/programs/page.tsx`: Programs hub with category filters and search.
- `src/app/programs/[slug]/page.tsx`: Program detail route with overview, problem addressed, PSZ solution, and photos.
- `src/app/news/page.tsx`: News and resources hub with categories, search, related-context indicators, and share actions.
- `src/app/news/[slug]/page.tsx`: Article detail route with full content, social sharing links, and related articles.

## Feature Components
- `src/features/programs/components/ProgramsHubClient.tsx`
- `src/features/news/components/NewsHubClient.tsx`

## Service Additions
- `src/lib/services/getProgramBySlug.ts`
- `src/lib/services/getArticleBySlug.ts`

## Metadata and Routing
- Added static metadata to hub pages.
- Added `generateMetadata` to both dynamic `[slug]` pages.
- Added `generateStaticParams` for program and article detail pre-generation from dummy service data.
- Invalid slugs route to `notFound()`.

## Assets
- Added placeholder media for detail layouts:
  - `public/images/placeholders/program-photo.svg`
  - `public/images/placeholders/news-cover.svg`

## Validation Goals
- Programs hub supports filtering and search.
- News hub supports filtering, search, and share links.
- Program detail includes required section structure.
- Article detail provides full read flow with related links.
