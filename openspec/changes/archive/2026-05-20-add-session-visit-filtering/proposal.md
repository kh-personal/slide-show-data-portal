## Why

The CSV now identifies which flats are eligible for a specific visit date and AM/PM session. The kiosk must let operators select that session first, then show only eligible houses, session-aware room status, and session-aware totals.

## What Changes

- Add `Entry Date` and `AM/PM` to the supported CSV schema before `Entry Time`.
- Add required `Entry Date` and `AM/PM` controls before the house selector; filter selectable houses to records matching the selected session.
- Replace luggage warning colors with a right-side bookmark marker for flats in the selected session.
- Color selected-session flats by movement state: grey for no entry/exit, yellow for active visit, and pink-blue for completed visit.
- Rename and redefine metric cards to session-focused flat and pax counts, including a new `Completed Pax` card on all three slides.
- Remove the CSA Staff In-Flat Duration and CSA Staff Count Distribution chart content from the summary slide.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sheet-data-ingestion`: Normalize `Entry Date` and `AM/PM` from the expanded CSV format.
- `kiosk-runtime`: Require session date and AM/PM selection before house selection and filter houses by the selected session.
- `floor-grid-display`: Replace luggage warning color semantics with selected-session bookmark markers and visit-state colors.
- `summary-metrics`: Redefine metric cards and remove the two CSA summary chart contents.

## Impact

- Affected code: CSV normalization, movement selectors/summaries, kiosk controls, floor grid rendering, summary cards, summary charts, sample data, styles, unit tests, and E2E tests.
- No new runtime dependencies are expected.
