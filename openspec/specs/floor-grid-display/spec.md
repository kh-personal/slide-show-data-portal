## Purpose

Define the floor grid display and per-room cell presentation.

## Requirements

### Requirement: Render floor range slides

The system SHALL render one floor grid slide for floors 1-16 and one floor grid slide for floors 17-31 for the selected house.

#### Scenario: First floor grid slide is visible

- **WHEN** Slide 1 is active
- **THEN** the portal displays floors 1 through 16 for the selected house

#### Scenario: Second floor grid slide is visible

- **WHEN** Slide 2 is active
- **THEN** the portal displays floors 17 through 31 for the selected house

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

### Requirement: Apply luggage warning colors

The system SHALL color non-medical unit squares purple when luggage count is greater than 6, green when luggage count is greater than 4, and default when luggage count is less than or equal to 4.

#### Scenario: Excessive luggage warning

- **WHEN** a non-medical unit has luggage count 7
- **THEN** the unit square uses the purple warning style

#### Scenario: Moderate luggage warning

- **WHEN** a non-medical unit has luggage count 5
- **THEN** the unit square uses the green warning style

#### Scenario: Default luggage state

- **WHEN** a unit has luggage count 4
- **THEN** the unit square uses the default style unless medical necessity applies

### Requirement: Highlight medical necessity cells

The system SHALL render unit squares with non-empty medical necessity as red cells. Medical styling SHALL take priority over full-cell luggage warning backgrounds while still preserving luggage warning visibility as a bottom-right indicator.

#### Scenario: Medical unit without luggage warning

- **WHEN** a unit has medical necessity and luggage count 4 or less
- **THEN** the unit square uses the red medical style without a luggage warning indicator

#### Scenario: Medical unit with moderate luggage warning

- **WHEN** a unit has medical necessity and luggage count 5 or 6
- **THEN** the unit square uses the red medical style and displays a green bottom-right luggage indicator

#### Scenario: Medical unit with excessive luggage warning

- **WHEN** a unit has medical necessity and luggage count greater than 6
- **THEN** the unit square uses the red medical style and displays a purple bottom-right luggage indicator
