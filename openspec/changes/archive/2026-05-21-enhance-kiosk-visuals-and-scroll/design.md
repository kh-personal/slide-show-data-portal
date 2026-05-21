## Context

The floor grid is rendered with CSS grid rows that already constrain cell height. Floor labels use `.floor-label`, unit headers use `.unit-header`, and flat cells use `.unit-square.warning-*` classes derived from `getRoomTone`.

The summary charts are SVG donuts generated from constants in `donut-chart.tsx`. The current outer radius is 70px and labels are placed just outside that radius using leader lines.

The slideshow state is centralized in `useSlideshow`; manual next/previous navigation already exists and is enabled while paused.

## Decision

- Use CSS `clamp()` font sizes for `.floor-label` and `.unit-header`, with hidden overflow and centered text so larger labels stay within their cells.
- Make `.unit-header` use a light eye-protected green/blue gradient and dark text.
- Treat cells without a selected-session record as `warning-empty`, styled light grey; keep records with missing times as the existing pending state.
- Darken active / Packing yellow in both `.unit-square.warning-active` and `STATUS_COLORS.Visiting`.
- Double donut radii by changing the SVG geometry constants from outer 70 / inner 42 to outer 140 / inner 84, and expand the viewBox and leader radius so slice labels remain inside the SVG coordinate area.
- Add `onWheel` to `.kiosk-stage`; when paused, wheel down navigates next and wheel up navigates previous. When not paused, wheel input does not navigate.

## Alternatives Considered

- Scaling the entire floor grid: rejected because it risks row overlap and undermines prior landscape fit work.
- Custom wheel physics / inertial scrolling: rejected because the requirement is slide-to-slide navigation, not free scrolling.
- CSS transform scaling for donuts: rejected because it would enlarge labels and paths together without improving label containment.
