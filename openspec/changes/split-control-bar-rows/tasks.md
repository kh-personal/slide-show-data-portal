## 1. Tests First

- [x] 1.1 Add an e2e test asserting the control bar contains exactly two `.control-row` elements: the upper row containing the Entry Date, AM/PM, and House Name selects; the lower row containing the prev, pause/play, next, theme, and language buttons.
- [x] 1.2 Add an e2e test that opens the House Name select and asserts the open dropdown menu does not vertically overlap any summary metric card on the summary slide on the default Playwright viewport.

## 2. Implementation

- [x] 2.1 In `src/components/kiosk-portal.tsx`, wrap the three `<label>+<select>` controls in a `<div className="control-row control-row--selects">` and the five buttons in a `<div className="control-row control-row--buttons">`.
- [x] 2.2 In `app/globals.css`, change `.control-bar` to `flex-direction: column; align-items: stretch; gap: 6px;` and add `.control-row { display: flex; gap: 6px; align-items: center; justify-content: flex-end; }`.

## 3. Validation

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `npm run test:e2e`.
- [x] 3.3 Run `npm run build`.
- [x] 3.4 Run `openspec validate split-control-bar-rows --strict`.
