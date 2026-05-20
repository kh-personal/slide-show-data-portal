## Context

The portal already normalizes CSV movement records, filters by selected house/session, renders floor-grid unit cells on Slides 1 and 2, and renders summary metrics with flat-status distribution on Slide 3. Current medical necessity presentation uses full-cell red styling, which competes with luggage warning colors and makes cells visually heavy. Session filtering currently allows blank AM/PM values to appear in both AM and PM views. Slide 3 chart content needs to remain constrained for fixed kiosk viewing.

## Goals / Non-Goals

**Goals:**
- Preserve the existing floor grid structure while replacing full-cell medical highlighting with a small red cross icon beside the bookmark icon.
- Make AM and PM filters strict: blank session records are excluded from both selected sessions.
- Keep Slide 3 chart and labels inside the visible 16:9 kiosk area without changing the three-slide sequence.
- Update displayed status labels in both languages across grid and summary surfaces.
- Cover the behavior with unit tests and Playwright e2e tests.

**Non-Goals:**
- Changing the CSV schema beyond consuming the existing AM/PM/session field.
- Changing the flat-status canonical internal values unless needed for display mapping.
- Reworking slideshow timing, polling, or chart data semantics.

## Decisions

- **Use icon-based medical indication instead of medical background styling.** Cells with medical necessity will render a red cross badge in the existing top-right icon cluster. This keeps medical information visible while allowing luggage warning backgrounds/indicators to remain meaningful. Alternative considered: keep a red border, but the requested placement is explicitly a red cross icon next to the bookmark icon.
- **Keep canonical flat-status values stable and change labels at presentation boundaries.** Existing logic and tests use `Not Started`, `Visiting`, and `Completed` as normalized states. Display labels will map those states to `Not registered`, `Packing`, and `Completed` in English and `未登記`, `收拾中`, and `已完成` in Traditional Chinese. This minimizes data-model churn. Alternative considered: renaming canonical enum values, but that would broaden the change and risk breaking normalization.
- **Apply strict session filtering where records are selected for the UI.** The selected AM view will include only normalized `AM` records, and PM only `PM`; records with blank or unknown session values will not be included in either selected-session view. This ensures all slides and metrics use the same filtered dataset.
- **Constrain the Slide 3 chart layout with CSS.** The chart container and legend/labels will use bounded dimensions, wrapping, and overflow-safe sizing appropriate for kiosk display. This avoids changing the chart component API unless tests reveal a small prop or class hook is needed.

## Risks / Trade-offs

- Blank session records will disappear from selected-session views, which may reduce totals compared with previous behavior. This is intentional and covered by tests.
- Icon-only medical indication is less prominent than a red background. The mitigation is placement beside the bookmark icon and an accessible label/title for tests and screen readers.
- CSS-only chart containment depends on realistic viewport coverage. The mitigation is adding an e2e assertion that the chart/labels remain within the Slide 3 viewport.
