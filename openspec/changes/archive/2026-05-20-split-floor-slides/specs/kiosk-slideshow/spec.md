## MODIFIED Requirements

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
