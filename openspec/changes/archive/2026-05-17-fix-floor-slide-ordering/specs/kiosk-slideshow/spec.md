## MODIFIED Requirements

### Requirement: Loop three slides automatically

The system SHALL loop through exactly three slides: floors 1-16, floors 17-31, and summary metrics. The floor-grid slides SHALL display their floor rows in ascending order within their configured floor ranges.

#### Scenario: Slide interval advances

- **WHEN** the configured slide duration elapses
- **THEN** the portal advances to the next slide in the three-slide sequence

#### Scenario: Final slide advances

- **WHEN** the summary slide duration elapses
- **THEN** the portal returns to the floors 1-16 slide

#### Scenario: Slide 1 floor order

- **WHEN** Slide 1 renders the floors 1-16 grid
- **THEN** the floor rows are displayed in ascending order from 1/F to 16/F

#### Scenario: Slide 2 floor order

- **WHEN** Slide 2 renders the floors 17-31 grid
- **THEN** the floor rows are displayed in ascending order from 17/F to 31/F
