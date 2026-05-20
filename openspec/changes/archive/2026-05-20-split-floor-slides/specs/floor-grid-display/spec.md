## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Fit all floor rows within landscape kiosk stage

The floor-grid layout SHALL distribute floor rows so that all rows for a slide (up to 11 rows plus the unit header row) remain fully visible within the stage area without overlapping or clipping on any kiosk viewport whose width is greater than its height.

#### Scenario: Ten-floor slide fits the stage

- **WHEN** Slide 1 or Slide 2 (10 floors) is displayed on any landscape kiosk viewport (width > height)
- **THEN** every floor row is rendered without vertical overlap and is fully contained within the stage height

#### Scenario: Eleven-floor slide fits the stage

- **WHEN** Slide 3 (floors 21-31, 11 floors) is displayed on any landscape kiosk viewport (width > height)
- **THEN** every floor row is rendered without vertical overlap and is fully contained within the stage height
