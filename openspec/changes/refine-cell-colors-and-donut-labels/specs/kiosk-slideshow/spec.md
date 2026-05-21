# kiosk-slideshow delta

## MODIFIED Requirements

### Requirement: Larger summary donut charts

The summary slide SHALL keep the current donut chart size and render donut slice labels at least double the previous label font size while keeping all labels inside the chart/card area. Labels SHALL be placed as close to their slice as possible. A short leader line SHALL be drawn ONLY for labels that have been displaced from their natural position to avoid overlapping a neighbor; non-displaced labels SHALL NOT render a connector line.

#### Scenario: Donut labels are enlarged and contained

- **WHEN** the summary slide displays donut charts
- **THEN** each donut chart keeps its current ring radius
- **AND** each visible slice label font size is at least 18px
- **AND** each visible slice label remains within the donut SVG/card bounds

#### Scenario: Non-overlapping labels have no leader lines

- **WHEN** a donut chart's labels naturally fit without overlapping
- **THEN** no leader lines are drawn between the chart and those labels

#### Scenario: Dense donut labels do not overlap

- **WHEN** the summary slide displays the Duration Distribution donut chart
- **THEN** displaced slice labels render a short leader line connecting them to the chart
- **AND** visible slice labels do not overlap each other
