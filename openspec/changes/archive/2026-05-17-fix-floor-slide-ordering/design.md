## Context

The kiosk slideshow has two floor-grid slides: Slide 1 for floors 1-16 and Slide 2 for floors 17-31. The requested behavior is a presentation-only ordering fix so each slide lists its floors in ascending order within its configured range.

## Goals / Non-Goals

**Goals:**
- Render Slide 1 rows from 1/F through 16/F in ascending order.
- Render Slide 2 rows from 17/F through 31/F in ascending order.
- Add tests that prevent the ordering from regressing.

**Non-Goals:**
- Change data ingestion, Google Sheets parsing, polling, summary metrics, styling, or slide timing.
- Change the configured floor ranges for either slide.

## Decisions

- Keep floor ordering local to the floor-grid rendering path instead of changing source data normalization. The source data can arrive in any order, while each floor-grid slide owns its display order.
- Use tests against rendered labels/rows to verify user-visible ordering rather than only testing helper internals.

## Risks / Trade-offs

- Existing text or E2E selectors may assume a previous row position -> update tests to assert the new user-visible sequence explicitly.
