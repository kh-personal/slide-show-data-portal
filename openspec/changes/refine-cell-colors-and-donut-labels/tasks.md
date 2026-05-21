# Tasks

- [x] 1. Update floor-grid cell color logic
  - [x] 1.1 Add unit tests for `getRoomTone` covering matching empty/active/completed and non-matching fallback grey
  - [x] 1.2 Update `getRoomTone` and `buildFloorRows` so tone uses strict match of Entry Date + AM/PM
- [x] 2. Refine donut chart label placement
  - [x] 2.1 Add unit tests for donut chart annotations: lines only when displaced
  - [x] 2.2 Update `donut-chart.tsx` to only render leader lines for displaced labels
- [x] 3. Validate
  - [x] 3.1 `npm test`
  - [x] 3.2 `npm run test:e2e`
  - [x] 3.3 `npm run build`
  - [x] 3.4 `openspec validate refine-cell-colors-and-donut-labels --strict`
