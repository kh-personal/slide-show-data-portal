## Why

The floor-grid slides currently do not present floors in the required visual sequence. For kiosk readability, Slide 1 must show floors 1/F through 16/F in ascending order, and Slide 2 must show floors 17/F through 31/F in ascending order.

## What Changes

- Ensure Slide 1 renders the 1/F to 16/F rows in ascending floor order.
- Ensure Slide 2 renders the 17/F to 31/F rows in ascending floor order.
- Add or update tests to lock the expected ordering for both floor-grid slides.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `kiosk-slideshow`: Clarify the expected ascending floor order for the two floor-grid slides.

## Impact

- Affects floor-grid rendering and any tests that assert the displayed floor row order.
- No API, data schema, or dependency changes.
