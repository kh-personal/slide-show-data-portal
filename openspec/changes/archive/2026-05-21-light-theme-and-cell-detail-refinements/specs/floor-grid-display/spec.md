## MODIFIED Requirements

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

### Requirement: Maximize contained grid labels

Floor labels and unit header labels SHALL remain enlarged as much as practical while staying within their cell bounds.

#### Scenario: Unit header labels remain contained

- **WHEN** floor-grid slides are displayed
- **THEN** unit header labels are enlarged
- **AND** their text remains within the respective header cell bounds

### Requirement: Magnify flat cells on hover

Flat cells SHALL magnify on mouse hover to double their visual width and more than double their visual height as needed to cover grouped detail text, and SHALL enlarge detail text for readability.

#### Scenario: Hover magnifier covers grouped text

- **WHEN** the mouse hovers over a populated flat cell
- **THEN** the flat cell is visually magnified
- **AND** the magnified cell is tall enough to contain the grouped detail rows

### Requirement: Light theme contrast colors

The floor grid SHALL use light-theme, eye-protective colors with sufficient text contrast for empty, filled, pending, active, and completed cell states.

#### Scenario: Light contrast cell states

- **WHEN** floor-grid cells are displayed
- **THEN** each state background is light-theme appropriate
- **AND** detail text remains readable
