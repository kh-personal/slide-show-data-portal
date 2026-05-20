## Context

Movement records currently identify a flat by house, floor, and unit and derive state from entry/exit times. The new CSV adds `Entry Date` and `AM/PM`, making a flat eligible for a particular visit session even before it has entry/exit timestamps.

## Decisions

- Store `entryDate` and `session` on every `MovementRecord`. Keep dates as display strings in the CSV format `MM/DD/YYYY` instead of converting them, because the requirements define the CSV/display format and filtering only needs exact matches.
- Derive session choices from normalized records in first-seen order. The kiosk chooses the first available date and session when data loads or when a selected value disappears after refresh.
- Filter house options by selected `entryDate` and `session`. Floor rows and summaries use the selected session plus house.
- Replace luggage-based tones with session visit-state tones:
  - `pending`: selected-session flat with no entry and no exit -> grey.
  - `active`: selected-session flat with entry and no exit -> yellow.
  - `completed`: selected-session flat with entry and exit -> pink-blue.
  - medical necessity continues to use red as the highest-priority full-cell warning.
- Show a bookmark marker on the right side of every populated flat that matches the selected session. Luggage count no longer changes cell colors or marker colors.
- Redefine summary metrics over the selected session and selected house:
  - `Total Reg Flats Today`: all selected-session flats for the selected house.
  - `Total Pax Today`: pax count across all selected-session flats for the selected house, regardless of entry status.
  - `Active Flats`: count with entry time and no exit time.
  - `Active Pax`: pax count for active flats.
  - `Completed Flats`: count with both entry and exit time.
  - `Completed Pax`: pax count for completed flats.
- Keep the first two summary donut charts. Remove the last two chart cards entirely so the summary page has empty space for future charts rather than obsolete CSA chart content.

## Risks / Trade-offs

- Exact date matching is simple and preserves the CSV format, but rows with inconsistent date formatting will form separate date options.
- The existing `flatStatus` type can remain for current charts and status distribution; session summary logic should use entry/exit directly to avoid ambiguity from explicit status overrides.

## Test Strategy

- Unit tests for CSV normalization of `Entry Date` and `AM/PM`.
- Unit tests for session option derivation, house filtering, floor row filtering, room tones, and redefined summary metrics.
- Component/unit tests for six metric cards and the new labels.
- E2E tests for selecting date/session before house selection, filtered house options, bookmark/status styling, renamed metrics, and reduced summary charts.
