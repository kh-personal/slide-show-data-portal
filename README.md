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

