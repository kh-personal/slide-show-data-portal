## MODIFIED Requirements

### Requirement: Render summary distribution charts

The summary slide SHALL display four rounded-border donut charts in a 2×2 grid below the existing metric cards: Flat Status, Duration Distribution, CSA Staff In-Flat Duration Distribution, and CSA Staff Count Distribution. Each donut SHALL have a hollow center showing the total record count for that chart. Each donut card SHALL place the donut on the left and a legend on the right, with every legend entry visible on a 100% Chrome browser window. Each non-trivial slice SHALL display a percentage and label adjacent to the ring.

#### Scenario: Flat status chart counts every selected-house record

- **WHEN** the summary slide renders
- **THEN** the Flat Status donut chart shows slice counts for `Not Reg`, `Reg`, `Visiting`, and `Completed` based on the records of the selected house

#### Scenario: Duration distribution bucketing

- **WHEN** records with an entry time exist for the selected house
- **THEN** the Duration Distribution chart groups each record's stay length (exit time minus entry time, or current time minus entry time when exit time is empty) into the buckets `0-30`, `31-60`, `61-90`, `91-120`, `121-150`, `151-180`, and `180+` minutes

#### Scenario: CSA Staff In-Flat duration

- **WHEN** records with entry time but no exit time exist for the selected house
- **THEN** the CSA Staff In-Flat Duration Distribution chart sums CAS staff counts of those records into the same minute buckets based on current time minus entry time

#### Scenario: CSA Staff count distribution

- **WHEN** records with entry time exist for the selected house
- **THEN** the CSA Staff Count Distribution chart counts the number of flats grouped by their CAS staff count value

#### Scenario: Donut center shows total

- **WHEN** a donut chart renders with one or more non-zero slices
- **THEN** the chart displays the summed total of its slice values in the hollow center

#### Scenario: Legend sits to the right of the donut

- **WHEN** a donut chart renders inside its card
- **THEN** the donut SVG occupies the left column and the legend list occupies the right column of the card

#### Scenario: Every legend entry is visible

- **WHEN** a donut chart has up to seven legend entries (e.g., Duration Distribution)
- **THEN** every legend row is visible inside the card at 100% browser zoom without horizontal scroll, showing color swatch, label, percent and value

#### Scenario: Slice shows percentage and label adjacent to the donut

- **WHEN** a slice represents at least 3% of the chart total
- **THEN** the chart renders a `label NN%` annotation positioned next to that slice (just outside or overlapping the ring), so the share of each slice is readable without consulting the legend

#### Scenario: Very small slice annotations are suppressed

- **WHEN** a slice represents less than 3% of the total
- **THEN** the chart omits the per-slice annotation to avoid overlap while keeping the slice colored and present in the legend
