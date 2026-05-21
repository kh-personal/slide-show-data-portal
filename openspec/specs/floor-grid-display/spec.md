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

The system SHALL render a shared header row for units 01 through 08 and 8 unit squares per floor row. Each populated unit square SHALL display Entry Date and AM/PM together on the first row when present, Entry Time and Exit Time together on the next row separated by ` | `, then Pax count, CAS staff count, and CAS staff number when available.

#### Scenario: Unit has selected-session movement data

- **WHEN** movement data exists for a floor and unit in the selected house and selected Entry Date/AM/PM
- **THEN** the corresponding unit square displays the selected-session movement data

#### Scenario: Unit has non-selected session movement data

- **WHEN** no selected-session movement data exists for a floor and unit
- **AND** another record for the selected house floor/unit has Entry Date and AM/PM
- **THEN** the corresponding unit square displays that record with a white filled background

#### Scenario: Grouped detail rows

- **WHEN** a flat cell displays movement data
- **THEN** Entry Date and AM/PM are shown in the same row separated by a space
- **AND** Entry Time and Exit Time are shown in the same row separated by ` | `

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

### Requirement: Emphasize floor and unit labels

The floor grid SHALL render larger floor number labels in the left column and larger unit number labels in the unit header row while keeping all text contained within its cell.

#### Scenario: Floor labels stay contained

- **WHEN** any floor-grid slide is displayed
- **THEN** each left-side floor label text is visibly enlarged
- **AND** its rendered text remains within the floor-label cell bounds

#### Scenario: Unit header labels stay contained

- **WHEN** any floor-grid slide is displayed
- **THEN** each unit header label in the bottom/header row is visibly enlarged
- **AND** its rendered text remains within the unit-header cell bounds

### Requirement: Use eye-protected unit header and empty-cell colors

The floor grid SHALL render the unit header row with a lighter eye-protected background color, and flat cells without any selected-session record SHALL use a light grey background.

#### Scenario: Unit header uses lighter color

- **WHEN** any floor-grid slide is displayed
- **THEN** the unit header cells use a light eye-protected background with readable text

#### Scenario: Empty flat cells are light grey

- **WHEN** a flat has no selected-session movement record
- **THEN** that flat cell uses a light grey empty state background

### Requirement: Darken packing status yellow

The floor grid SHALL use a darker yellow for flats whose selected-session state is Packing / active.

#### Scenario: Packing cell uses darker yellow

- **WHEN** a flat has an entry time and no exit time
- **THEN** the flat cell uses the darker yellow active-state background and displays a red cross icon in the top-right icon cluster

### Requirement: Show selected-session identifiers in populated flat cells

Flat cells with a selected-session record SHALL display Entry Date and AM/PM above the Entry row when those fields are present. These cells SHALL continue to show Entry Time, Exit Time, Pax Count, CAS count, and CAS staff number when available.

#### Scenario: Entry Date and AM/PM appear above Entry

- **WHEN** a flat has a selected-session record with Entry Date and AM/PM
- **THEN** the flat cell displays Entry Date and AM/PM as the first two detail rows without labels
- **AND** Entry, Exit, Pax, CAS count, and CAS staff number remain visible below them

### Requirement: Use filled styling for selected-session records without times

Flat cells with at least Entry Date and AM/PM SHALL use a white filled background even if entry time, leave time, resident count, and CAS count are blank or zero. Flat cells with no selected-session record SHALL remain light grey.

#### Scenario: Date/session-only flat is filled

- **WHEN** a flat has Entry Date and AM/PM but no entry time or exit time
- **THEN** the flat cell uses the white filled background
- **AND** it displays placeholder/default detail values

#### Scenario: No record remains empty

- **WHEN** a flat has no selected-session record
- **THEN** the flat cell uses the light grey empty background

### Requirement: Magnify flat cells on hover

Flat cells SHALL magnify on mouse hover to double their visual width and more than double their visual height as needed to cover grouped detail text, and SHALL enlarge detail text for readability.

#### Scenario: Hover magnifies flat cell

- **WHEN** the mouse hovers over a flat cell
- **THEN** the flat cell is visually magnified to double width and height
- **AND** the detail font size increases while details remain visible

#### Scenario: Hover magnifier covers grouped text

- **WHEN** the mouse hovers over a populated flat cell
- **THEN** the magnified cell is tall enough to contain the grouped detail rows

### Requirement: Maximize contained grid labels

Floor labels and unit header labels SHALL remain enlarged as much as practical while staying within their cell bounds.

#### Scenario: Grid labels remain contained

- **WHEN** floor-grid slides are displayed
- **THEN** floor labels and unit header labels are enlarged
- **AND** their text remains within the respective cell bounds

#### Scenario: Unit header labels remain contained

- **WHEN** floor-grid slides are displayed
- **THEN** unit header labels are enlarged
- **AND** their text remains within the respective header cell bounds

### Requirement: Light theme contrast colors

The floor grid SHALL use light-theme, eye-protective colors with sufficient text contrast for empty, filled, pending, active, and completed cell states.

#### Scenario: Light contrast cell states

- **WHEN** floor-grid cells are displayed
- **THEN** each state background is light-theme appropriate
- **AND** detail text remains readable
