# House Controls, Theme, and Language Design

## Problem

The kiosk portal needs to consume an expanded Google Sheet schema, filter the displayed building by house name, show extra room-cell details, make medical rooms visually urgent, remove repeated unit labels from cells, and add light/dark plus English/Traditional Chinese controls.

## Approach

Use a focused extension of the existing three-slide kiosk architecture. Keep polling, slideshow timing, and fixed-aspect layout intact while expanding the typed data model, grid rendering, and control state.

## Data model and sheet ingestion

Movement records will use `houseName` as the canonical building selector instead of `block`. CSV normalization will read `House Name` as the required house field and continue to normalize floor, unit, entry time, exit time, pax count, and luggage count. It will also normalize:

- `Staff Nos of 民安隊 staff` as `casStaffCount`
- `Medical Necessity` as `medicalNecessity`

Rows outside floors 1-31 or units 1-8 remain invalid. Sample data will include multiple house names plus staff and medical fields so local development and tests exercise the new behavior.

## Filtering and controls

The kiosk shell will derive available house names from the loaded records. A compact top-right control bar will provide:

- House Name dropdown
- dark/light theme toggle
- English/Traditional Chinese language toggle

The selected house filters both floor-grid pages and the summary slide. If refreshed data no longer contains the selected house, the portal will select the first available house.

## Floor grid display

Each floor-grid page will show a single header row with `Unit 01` through `Unit 08`. Individual room cells will no longer repeat the unit label. Each populated room cell will display entry time, exit time, pax count, and 民安隊 staff count.

Medical necessity has visual priority: if `medicalNecessity` is present and non-empty, the room cell background is red. Luggage status remains visible on medical cells as a small bottom-right square: green for luggage count 5-6 and purple for luggage count greater than 6. Non-medical cells keep the existing full-cell luggage warning background behavior.

## Theme and language

Theme styling will use CSS variables with two palettes: the existing dark kiosk look and a new light theme. Language switching will use a small typed translation dictionary for visible labels, headings, metric labels, controls, and status text. Sheet-provided values, including house names and medical text, will display exactly as provided.

## Testing

Unit tests will cover CSV normalization, house-name filtering, medical/luggage tone priority, and summary calculations for selected houses. E2E tests will cover the house dropdown, unit headers without repeated cell labels, medical red cells with luggage indicators, light/dark switching, Traditional Chinese switching, and slideshow behavior.
