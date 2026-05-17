## Data Model

Movement records use `houseName` as the canonical building field. CSV normalization reads `House Name`, `Floor`, `Unit`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`. Numeric fields are validated as before for floors 1-31 and units 1-8. CAS staff count is normalized as a number, and medical necessity is preserved as provided text.

## Filtering and Controls

The kiosk derives available house names from the current movement records. The selected house filters both floor range slides and summary metrics. If refreshed data no longer includes the selected house, the runtime falls back to the first available house. The control bar includes a house dropdown, dark/light theme toggle, and English/Traditional Chinese language toggle.

## Grid Display

Floor slides remain split into floors 1-16 and 17-31. A shared header row labels units as `Unit 01` through `Unit 08`, so individual cells do not repeat the unit label. Occupied cells display entry time, exit time, pax count, and CAS staff count. Empty cells remain present to preserve the grid.

Medical necessity has visual priority: any non-empty medical necessity makes the room cell red. Non-medical cells keep full-cell luggage warning backgrounds: green for counts 5-6 and purple for counts greater than 6. Medical cells keep the red background and show luggage warnings as a small bottom-right square in green or purple.

## Theme and Language

Theme styling is implemented through CSS variables for dark and light palettes. Language switching uses a typed translation dictionary for visible UI labels, controls, headings, summaries, and status text. Sheet-provided values such as house names and medical necessity text are not translated.

## Tests

Unit tests cover CSV normalization for the expanded schema, house filtering, summary calculations, medical/luggage tone priority, and locale/theme helpers. E2E coverage exercises house selection, unit headers, cell content, medical red cells with luggage indicators, light/dark switching, Traditional Chinese labels, and existing slideshow behavior.
