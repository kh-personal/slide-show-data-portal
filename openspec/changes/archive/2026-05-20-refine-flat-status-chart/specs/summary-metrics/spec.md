## MODIFIED Requirements

### Requirement: Render summary distribution charts

The summary page SHALL render a Flat Status donut chart with exactly three slices: `Not Started`, `Visiting`, and `Completed`. The `Reg` slice SHALL NOT be rendered.

#### Scenario: Counts reflect three-state flat status

- **WHEN** the summary slide renders for the selected house and session
- **THEN** the Flat Status donut chart shows slice counts for `Not Started`, `Visiting`, and `Completed` based on the records of the selected house
- **AND** no `Reg` or `Not Registered` slice is shown

#### Scenario: Localized labels

- **WHEN** the language is English
- **THEN** the `Not Started` slice label reads `Not Started`
- **WHEN** the language is Traditional Chinese
- **THEN** the `Not Started` slice label reads `未開始`
