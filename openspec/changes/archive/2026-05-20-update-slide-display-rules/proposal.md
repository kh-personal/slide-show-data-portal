## Why

The kiosk display currently uses full-cell red medical highlighting, includes records with blank AM/PM values in session-specific views, and can let Slide 3 chart content overflow the visible area. The requested change makes the floor grid and summary slide clearer for kiosk viewing while aligning labels with updated operational terminology.

## What Changes

- Replace full-cell red styling for records with `Medical Necessity` on Slides 1 and 2 with a red cross icon in the top-right of each populated cell, next to the bookmark icon.
- Filter AM/PM session views strictly so AM shows only records whose CSV session value is `AM`, PM shows only records whose CSV session value is `PM`, and blank values are excluded from both session views.
- Keep Slide 3 pie/donut chart and labels within the viewable kiosk area.
- Rename flat status labels in all slides:
  - `未開始` becomes `未登記`
  - `訪問中` becomes `收拾中`
  - `Not Started` becomes `Not registered`
  - `Visiting` becomes `Packing`

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `floor-grid-display`: Medical necessity cell presentation changes from full-cell red highlighting to a red cross icon.
- `sheet-data-ingestion`: Session filtering excludes blank AM/PM records from both AM and PM views.
- `summary-metrics`: Summary chart layout and status labels change for kiosk visibility and updated terminology.
- `kiosk-slideshow`: Status labels shown across slides use the updated terminology.

## Impact

- Affects movement record filtering, floor-grid cell rendering, status label localization, summary chart layout CSS, unit tests, and Playwright e2e coverage.
