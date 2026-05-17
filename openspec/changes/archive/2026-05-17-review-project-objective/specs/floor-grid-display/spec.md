## ADDED Requirements

### Requirement: Render floor range slides

The system SHALL render one floor grid slide for floors 1-16 and one floor grid slide for floors 17-31.

#### Scenario: First floor grid slide is visible

- **WHEN** Slide 1 is active
- **THEN** the portal displays floors 1 through 16 for the active block

#### Scenario: Second floor grid slide is visible

- **WHEN** Slide 2 is active
- **THEN** the portal displays floors 17 through 31 for the active block

### Requirement: Render unit square contents

The system SHALL render 8 unit squares per floor row, and each unit square SHALL display entry time, exit time, and pax count.

#### Scenario: Unit has movement data

- **WHEN** movement data exists for a floor and unit
- **THEN** the corresponding unit square displays the entry time, exit time, and pax count

#### Scenario: Unit has no movement data

- **WHEN** no movement data exists for a floor and unit
- **THEN** the corresponding unit square remains present with empty display values rather than disappearing

### Requirement: Apply luggage warning colors

The system SHALL color unit squares purple when luggage count is greater than 6, green when luggage count is greater than 4, and default when luggage count is less than or equal to 4.

#### Scenario: Excessive luggage warning

- **WHEN** a unit has luggage count 7
- **THEN** the unit square uses the purple warning style

#### Scenario: Moderate luggage warning

- **WHEN** a unit has luggage count 5
- **THEN** the unit square uses the green warning style

#### Scenario: Default luggage state

- **WHEN** a unit has luggage count 4
- **THEN** the unit square uses the default style
