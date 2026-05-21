## ADDED Requirements

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

Flat cells SHALL magnify on mouse hover to double their visual width and height and enlarge detail text for readability.

#### Scenario: Hover magnifies flat cell

- **WHEN** the mouse hovers over a flat cell
- **THEN** the flat cell is visually magnified to double width and height
- **AND** the detail font size increases while details remain visible

### Requirement: Maximize contained grid labels

Floor labels and unit header labels SHALL remain enlarged as much as practical while staying within their cell bounds.

#### Scenario: Grid labels remain contained

- **WHEN** floor-grid slides are displayed
- **THEN** floor labels and unit header labels are enlarged
- **AND** their text remains within the respective cell bounds
