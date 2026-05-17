## ADDED Requirements

### Requirement: Render summary distribution charts

The summary slide SHALL display four rounded-border pie charts in a 2×2 grid below the existing metric cards: Flat Status, Duration Distribution, CSA Staff In-Flat Duration Distribution, and CSA Staff Count Distribution.

#### Scenario: Flat status chart counts every selected-house record

- **WHEN** the summary slide renders
- **THEN** the Flat Status pie chart shows slice counts for `Not Reg`, `Reg`, `Visiting`, and `Completed` based on the records of the selected house

#### Scenario: Duration distribution bucketing

- **WHEN** records with an entry time exist for the selected house
- **THEN** the Duration Distribution chart groups each record's stay length (exit time minus entry time, or current time minus entry time when exit time is empty) into the buckets `0-30`, `31-60`, `61-90`, `91-120`, `121-150`, `151-180`, and `180+` minutes

#### Scenario: CSA Staff In-Flat duration

- **WHEN** records with entry time but no exit time exist for the selected house
- **THEN** the CSA Staff In-Flat Duration Distribution chart sums CAS staff counts of those records into the same minute buckets based on current time minus entry time

#### Scenario: CSA Staff count distribution

- **WHEN** records with entry time exist for the selected house
- **THEN** the CSA Staff Count Distribution chart counts the number of flats grouped by their CAS staff count value
