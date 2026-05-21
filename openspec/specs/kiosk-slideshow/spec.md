## Purpose

Define the kiosk slideshow sequence and transition behavior.

## Requirements

### Requirement: Loop three slides automatically

The system SHALL loop through exactly four slides: floors 1-10, floors 11-20, floors 21-31, and summary metrics. The floor-grid slides SHALL display their floor rows in ascending order within their configured floor ranges.

#### Scenario: Slide interval advances

- **WHEN** the configured slide duration elapses
- **THEN** the portal advances to the next slide in the four-slide sequence

#### Scenario: Final slide advances

- **WHEN** the summary slide duration elapses
- **THEN** the portal returns to the floors 1-10 slide

#### Scenario: Slide 1 floor order

- **WHEN** Slide 1 renders the floors 1-10 grid
- **THEN** the floor rows are displayed in ascending order from 1/F to 10/F

#### Scenario: Slide 2 floor order

- **WHEN** Slide 2 renders the floors 11-20 grid
- **THEN** the floor rows are displayed in ascending order from 11/F to 20/F

#### Scenario: Slide 3 floor order

- **WHEN** Slide 3 renders the floors 21-31 grid
- **THEN** the floor rows are displayed in ascending order from 21/F to 31/F

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

The system SHALL display a compact stats bar inside the slide header of every floor-grid slide (Slides 1, 2, and 3). The bar SHALL show the same 5 summary figures as the summary slide (total entries today, total pax, total luggage, excessive luggage warnings, and moderate luggage warnings) derived from the same selected-house metrics.

#### Scenario: Stats bar visible on Slide 1

- **WHEN** Slide 1 (floors 1-10) is active
- **THEN** the slide header contains all 5 summary metric figures at a visually reduced size compared to the summary slide

#### Scenario: Stats bar visible on Slide 2

- **WHEN** Slide 2 (floors 11-20) is active
- **THEN** the slide header contains all 5 summary metric figures at a visually reduced size compared to the summary slide

#### Scenario: Stats bar visible on Slide 3

- **WHEN** Slide 3 (floors 21-31) is active
- **THEN** the slide header contains all 5 summary metric figures at a visually reduced size compared to the summary slide

#### Scenario: Stats bar reflects current data

- **WHEN** the movement data is refreshed
- **THEN** the stats bar values on Slides 1, 2, and 3 update to reflect the latest computed metrics on the next render

### Requirement: Stats bar uses compact visual style

The stats bar rendered on floor-grid slides SHALL use a compact CSS class modifier that reduces metric card size relative to the full-size rendering on Slide 3, so that the bar does not dominate the available slide header space.

#### Scenario: Compact style applied

- **WHEN** the stats bar renders inside a floor-grid slide header
- **THEN** the metric cards are visually smaller than those on Slide 3 (achieved via a `compact` prop / CSS modifier class)

### Requirement: Use updated status labels across slides

The system SHALL display updated flat-status labels consistently across all slideshow surfaces. English labels SHALL show `Not registered` instead of `Not Started` and `Packing` instead of `Visiting`; Traditional Chinese labels SHALL show `未登記` instead of `未開始` and `收拾中` instead of `訪問中`.

#### Scenario: Floor grid and summary labels are updated

- **WHEN** any slide displays flat-status labels in English or Traditional Chinese
- **THEN** the old labels `Not Started`, `Visiting`, `未開始`, and `訪問中` are not displayed
- **AND** the corresponding updated labels are displayed

### Requirement: Two-row control bar layout

The kiosk control bar SHALL render its controls across two rows. The upper row SHALL contain the Entry Date, AM/PM (session), and House Name selects. The lower row SHALL contain the previous-slide button, the Pause/Play toggle, the next-slide button, the theme button, and the language button.

#### Scenario: Control bar shows two rows

- **WHEN** the kiosk portal is displayed
- **THEN** the control bar contains exactly two row containers
- **AND** the upper row contains the Entry Date, AM/PM, and House Name selects
- **AND** the lower row contains the previous-slide, Pause/Play, next-slide, theme, and language buttons

#### Scenario: Open dropdown does not overlap summary metric boxes

- **WHEN** any of the upper-row selects is opened on the summary slide on a landscape kiosk viewport (width > height)
- **THEN** the open dropdown menu does not vertically overlap any of the 6 summary metric boxes

### Requirement: Summary chart area width

Each donut chart on the summary slide SHALL allocate at least 70% of its donut card body width to the chart graphic area and reserve the remaining width for the legend labels.

#### Scenario: Donut chart width dominates legend width

- **WHEN** the summary slide displays donut charts on a landscape kiosk viewport
- **THEN** each donut card's chart area occupies at least 70% of the donut body width
- **AND** the legend label area remains to the right of the chart area

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

The summary slide SHALL keep the current donut chart size and render donut slice labels at least double the previous label font size while keeping all labels inside the chart/card area. Dense charts such as Duration Distribution SHALL spread labels with leader lines so labels do not overlap.

#### Scenario: Donut labels are enlarged and contained

- **WHEN** the summary slide displays donut charts
- **THEN** each donut chart keeps its current ring radius
- **AND** each visible slice label font size is at least 18px
- **AND** each visible slice label remains within the donut SVG/card bounds

#### Scenario: Dense donut labels do not overlap

- **WHEN** the summary slide displays the Duration Distribution donut chart
- **THEN** visible slice labels are connected to slices by leader lines
- **AND** visible slice labels do not overlap each other

### Requirement: Light-only kiosk theme

The kiosk portal SHALL use light theme only and SHALL NOT display a dark/light theme toggle.

#### Scenario: Theme toggle is absent

- **WHEN** the kiosk portal is displayed
- **THEN** the shell uses light theme
- **AND** no theme toggle button is displayed
