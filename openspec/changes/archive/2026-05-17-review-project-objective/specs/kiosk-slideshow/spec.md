## ADDED Requirements

### Requirement: Loop three slides automatically

The system SHALL loop through exactly three slides: floors 1-16, floors 17-31, and summary metrics.

#### Scenario: Slide interval advances

- **WHEN** the configured slide duration elapses
- **THEN** the portal advances to the next slide in the three-slide sequence

#### Scenario: Final slide advances

- **WHEN** the summary slide duration elapses
- **THEN** the portal returns to the floors 1-16 slide

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
