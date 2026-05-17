## Purpose

Define the kiosk slideshow sequence and transition behavior.

## Requirements

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

### Requirement: Use upward slide transition

The system SHALL transition between slides using a vertical upward transform animation.

#### Scenario: Slide changes

- **WHEN** the active slide changes
- **THEN** the slide track moves vertically without showing a blank intermediate screen

### Requirement: Preserve data state during slideshow

The system SHALL keep all slide data available while any single slide is active.

#### Scenario: Data refresh occurs on Slide 1

- **WHEN** data refresh completes while Slide 1 is active
- **THEN** Slide 2 and Slide 3 render the refreshed data when they next become active

### Requirement: Render compact stats bar on floor-grid slides

The system SHALL display a compact stats bar inside the slide header of Slide 1 and Slide 2. The bar SHALL show the same 5 summary figures as Slide 3 (total entries today, total pax, total luggage, excessive luggage warnings, and moderate luggage warnings) derived from the same selected-house metrics.

#### Scenario: Stats bar visible on Slide 1

- **WHEN** Slide 1 (floors 1-16) is active
- **THEN** the slide header contains all 5 summary metric figures at a visually reduced size compared to Slide 3

#### Scenario: Stats bar visible on Slide 2

- **WHEN** Slide 2 (floors 17-31) is active
- **THEN** the slide header contains all 5 summary metric figures at a visually reduced size compared to Slide 3

#### Scenario: Stats bar reflects current data

- **WHEN** the movement data is refreshed
- **THEN** the stats bar values on Slides 1 and 2 update to reflect the latest computed metrics on the next render

### Requirement: Stats bar uses compact visual style

The stats bar rendered on floor-grid slides SHALL use a compact CSS class modifier that reduces metric card size relative to the full-size rendering on Slide 3, so that the bar does not dominate the available slide header space.

#### Scenario: Compact style applied

- **WHEN** the stats bar renders inside a floor-grid slide header
- **THEN** the metric cards are visually smaller than those on Slide 3 (achieved via a `compact` prop / CSS modifier class)
