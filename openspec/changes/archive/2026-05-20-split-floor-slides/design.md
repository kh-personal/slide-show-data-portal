## Approach

### Slide partitioning

`KioskPortal` currently constructs two `buildFloorRows` ranges (1-16 and 17-31). Replace with three ranges (1-10, 11-20, 21-31) and add a third `<FloorGrid>` instance. Increase `SLIDE_COUNT` from 3 to 4 so the slideshow hook cycles through three floor-grid slides plus the summary slide.

### Layout sizing (no overlap on landscape screens)

The kiosk stage is sized at a 16:9 aspect (`--stage-width: min(100vw, 100vh*16/9)`, `--stage-height: min(100vh, 100vw*9/16)`). For any viewport with `width > height` the stage will be at most 16:9, taller in proportion than that for nearly-square viewports.

To guarantee no row overlap or clipping for up to 11 floor rows + 1 unit-header row:

- `.floor-grid` keeps `display: flex; flex-direction: column; flex: 1; min-height: 0;`.
- Switch `.floor-row` and `.unit-header-row` to `flex: 1 1 0; min-height: 0;` so all rows share the available height evenly, regardless of the row count (10 or 11).
- `.unit-square` already has `min-width: 0;`; add `min-height: 0; overflow: hidden;` so cell contents shrink within the row's allotted height instead of forcing the row taller.
- Keep the existing `clamp()` font sizing so text scales down on smaller landscape stages.

This makes row height purely a function of stage height divided by row count, so 11 rows always fit on any width > height screen.

### Slide track CSS

`.slide-track` height is `300%` (one slide per 100% of stage height stacked). Update to `400%` to match four slides. The inline `translateY(-${index*(100/SLIDE_COUNT)}%)` already adapts to the new count.

### Translations

Replace `floorsOneToSixteen` / `floorsSeventeenToThirtyOne` translation keys with `floorsOneToTen`, `floorsElevenToTwenty`, `floorsTwentyOneToThirtyOne`. Add `slideFour` key. Keep `slideOne`, `slideTwo`, `slideThree` for the three floor slides; the summary slide moves to `slideFour`.

### Tests

- Unit tests: extend `KioskPortal`/`FloorGrid` unit tests to cover all three floor slides, the new translation keys, and the loop length (4 slides).
- E2E: update Playwright tests to assert that the kiosk cycles through four slides and that floor rows for the 11-floor slide are not clipped at the stage boundary.

## Alternatives Considered

- Using fixed-pixel row heights: rejected because the kiosk stage scales with viewport size; flex distribution adapts automatically.
- Keeping `SLIDE_COUNT` at 3 by rendering all floors on one slide: rejected; the user explicitly wants three separate floor slides.
