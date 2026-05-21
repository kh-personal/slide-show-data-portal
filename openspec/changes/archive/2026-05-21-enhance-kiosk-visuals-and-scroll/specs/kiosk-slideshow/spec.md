## ADDED Requirements

### Requirement: Paused mouse-wheel slide navigation

The kiosk slideshow SHALL allow mouse-wheel navigation between slides only while auto slideshow is paused.

#### Scenario: Wheel down advances when paused

- **WHEN** the slideshow is paused
- **AND** the user scrolls the mouse wheel down over the kiosk stage
- **THEN** the slideshow advances to the next slide

#### Scenario: Wheel up goes back when paused

- **WHEN** the slideshow is paused
- **AND** the user scrolls the mouse wheel up over the kiosk stage
- **THEN** the slideshow goes to the previous slide

#### Scenario: Wheel does not navigate while playing

- **WHEN** the slideshow is not paused
- **AND** the user scrolls the mouse wheel over the kiosk stage
- **THEN** the active slide does not change due to the wheel action

### Requirement: Larger summary donut charts

The summary slide SHALL render donut charts with double the previous radius while keeping slice labels visible within the chart area.

#### Scenario: Donut radius is doubled and labels remain visible

- **WHEN** the summary slide displays donut charts
- **THEN** each donut ring radius is doubled relative to the previous chart geometry
- **AND** each visible slice label remains within the donut SVG bounds
