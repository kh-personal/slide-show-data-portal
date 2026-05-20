## MODIFIED Requirements

### Requirement: Compute summary metrics

The system SHALL compute session-scoped summary metrics for the selected house, selected entry date, and selected AM/PM session: total registered flats today, total pax today, active flats, active pax, completed flats, and completed pax.

#### Scenario: Summary metrics use selected session

- **WHEN** the summary slide or floor slide metric bar is rendered
- **THEN** the portal displays metrics calculated only from records matching the selected house, entry date, and AM/PM session

#### Scenario: Total registered flats today

- **WHEN** selected-session records include flats with and without entry times
- **THEN** `Total Reg Flats Today` counts all flats allowed to be visited in the selected session

#### Scenario: Total pax today

- **WHEN** selected-session records include flats with and without entry times
- **THEN** `Total Pax Today` sums resident pax for every selected-session flat

#### Scenario: Active flats and pax

- **WHEN** selected-session records include flats with entry time and no exit time
- **THEN** `Active Flats` counts those flats and `Active Pax` sums their resident pax, and both cards use a yellow background

#### Scenario: Completed flats and pax

- **WHEN** selected-session records include flats with both entry time and exit time
- **THEN** `Completed Flats` counts those flats and `Completed Pax` sums their resident pax, and both cards use a pink-blue background

### Requirement: Render summary distribution charts

The summary slide SHALL display only the Flat Status and Duration Distribution donut chart contents. The CSA Staff In-Flat Duration and CSA Staff Count Distribution chart contents SHALL be removed.

#### Scenario: Summary chart content is reduced

- **WHEN** the summary slide renders
- **THEN** it displays the Flat Status and Duration Distribution charts and does not display CSA Staff In-Flat Duration or CSA Staff Count Distribution charts
