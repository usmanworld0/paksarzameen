# PakSarZameen — HealthCare (standalone)

This folder contains a standalone Next.js app focused on the HealthCare section. It preserves the original UI, routes, and interactions while running as an independent site suitable for deployment to a subdomain (e.g. `healthcare.paksarzameenwfo.com`).

Quick start:

1. cd healthcare-site
2. npm install
3. Set environment variable `NEXT_PUBLIC_API_BASE` to your main site's base (e.g. `https://paksarzameenwfo.com`).
4. npm run dev

Notes:
- The client runtime rewrites relative `/api` requests to `NEXT_PUBLIC_API_BASE` so the original backend and business logic are used unchanged.
- To fully preserve auth/session behavior across subdomains, ensure cookies and auth tokens are configured for the parent domain (e.g. `Domain=.paksarzameenwfo.com` and appropriate SameSite settings).
