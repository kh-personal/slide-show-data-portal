## 1. Tests First

- [x] 1.1 Add/Update unit tests asserting `KioskPortal` renders three floor-grid slides for ranges 1-10, 11-20, and 21-31, plus the summary slide, totalling four slides in the slideshow loop.
- [x] 1.2 Add unit tests for the new translation keys (`floorsOneToTen`, `floorsElevenToTwenty`, `floorsTwentyOneToThirtyOne`, `slideFour`) in both English and Traditional Chinese.
- [x] 1.3 Update e2e tests to verify the kiosk cycles through four slides and the 11-floor slide displays all 11 floor rows fully within the stage area without clipping.

## 2. Implementation

- [x] 2.1 Update `KioskPortal` to build three floor-row ranges (1-10, 11-20, 21-31), render three `<FloorGrid>` instances with the correct titles and slide numbers, and set `SLIDE_COUNT = 4`.
- [x] 2.2 Update `src/lib/i18n.ts`: remove `floorsOneToSixteen` / `floorsSeventeenToThirtyOne`, add `floorsOneToTen`, `floorsElevenToTwenty`, `floorsTwentyOneToThirtyOne`, and `slideFour` for English and Traditional Chinese.
- [x] 2.3 Update `app/globals.css`: change `.slide-track` height from `300%` to `400%`; make `.unit-header-row` and `.floor-row` use `flex: 1 1 0; min-height: 0;` so floor rows share available vertical space; add `min-height: 0; overflow: hidden;` on `.unit-square` so cell content cannot force rows taller.
- [x] 2.4 Update any usages of the removed/replaced translation keys in components (e.g. summary slide referencing `slideThree`) so the summary slide is labelled `slideFour`.

## 3. Validation

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `npm run test:e2e`.
- [x] 3.3 Run `npm run build` to confirm the static export still succeeds.
- [x] 3.4 Run `openspec validate split-floor-slides --strict` and resolve any issues.
