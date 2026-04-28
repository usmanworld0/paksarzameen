# PakSarZameen — Dog Adoption (standalone)

This repository folder contains a standalone Next.js app focused only on the Dog Adoption section. It preserves the original UI, routes, and interaction patterns but runs as an independent site suitable for deployment to a subdomain (e.g. `dogs.paksarzameenwfo.com`).

Quick start:

1. cd dog-site
2. npm install
3. Set environment variable `NEXT_PUBLIC_API_BASE` to your main site's API base (e.g. `https://paksarzameenwfo.com`).
4. npm run dev

Notes:
- This scaffold keeps the existing dog adoption UI and uses the original site's API endpoints by default. That preserves backend/business logic without copying the full server auth stack.
- To run server-side API routes from this project instead, copy and wire the original API routes and DB env variables; be careful to preserve auth.
