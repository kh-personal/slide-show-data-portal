## 1. Project Setup

- [x] 1.1 Create the Next.js App Router project scaffold in the repository root.
- [x] 1.2 Add dependencies for TanStack Query, CSV parsing, unit tests, and e2e tests.
- [x] 1.3 Add environment configuration examples for the Google Sheets CSV source and kiosk timings.

## 2. Data Ingestion

- [x] 2.1 Define typed movement record, grid, and summary metric models.
- [x] 2.2 Implement CSV parsing with common column aliases and deterministic sample fallback data.
- [x] 2.3 Implement the `/api/movements` route that fetches configured CSV data server-side.
- [x] 2.4 Add unit tests for row normalization, fallback records, and summary calculations.

## 3. Kiosk UI

- [x] 3.1 Add TanStack Query provider and movement polling hook with 60-second refetching.
- [x] 3.2 Implement unit square and floor grid components for 8 units per floor.
- [x] 3.3 Implement luggage warning styles for default, green, and purple states.
- [x] 3.4 Implement summary metric cards for entries, pax, luggage totals, and warnings.

## 4. Slideshow Runtime

- [x] 4.1 Implement the 3-slide kiosk shell for floors 1-16, floors 17-31, and summary.
- [x] 4.2 Implement upward CSS transform transitions without blank loading states.
- [x] 4.3 Keep slideshow timing independent from background polling refreshes.
- [x] 4.4 Add fixed-aspect fullscreen kiosk layout styling.

## 5. Validation

- [x] 5.1 Add e2e tests for initial floor grid content and summary visibility.
- [x] 5.2 Add e2e tests for automatic slide advancement.
- [x] 5.3 Run unit tests.
- [x] 5.4 Run e2e tests.
