## Purpose

Define the compact summary stats bar shown on floor-grid slides.

## Requirements

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
