## Why

Two floor-grid slides (1-16, 17-31) crowd the kiosk view. Splitting into three slides (1-10, 11-20, 21-31) reduces the row count per slide so floor rows render larger and remain fully visible on any landscape (width > height) screen without overlapping.

## What Changes

- Replace the two floor-grid slides with three:
  - Slide 1 shows floors 1/F - 10/F (10 floors)
  - Slide 2 shows floors 11/F - 20/F (10 floors)
  - Slide 3 shows floors 21/F - 31/F (11 floors)
- The summary slide becomes Slide 4 and the slideshow now loops over four slides.
- Update the floor-grid layout so the floor rows always fit the available vertical space without overlapping or being clipped on any kiosk screen with width > height, given the new maximum row count of 11 floors per slide.
- Update localized titles, slide-number labels, and translations to match the new slide ordering.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `floor-grid-display`: Floor range partitioning changes from two slides (1-16, 17-31) to three slides (1-10, 11-20, 21-31), and floor rows MUST fit within the stage height for landscape kiosk viewports.
- `kiosk-slideshow`: The slideshow loops over four slides (three floor-grid slides plus the summary slide) instead of three.

## Impact

- Floor grid splitting logic in `KioskPortal`, slide count constant, slide-track CSS height, slide row sizing CSS, i18n keys/translations, floor-grid title rendering, and corresponding unit and e2e tests.
