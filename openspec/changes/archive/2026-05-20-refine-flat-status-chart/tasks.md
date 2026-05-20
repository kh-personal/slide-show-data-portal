## 1. Tests

- [x] 1.1 Update unit tests so `deriveFlatStatus` returns `Not Started` (not `Not Reg`) and no longer maps any input to `Reg`.
- [x] 1.2 Update `getFlatStatusDistribution` test to expect the three-key shape `{ "Not Started", Visiting, Completed }`.
- [x] 1.3 Update translation/label tests for `Not Started` / `未開始`.

## 2. Implementation

- [x] 2.1 Change `FlatStatus` union and `FLAT_STATUSES` constant to `"Not Started" | "Visiting" | "Completed"`.
- [x] 2.2 Update `deriveFlatStatus` so the no-entry/no-exit and exit-only cases both return `Not Started`; keep override matching against the new union.
- [x] 2.3 Update `getFlatStatusDistribution` counts and `STATUS_COLORS` to drop `Reg` and rename `Not Reg` → `Not Started`.
- [x] 2.4 Update `i18n.ts`: replace `statusNotReg`/`statusReg` keys with `statusNotStarted`; en label `Not Started`, zh-Hant label `未開始`; update `FLAT_STATUS_KEY` map.
- [x] 2.5 Confirm `SummaryCharts` continues to render correctly with the three-slice array.

## 3. Verification

- [x] 3.1 Run unit tests (`npm test`).
- [x] 3.2 Run E2E tests (`npm run test:e2e`).
