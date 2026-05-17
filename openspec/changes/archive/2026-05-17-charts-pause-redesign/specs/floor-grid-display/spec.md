## MODIFIED Requirements

### Requirement: Render unit square contents

The system SHALL render a shared header row for units 01 through 08 and 8 unit squares per floor row. Each populated unit square SHALL display entry time, exit time, pax count, CAS staff count, and CAS staff number without repeating the unit label inside the cell.

#### Scenario: Unit has movement data

- **WHEN** movement data exists for a floor and unit in the selected house
- **THEN** the corresponding unit square displays entry time, exit time, pax count, CAS staff count, and CAS staff number

#### Scenario: Unit has no movement data

- **WHEN** no movement data exists for a floor and unit in the selected house
- **THEN** the corresponding unit square remains present with empty display values rather than disappearing

#### Scenario: Unit headers are displayed

- **WHEN** a floor grid slide is visible
- **THEN** the grid displays one header row labeled `Unit 01` through `Unit 08` in English mode, and `01室` through `08室` in Traditional Chinese mode

#### Scenario: Floor labels follow active language

- **WHEN** the active language is English
- **THEN** the grid floor labels are formatted as `1/F` through `31/F`

#### Scenario: Floor labels in Traditional Chinese mode

- **WHEN** the active language is Traditional Chinese
- **THEN** the grid floor labels are formatted as `1樓` through `31樓`
