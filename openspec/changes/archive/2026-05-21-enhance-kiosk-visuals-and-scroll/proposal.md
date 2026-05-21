## Why

The kiosk display needs stronger visual readability from a distance. Floor labels, unit header labels, flat cell states, and summary donut charts should be easier to distinguish on large screens. Operators also need a convenient way to navigate slides manually after pausing the slideshow.

## What Changes

- Enlarge floor number text in the left column of Slides 1-3 while keeping it contained inside each floor-label cell.
- Enlarge bottom unit header labels on Slides 1-3 while keeping them contained inside each unit-header cell.
- Change the unit header row background to a lighter, eye-protected color.
- Double the donut chart radius on Slide 4 and keep slice labels visible within the SVG area.
- Allow mouse-wheel up/down navigation between slides only while the slideshow is paused.
- Darken the yellow used for the Packing / active state.
- Render flat cells with no selected-session record as light grey.

## Impact

- Affected specs: `floor-grid-display`, `kiosk-slideshow`
- Affected code: floor grid styling, donut chart geometry, slideshow wheel handling, room tone styling, chart palette
- Affected tests: unit tests for tone and donut geometry; e2e tests for paused wheel navigation and visual layout constraints
