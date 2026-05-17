## 1. Data Ingestion

- [x] 1.1 Update movement record types to use house name and include CAS staff count and medical necessity.
- [x] 1.2 Update CSV normalization and aliases for `House Name`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`.
- [x] 1.3 Update deterministic sample data for multiple houses, CAS staff counts, medical necessity, and luggage warning cases.
- [x] 1.4 Add or update unit tests for expanded row normalization and selected-house calculations.

## 2. Controls and Localization

- [x] 2.1 Add house dropdown state derived from movement records.
- [x] 2.2 Add dark/light theme preference handling.
- [x] 2.3 Add English and Traditional Chinese translations for visible portal labels.
- [x] 2.4 Ensure selected house, theme, and language controls update the kiosk display.

## 3. Grid and Summary Display

- [x] 3.1 Filter floor range slides by selected house name.
- [x] 3.2 Move unit labels into a shared `Unit 01` through `Unit 08` header row.
- [x] 3.3 Update occupied room cells to display entry, exit, pax, and CAS staff values.
- [x] 3.4 Apply medical necessity red styling and preserve luggage warnings as indicators on medical cells.
- [x] 3.5 Update summary wording and calculations for the selected house.

## 4. Documentation and Specs

- [x] 4.1 Update README local data documentation with the expected Google Sheet CSV columns.
- [x] 4.2 Fill proposal, design, task list, and delta specs for this OpenSpec change.

## 5. Validation

- [x] 5.1 Run targeted unit coverage for movement data behavior.
- [x] 5.2 Run TypeScript validation after source changes.
- [x] 5.3 Run final full verification/build and E2E validation in Task 7.
