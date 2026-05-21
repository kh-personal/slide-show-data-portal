## MODIFIED Requirements

### Requirement: Larger summary donut charts

The summary slide SHALL keep the current donut chart size and render donut slice labels at least double the previous label font size while keeping all labels inside the chart/card area.

#### Scenario: Donut labels are enlarged and contained

- **WHEN** the summary slide displays donut charts
- **THEN** each donut chart keeps its current ring radius
- **AND** each visible slice label font size is at least 18px
- **AND** each visible slice label remains within the donut SVG/card bounds
