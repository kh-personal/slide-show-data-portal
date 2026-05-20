## Purpose

Define the floor grid display and per-room cell presentation.

## Requirements

### Requirement: Render floor range slides

The system SHALL render three floor grid slides for the selected house: one for floors 1-10, one for floors 11-20, and one for floors 21-31.

#### Scenario: First floor grid slide is visible

- **WHEN** Slide 1 is active
- **THEN** the portal displays floors 1 through 10 for the selected house

#### Scenario: Second floor grid slide is visible

- **WHEN** Slide 2 is active
- **THEN** the portal displays floors 11 through 20 for the selected house

#### Scenario: Third floor grid slide is visible

- **WHEN** Slide 3 is active
- **THEN** the portal displays floors 21 through 31 for the selected house

### Requirement: Fit all floor rows within landscape kiosk stage

The floor-grid layout SHALL distribute floor rows so that all rows for a slide (up to 11 rows plus the unit header row) remain fully visible within the stage area without overlapping or clipping on any kiosk viewport whose width is greater than its height.

#### Scenario: Ten-floor slide fits the stage

- **WHEN** Slide 1 or Slide 2 (10 floors) is displayed on any landscape kiosk viewport (width > height)
- **THEN** every floor row is rendered without vertical overlap and is fully contained within the stage height

#### Scenario: Eleven-floor slide fits the stage

- **WHEN** Slide 3 (floors 21-31, 11 floors) is displayed on any landscape kiosk viewport (width > height)
- **THEN** every floor row is rendered without vertical overlap and is fully contained within the stage height

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

The system SHALL color unit squares purple when luggage count is greater than 6, green when luggage count is greater than 4, and default when luggage count is less than or equal to 4. Medical necessity SHALL NOT replace the unit square background with a red medical style.

#### Scenario: Excessive luggage warning

- **WHEN** a unit has luggage count 7
- **THEN** the unit square uses the purple warning style

#### Scenario: Moderate luggage warning

- **WHEN** a unit has luggage count 5
- **THEN** the unit square uses the green warning style

#### Scenario: Default luggage state

- **WHEN** a unit has luggage count 4
- **THEN** the unit square uses the default style

### Requirement: Highlight medical necessity cells

The system SHALL render unit squares with non-empty medical necessity using a red cross icon in the top-right icon cluster next to the bookmark icon. Medical necessity SHALL NOT apply a red full-cell background and SHALL NOT suppress luggage warning visibility.

#### Scenario: Medical unit without luggage warning

- **WHEN** a unit has medical necessity and luggage count 4 or less
- **THEN** the unit square uses the default cell background and displays a red cross icon in the top-right icon cluster

#### Scenario: Medical unit with moderate luggage warning

- **WHEN** a unit has medical necessity and luggage count 5 or 6
- **THEN** the unit square uses the green warning style and displays a red cross icon in the top-right icon cluster

#### Scenario: Medical unit with excessive luggage warning

- **WHEN** a unit has medical necessity and luggage count greater than 6
- **THEN** the unit square uses the purple warning style and displays a red cross icon in the top-right icon cluster
