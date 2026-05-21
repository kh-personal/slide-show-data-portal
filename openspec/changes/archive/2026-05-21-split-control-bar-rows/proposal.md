## Why

The top-right control bar currently renders all controls (Entry Date, AM/PM session, House Name, Prev/Pause/Next, Theme, Language) on a single horizontal row. When a dropdown is opened it extends downward over the 6 summary metric boxes on the summary slide and over the compact stats bar on the floor-grid slides, obscuring information for kiosk viewers.

Splitting the control bar into two rows shortens the row containing dropdowns (Entry Date, AM/PM, House Name) so that the open dropdown menus appear lower (relative to a shorter bar) — but more importantly the lower row of buttons displaces nothing below it because the bar is anchored to the top-right and the dropdowns will not need to span the full width of the panel. This keeps dropdown menus from covering the 6 top summary boxes.

## What Changes

- Split `.control-bar` into two rows:
  - Upper row: Entry Date select, AM/PM (session) select, House Name select.
  - Lower row: Previous slide button, Pause/Play toggle, Next slide button, Theme button, Language button.
- Keep the bar positioned at the top-right of the stage with the existing pill styling.
- Ensure dropdown menus opened from the upper row do not overlap any of the 6 summary metric boxes on the summary slide on standard landscape kiosk viewports.

## Impact

- Affected specs: `kiosk-slideshow`.
- Affected code: `src/components/kiosk-portal.tsx` (wrap controls in two row containers), `app/globals.css` (`.control-bar` becomes column; new `.control-row` styling).
- Tests: e2e test confirming the bar renders two rows and that opening the House Name dropdown does not cover any summary metric card.
