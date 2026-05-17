# Slide Show Data Portal

Local development and testing guide for the Next.js slide-show data portal.

## Prerequisites

- Node.js 20 or newer
- npm
- Google Chrome, for Playwright E2E tests

## Install

```powershell
npm install
```

## Configure local data

The app can run with built-in sample movement data. To use a Google Sheets CSV export instead, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` to a publicly readable CSV URL (the browser fetches it directly).

The CSV must include: `House Name`, `Floor`, `Unit`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`. `House Name` replaces the previous block field for filtering.

```powershell
Copy-Item .env.example .env.local
```

Useful local environment values:

| Variable | Purpose | Default behavior |
| --- | --- | --- |
| `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` | Public CSV URL for movement records | Uses sample data when empty |
| `NEXT_PUBLIC_DATA_REFRESH_MS` | Browser refresh interval for movement data | Set in `.env.example` |
| `NEXT_PUBLIC_SLIDE_DURATION_MS` | Time before advancing slides | Set in `.env.example` |

## Run locally

```powershell
npm run dev
```

Open <http://localhost:3000>.

There is currently no `npm start` script. Use `npm run dev` for local development, or `npm run build` to verify a production build.

## Test locally

Run unit tests:

```powershell
npm test
```

Run browser E2E tests:

```powershell
npm run test:e2e
```

The E2E test runner starts the Next.js dev server on `http://127.0.0.1:3000` and uses a short slide duration for faster assertions. If another server is already listening on port 3000, Playwright may reuse it; stop that server first when you want a clean E2E run against the current code.

## Build check

```powershell
npm run build
```

## Deploy to GitHub Pages

The app is a fully static Next.js export. The Google Sheets CSV is fetched directly by the browser at runtime (there is no server-side API route).

### Prerequisites

1. Publish your Google Sheet as CSV (File → Share → Publish to web → CSV).
2. Install the `gh-pages` helper (one-time):
   ```powershell
   npm install --save-dev gh-pages
   ```

### 1. Configure static export

`next.config.mjs` already sets `output: "export"` and `basePath: "/slide-show-data-portal"`. Update `basePath` if you fork to a different repo name.

### 2. Set environment variables

Create a `.env.production` file (or set the variable in your CI):

```
NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=0
```

When this variable is empty, the app falls back to the bundled sample data.

### 3. Build and deploy

```powershell
npm run build
npx gh-pages -d out -t
```

`-t true` makes sure dotfiles (e.g. `.nojekyll`) are published. Add an empty `out/.nojekyll` file before publishing so GitHub Pages does not strip `_next/`:

```powershell
New-Item -ItemType File -Path out\.nojekyll -Force | Out-Null
```

On the first run, enable GitHub Pages in the repository settings and point it to the `gh-pages` branch.

### Alternative: GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL: ${{ secrets.GOOGLE_SHEETS_CSV_URL }}
      - run: touch out/.nojekyll
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - id: deployment
        uses: actions/deploy-pages@v4
```

Add `GOOGLE_SHEETS_CSV_URL` as a repository secret in **Settings → Secrets and variables → Actions**.

