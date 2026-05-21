## Context

The portal currently keeps a `theme` state and renders a theme toggle button, although the kiosk should now always use light theme. Floor rows are currently built using selected Entry Date/AM/PM filters, which hides valid flat records from other sessions. Floor-cell details are rendered as separate rows for date, session, Entry, Exit, Pax, and CAS.

Donut labels are rendered around the SVG using leader lines, but labels are placed at slice midpoint Y positions. The duration chart has more slices, so those labels can overlap.

## Decision

- Remove `theme` state and the theme toggle button from `KioskPortal`; render `data-theme="light"` permanently.
- Change floor-grid row building to prefer a matching selected Entry Date/AM/PM record for each flat, then fall back to any record for the same house/floor/unit with Entry Date + AM/PM.
- Keep summary metrics and chart inputs filtered to the selected Entry Date/AM/PM.
- Render cell detail rows as:
  - `<entryDate> <AM/PM>`
  - `Entry <time> | Exit <time>`
  - `Pax <count>`
  - `CAS <count> ...`
- Increase hover magnifier vertical scale and visible overflow so all rows fit.
- Use light, contrast-safe backgrounds with dark text for empty/filled/pending/active/completed states where practical.
- For donut annotations, compute label candidates, split them by left/right side, sort by Y, enforce a minimum vertical gap, and draw leader lines from the slice to the final label position.

## Alternatives Considered

- Remove Entry Date/AM/PM filters from the UI entirely: rejected because summary metrics still need selected-session filtering.
- Show multiple records per flat: rejected because cells are small; use selected-session preference plus fallback.
- Custom HTML donut labels outside SVG: rejected as larger scope than adjusting the existing SVG annotations.
