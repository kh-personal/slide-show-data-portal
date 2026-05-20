## Context

The control bar is rendered as a flex row anchored top-right on the kiosk stage. The three `<select>` elements (Entry Date, AM/PM, House Name) expand their native dropdown menu downward. With all 7 controls on a single row, the dropdowns originate near the top of the stage and can extend over the 6 summary metric boxes (rendered immediately below the slide header on the summary slide). Splitting controls into two rows places dropdown selects on the upper row only and keeps overall bar width narrower, leaving the metric grid below clear of overlap.

## Decision

- Change `.control-bar` to `flex-direction: column` with two child `.control-row` flex containers.
- Upper `.control-row` contains the three `<label>+<select>` controls (Entry Date, AM/PM, House Name).
- Lower `.control-row` contains the previous-slide button, the Pause/Play toggle, the next-slide button, the theme button, and the language button — in that order, so the pause toggle stays centered between nav buttons as today.
- Keep the bar absolutely positioned at the top-right of `.kiosk-stage` with the existing pill background and shadow.
- No JS behavior change; only DOM structure + CSS.

## Alternatives Considered

- Constraining dropdown menus to open upward: not portable across browsers; native `<select>` menu placement is controlled by the browser.
- Replacing native selects with a custom dropdown that opens upward or as an overlay: large scope increase for a layout problem.
