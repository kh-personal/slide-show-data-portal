## 1. Tests

- [x] 1.1 Add unit tests for CSV normalization of `Entry Date`, `AM/PM`, and `Staff Count`.
- [x] 1.2 Add unit tests for session option derivation, session-filtered houses/floor rows, visit-state tones, and session summary metrics.
- [x] 1.3 Update component/unit tests for six renamed metric cards and tone classes.
- [x] 1.4 Update E2E tests for date/session controls, house filtering, bookmark/status styling, renamed metrics, and reduced summary charts.

## 2. Implementation

- [x] 2.1 Extend movement model, CSV aliases, and sample data for `entryDate` and `session`.
- [x] 2.2 Add session selection helpers and update kiosk controls/state to select date and AM/PM before filtering houses.
- [x] 2.3 Update floor row construction and floor-grid rendering to use selected-session records, bookmark markers, and grey/yellow/pink-blue visit-state tones instead of luggage warning colors.
- [x] 2.4 Redefine summary metric calculations and render six metric cards with yellow active cards and pink-blue completed cards.
- [x] 2.5 Remove the final two summary chart contents.
- [x] 2.6 Update localization labels and CSS for the new controls, markers, tones, and metric card backgrounds.

## 3. Verification

- [x] 3.1 Run unit tests.
- [x] 3.2 Run E2E tests.
