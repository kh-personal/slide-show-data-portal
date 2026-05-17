## Why

The kiosk portal needs to match the expanded Google Sheet used by operations. The sheet now identifies buildings by house name, includes CAS staff and medical necessity fields, and operators need display controls for house selection, light/dark viewing, and English/Traditional Chinese labels.

## What Changes

- Treat `House Name` as the canonical building selector, replacing the previous block field.
- Normalize the expanded CSV columns, including CAS staff count and medical necessity.
- Filter floor grids and summaries by selected house name.
- Move unit labels into a shared `Unit 01` through `Unit 08` header row.
- Show entry, exit, pax, and CAS staff values in occupied room cells.
- Highlight medical necessity cells red while preserving luggage warnings as a bottom-right indicator on medical cells.
- Add light/dark theme and English/Traditional Chinese language controls.
- Update tests, sample data, and local data documentation for the new schema.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `sheet-data-ingestion`: Normalizes the expanded house-based CSV schema.
- `floor-grid-display`: Renders house-filtered grids, unit headers, CAS staff values, and medical/luggage styling.
- `kiosk-runtime`: Provides display preference controls for house, theme, and language.
- `summary-metrics`: Computes and labels summary metrics for the selected house.

## Impact

- Google Sheet exports must include the new column names documented in the README.
- Movement record shape and sample data include house name, CAS staff count, and medical necessity.
- UI state now includes selected house, theme, and language preferences.
- Unit and E2E coverage is extended for ingestion, display, controls, and styling behavior.
