## ADDED Requirements

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
- **THEN** the flat cell uses the darker yellow active-state background
