Vercel deployment notes for psz_main_web

Quick steps (dashboard):

1. In Vercel, create a new project and connect your repository.
2. When configuring the project, set the "Root Directory" to `psz_main_web`.
3. Install Command: `npm install` (or leave blank to use Vercel default).
4. Build Command: `npm run build`
5. Output Directory: leave empty (Next.js on Vercel manages the output).
6. Set any environment variables in the Vercel dashboard (e.g. NEXT_PUBLIC_* keys).
7. Deploy.

Quick steps (CLI):

- From the repo root you can run:

```bash
# deploy interactively and ensure the project root is set to psz_main_web
vercel --cwd=psz_main_web

# or to deploy production immediately
vercel --prod --cwd=psz_main_web
```

Notes:
- The project `package.json` in `psz_main_web` already contains `build` and `dev` scripts (`next build`, `next dev`).
- If your repo is a monorepo and you prefer not to set the root in the dashboard, ensure you pass `--cwd=psz_main_web` when using the CLI.
- If you need a specific Node version, configure it in the Vercel project settings or add an `engines` field in `psz_main_web/package.json`.
