## Why

The kiosk is now intended to run in light theme only, and several readability refinements are needed for floor cells and summary donut labels. Floor cells should show available flat information even when the record is outside the currently selected Entry Date/AM/PM, while selected filters continue driving the controls and summary metrics.

## What Changes

- Remove the dark/light theme toggle and keep the kiosk in light theme.
- Keep unit header labels as large as possible while contained.
- Show flat-cell records from the selected house even when they are not in the currently selected Entry Date/AM/PM, preferring the selected session record when present.
- Group flat-cell details into compact rows: `Entry Date AM/PM`, then `Entry | Exit`, then Pax/CAS rows.
- Make hover magnification tall enough to cover all detail text.
- Improve light-theme, eye-protective contrast colors.
- Spread donut slice labels wider with leader lines so dense Duration Distribution labels do not overlap.

## Impact

- Affected specs: `floor-grid-display`, `kiosk-slideshow`
- Affected code: `KioskPortal`, movement row building, `FloorGrid`, donut annotation layout, CSS
- Affected tests: unit tests for floor row fallback and grouped rendering; e2e tests for light-only controls, magnifier sizing, and donut label spacing
