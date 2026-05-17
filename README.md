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

The app can run with built-in sample movement data. To use a Google Sheets CSV export instead, copy `.env.example` to `.env.local` and set `GOOGLE_SHEETS_CSV_URL`.

The CSV must include: `House Name`, `Floor`, `Unit`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`. `House Name` replaces the previous block field for filtering.

```powershell
Copy-Item .env.example .env.local
```

Useful local environment values:

| Variable | Purpose | Default behavior |
| --- | --- | --- |
| `GOOGLE_SHEETS_CSV_URL` | CSV source for movement records | Uses sample data when empty |
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

> **Important caveat:** GitHub Pages serves only static files. The server-side `/api/movements` route (which proxies Google Sheets data) **will not run** on GitHub Pages. You must use the public CSV endpoint instead.

### Prerequisites

1. Your Google Sheet must be published as a CSV (File → Share → Publish to web → CSV).
2. Install the `gh-pages` helper (one-time):
   ```powershell
   npm install --save-dev gh-pages
   ```

### 1. Configure static export

Add `output: "export"` to `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
};

export default nextConfig;
```

If the site is hosted at a sub-path (e.g. `https://<user>.github.io/<repo>/`), also set:

```js
basePath: "/<repo>",
```

### 2. Set environment variables

Because `/api/movements` is unavailable in a static export, the client must fetch the CSV directly. Set `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` to your public CSV URL in a `.env.production` file:

```
NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=0
```

The app's CSV parsing path in `src/lib/csv.ts` handles this automatically when the variable is set.

### 3. Build and deploy

```powershell
npm run build
npx gh-pages -d out
```

This publishes the `out/` folder to the `gh-pages` branch. On first run, enable GitHub Pages in the repository settings and point it to the `gh-pages` branch.

### Alternative: GitHub Actions

Create `.github/workflows/deploy.yml` to automate deployment on every push to `main`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL: ${{ secrets.GOOGLE_SHEETS_CSV_URL }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

Add `GOOGLE_SHEETS_CSV_URL` as a repository secret in Settings → Secrets and variables → Actions.

