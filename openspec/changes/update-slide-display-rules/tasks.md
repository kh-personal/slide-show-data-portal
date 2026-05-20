## 1. Tests First

- [x] 1.1 Add unit tests proving medical necessity no longer applies a red cell style and instead renders a red cross icon next to bookmark.
- [x] 1.2 Add unit tests proving AM selected session includes only `AM`, PM selected session includes only `PM`, and blank session records are excluded from both.
- [x] 1.3 Add unit tests proving updated English and Traditional Chinese status labels render in summary/chart label helpers.
- [x] 1.4 Add e2e coverage proving Slide 3 chart and labels remain within the visible viewport.

## 2. Implementation

- [x] 2.1 Update session filtering to exclude blank/missing AM/PM values from selected AM and PM views.
- [x] 2.2 Replace full-cell medical necessity red highlighting with a red cross icon in the unit-cell top-right icon cluster.
- [x] 2.3 Update localized status labels from `未開始`/`訪問中` and `Not Started`/`Visiting` to `未登記`/`收拾中` and `Not registered`/`Packing`.
- [x] 2.4 Adjust Slide 3 chart layout styles so the chart and labels fit within the kiosk viewport.

## 3. Validation

- [x] 3.1 Run unit tests.
- [x] 3.2 Run e2e tests.
- [x] 3.3 Validate the OpenSpec change.
