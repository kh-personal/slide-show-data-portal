## Why

The kiosk portal currently defaults to dark theme and English, which is sub-optimal for the Cantonese-speaking residents of Wang Fuk Court. Slides 1 and 2 (floor grids) provide no high-level context about building status without navigating to Slide 3, and the README gives no guidance for GitHub Pages deployment. The codebase also has accumulated complexity that makes future changes harder to maintain, and test coverage for the new behaviours is absent.

## What Changes

- **Default theme changed** from `"dark"` to `"light"` in `KioskPortal` initial state.
- **Default language changed** from `"en"` to `"zh-Hant"` in `KioskPortal` initial state.
- **Summary stats mini-header added** to Slide 1 and Slide 2: shows the same 5 metric figures from Slide 3 (total entries, total pax, total luggage, excessive luggage warnings, moderate luggage warnings) at a smaller scale inside the floor-grid slide header.
- **Refactor**: extract a reusable `SummaryStatsBar` component; simplify prop threading in `KioskPortal`; remove duplicate label derivation.
- **README updated** with GitHub Pages deployment instructions (static export via `next export`, `gh-pages` branch workflow, and caveats about Next.js API routes).
- **Unit tests** added for the `SummaryStatsBar` rendering logic.
- **E2E tests** updated/added to assert the stats bar appears on slides 1 and 2, default theme is `light`, and default language is `zh-Hant`.

## Capabilities

### New Capabilities

- `slide-stats-bar`: A compact stats strip rendered inside the floor-grid slide header on Slides 1 and 2, showing the 5 summary metric figures at reduced scale so operators can see building-wide status without leaving the floor view.

### Modified Capabilities

- `kiosk-slideshow`: Default theme is `light` and default language is `zh-Hant`.
- `summary-metrics`: `SummaryMetrics` logic extracted into a reusable `SummaryStatsBar` component that can render at both full-size (Slide 3) and compact-size (Slides 1 & 2).

## Impact

- `src/components/kiosk-portal.tsx`: initial state defaults changed; `SummaryStatsBar` rendered inside `FloorGrid` calls.
- `src/components/floor-grid.tsx`: accepts and renders optional `SummaryStatsBar`.
- `src/components/summary-metrics.tsx`: refactored into `SummaryStatsBar` with a `compact` prop.
- `src/lib/movements.ts`: no logic changes, but props passed from `KioskPortal` simplified.
- `tests/unit/`: new test file for `SummaryStatsBar`.
- `tests/e2e/portal.spec.ts`: new assertions for default language, default theme, and stats bar visibility.
- `README.md`: new GitHub Pages deployment section added.
