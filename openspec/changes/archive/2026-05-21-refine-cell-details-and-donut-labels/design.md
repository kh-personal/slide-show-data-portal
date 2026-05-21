## Context

Floor grid cells currently derive their class from `getRoomTone(record)`. Records with no entry time are treated as `pending`, while cells without a record are `empty`. `FloorGrid` renders Entry, Exit, Pax, and CAS details, but not Entry Date or AM/PM.

The donut chart geometry was recently enlarged. The new requirement keeps that current size and only increases slice-label text readability.

## Decision

- Add a `filled` cell tone for records that have both Entry Date and AM/PM but no entry time. This separates "selected-session record exists" from "no record exists".
- Render Entry Date and AM/PM as the first two detail rows, without labels, whenever they are present on the record.
- Keep other detail rows visible with placeholders/defaults: Entry, Exit, Pax, CAS count, and CAS staff number when present.
- Style `.unit-square.warning-filled` with a white background and dark text; leave `.warning-empty` light grey for cells with no record.
- Add CSS hover magnification on `.unit-square:hover`: `transform: scale(2)`, larger detail font size, high z-index, and visible overflow so details are easier to read.
- Keep current donut radius constants and increase `.donut-slice-label` font size from 9px to at least 18px.

## Alternatives Considered

- JavaScript popover magnifier: more precise positioning, but larger scope and unnecessary for a kiosk mouse-hover interaction.
- Click-to-expand cells: better for touchscreens, but the request specifically asks for hover.
- Reverting donut radius: rejected because the request says to keep the current donut chart size.
