# Tasks

## 1. Data model & ingestion
- [x] 1.1 Add `csaStaffNo: string` and `flatStatus: FlatStatus` to `MovementRecord`; derive `flatStatus` from entry/exit times with optional sheet override.
- [x] 1.2 Extend CSV parser aliases for `CSA Staff No` / `casstaffno` and `Flat Status` / `flatstatus`.
- [x] 1.3 Update sample data with varied CSA staff numbers, flat statuses, and start times spanning all duration buckets.

## 2. Summary charts
- [x] 2.1 Add helpers in `src/lib/movements.ts`: `getDurationBucket(minutes)`, `getFlatStatusDistribution(records)`, `getDurationDistribution(records, now)`, `getCsaInFlatDurationDistribution(records, now)`, `getCsaStaffCountDistribution(records)`.
- [x] 2.2 Create reusable `<PieChart />` SVG component with rounded border, legend, and percentage slices.
- [x] 2.3 Render 2×2 grid of pie charts on `summary-slide.tsx` under the metric cards.

## 3. Pause & manual navigation
- [x] 3.1 Extract `useSlideshow` hook with `paused`, `pause`, `resume`, `next`, `prev`, `goTo` actions.
- [x] 3.2 Add pause/play and prev/next buttons in the control bar; disable navigation when not paused (auto mode).
- [x] 3.3 Ensure timer resets cleanly on resume and unmount.

## 4. I18n extensions
- [x] 4.1 Add translation keys for floor label format (en `{n}/F`, zh `{n}樓`), unit label format (zh `{n}室`).
- [x] 4.2 Add house-name translation map (Wang Yan→宏仁閣, Wang Do→宏道閣, Wang San→宏新閣, Wang Kin→宏建閣, Wang Tai→宏泰閣, Wang Cheong→宏昌閣, Wang Shing→宏盛閣, Wang Chi→宏志閣).
- [x] 4.3 Add chart titles, flat status labels, pause/play/prev/next labels.
- [x] 4.4 Apply translations across floor-grid (floor + unit headers), control bar (house dropdown labels), and summary-slide (chart titles + legends).

## 5. Visual redesign
- [x] 5.1 Refresh CSS color palette for dark and light themes (accent gradients, elevated cards, refined typography).
- [x] 5.2 Style pie charts (rounded borders, drop shadow, theme-aware colors).
- [x] 5.3 Polish control bar styling for new buttons.

## 6. Refactor
- [x] 6.1 Extract `useKioskControls` hook to centralize house/theme/language/paused state.
- [x] 6.2 Split `kiosk-portal.tsx` so JSX is composed of focused presentational pieces.

## 7. Verification
- [x] 7.1 Update unit tests for new helpers, derivations, translations.
- [x] 7.2 Update / add E2E tests for pause + manual nav, chart rendering, Chinese floor/unit/house labels, CSA staff number display.
- [x] 7.3 Run `npm test`, `npm run test:e2e`, `npm run build`, `npx tsc --noEmit`, `openspec validate charts-pause-redesign --strict`.
