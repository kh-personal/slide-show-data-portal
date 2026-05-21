## ADDED Requirements

### Requirement: Light-only kiosk theme

The kiosk portal SHALL use light theme only and SHALL NOT display a dark/light theme toggle.

#### Scenario: Theme toggle is absent

- **WHEN** the kiosk portal is displayed
- **THEN** the shell uses light theme
- **AND** no theme toggle button is displayed

## MODIFIED Requirements

### Requirement: Larger summary donut charts

The summary slide SHALL keep the current donut chart size and render donut slice labels at least double the previous label font size while keeping all labels inside the chart/card area. Dense charts such as Duration Distribution SHALL spread labels with leader lines so labels do not overlap.

#### Scenario: Dense donut labels do not overlap

- **WHEN** the summary slide displays the Duration Distribution donut chart
- **THEN** visible slice labels are connected to slices by leader lines
- **AND** visible slice labels do not overlap each other
