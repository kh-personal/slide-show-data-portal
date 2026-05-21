## 1. Tests First

- [x] 1.1 Add unit tests for empty flat cell tone and doubled donut geometry.
- [x] 1.2 Add e2e tests for enlarged floor/unit-header labels staying within cells, light unit header color, darker Packing color, light grey empty cells, doubled donut visual radius, contained donut labels, and paused wheel navigation.

## 2. Implementation

- [x] 2.1 Update floor-grid CSS to enlarge floor labels and bottom unit headers while preserving containment.
- [x] 2.2 Update bottom unit header background to a lighter eye-protected color.
- [x] 2.3 Update room tone logic/CSS so cells with no selected-session record render light grey.
- [x] 2.4 Darken the Packing / active yellow in cell CSS and chart palette.
- [x] 2.5 Double donut chart radii and expand SVG label bounds so labels remain visible.
- [x] 2.6 Add paused-only mouse-wheel slide navigation.

## 3. Validation

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `npm run build`.
- [x] 3.3 Run `npm run test:e2e`.
- [x] 3.4 Run `openspec validate enhance-kiosk-visuals-and-scroll --strict`.
