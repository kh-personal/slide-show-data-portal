## ADDED Requirements

### Requirement: Use updated status labels across slides

The system SHALL display updated flat-status labels consistently across all slideshow surfaces. English labels SHALL show `Not registered` instead of `Not Started` and `Packing` instead of `Visiting`; Traditional Chinese labels SHALL show `未登記` instead of `未開始` and `收拾中` instead of `訪問中`.

#### Scenario: Floor grid and summary labels are updated

- **WHEN** any slide displays flat-status labels in English or Traditional Chinese
- **THEN** the old labels `Not Started`, `Visiting`, `未開始`, and `訪問中` are not displayed
- **AND** the corresponding updated labels are displayed
