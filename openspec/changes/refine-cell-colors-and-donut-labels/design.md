# Design

## Cell color rules

`getRoomTone(record, selectedDate, selectedSession)` returns:

- `empty` (light grey) when record is null OR the record's Entry Date+AM/PM does not equal the selected period.
- `filled` (white) when matching period AND no entry time.
- `active` (yellow) when matching period AND entry time set AND no exit time.
- `completed` (green) when matching period AND both entry time and exit time set.

`buildFloorRows` still merges selected + fallback records (so the cell can show details from any record), but tone is computed using the rule above so non-matching records render as grey.

## Donut chart labels

Replace the always-on polyline annotations with a minimal label placement:

1. Compute each label's natural radial position just outside the ring.
2. Sort labels per side (left/right) by Y.
3. Walk top-to-bottom: if a label's Y is within `LABEL_MIN_GAP` of the previous accepted label, push it down by the deficit (mark it as displaced).
4. Render a short straight leader line ONLY for displaced labels (from the ring edge to the label start). Non-displaced labels render with no line.

This keeps non-dense charts clean and only adds connector lines for dense ones like Duration Distribution.
