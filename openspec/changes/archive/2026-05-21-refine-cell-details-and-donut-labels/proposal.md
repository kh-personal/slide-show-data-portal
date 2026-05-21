## Why

The previous readability pass improved the floor grid and summary charts, but kiosk viewers still need clearer flat-cell details and easier inspection of individual cells. Donut labels should also be easier to read without changing the current chart size.

## What Changes

- Keep the current donut chart geometry and rendered chart size.
- Enlarge donut slice label text to at least double the previous size while keeping labels inside the SVG/card area.
- Keep floor number and unit header labels as large as possible while contained.
- Add a hover magnifier for flat cells: hovered cells visually double in width/height and increase detail font size.
- Show Entry Date and AM/PM above Entry inside flat cells when a record has those fields.
- Treat records with at least Entry Date and AM/PM as populated/filled cells with a white background, even when entry/exit time and counts are blank or zero.

## Impact

- Affected specs: `floor-grid-display`, `kiosk-slideshow`
- Affected code: `FloorGrid`, movement tone logic/model types, donut label CSS, floor-grid CSS
- Affected tests: unit tests for tone/rendering and e2e tests for visual containment, hover magnification, and donut labels
