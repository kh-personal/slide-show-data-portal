## Purpose

Define how the portal computes and displays aggregate movement metrics for the selected house.
## Requirements
### Requirement: Compute summary metrics

The system SHALL compute total entries, occupied movement records, total pax count, total luggage count, and warning counts for the selected house.

#### Scenario: Summary slide is rendered

- **WHEN** the summary slide is active
- **THEN** the portal displays current metrics calculated from the latest movement records for the selected house

### Requirement: Count excessive luggage warnings

The system SHALL count excessive luggage warnings from selected-house records where luggage count is greater than 6.

#### Scenario: Records include excessive luggage

- **WHEN** two selected-house records have luggage counts greater than 6
- **THEN** the summary metrics report two excessive luggage warnings

### Requirement: Count moderate luggage warnings

The system SHALL count moderate luggage warnings from selected-house records where luggage count is greater than 4 and less than or equal to 6.

#### Scenario: Records include moderate luggage

- **WHEN** three selected-house records have luggage counts of 5 or 6
- **THEN** the summary metrics report three moderate luggage warnings

### Requirement: Render summary distribution charts

The summary page SHALL render a Flat Status donut chart with exactly three slices: `Not Started`, `Visiting`, and `Completed`. The `Reg` slice SHALL NOT be rendered. Display labels SHALL use updated localized terminology while preserving the underlying three-state distribution.

#### Scenario: Counts reflect three-state flat status

- **WHEN** the summary slide renders for the selected house and session
- **THEN** the Flat Status donut chart shows slice counts for `Not Started`, `Visiting`, and `Completed` based on the records of the selected house
- **AND** no `Reg` or `Not Registered` slice is shown

#### Scenario: Localized labels

- **WHEN** the language is English
- **THEN** the `Not Started` slice label reads `Not registered`
- **AND** the `Visiting` slice label reads `Packing`
- **WHEN** the language is Traditional Chinese
- **THEN** the `Not Started` slice label reads `未登記`
- **AND** the `Visiting` slice label reads `收拾中`

### Requirement: Keep summary chart within kiosk viewport

The summary page SHALL constrain the Flat Status pie/donut chart and its labels so the chart and labels fit inside the visible Slide 3 content area at the target kiosk viewport.

#### Scenario: Summary chart remains viewable

- **WHEN** Slide 3 is displayed at the target kiosk viewport
- **THEN** the pie/donut chart and all visible labels are contained within the slide viewport without clipping outside the visible area

### Requirement: Default to light theme and Traditional Chinese language

The system SHALL initialise with `light` theme and `zh-Hant` (Traditional Chinese) language as the default state when the kiosk portal first loads, without any user interaction.

#### Scenario: Portal opens with light theme

- **WHEN** a user opens the kiosk portal for the first time
- **THEN** the portal renders with the light theme applied (`data-theme="light"` on the root element)

#### Scenario: Portal opens in Traditional Chinese

- **WHEN** a user opens the kiosk portal for the first time
- **THEN** all labels, headings, and controls are rendered in Traditional Chinese

### Requirement: SummaryStatsBar supports compact rendering mode

The `SummaryStatsBar` component (previously `SummaryMetrics`) SHALL accept an optional `compact` boolean prop. When `compact` is `true`, the component SHALL apply a CSS modifier class that reduces the visual size of all metric cards. When `compact` is `false` or omitted, the component SHALL render at full size as before.

#### Scenario: Full-size rendering on Slide 3

- **WHEN** `SummaryStatsBar` renders without the `compact` prop (or with `compact={false}`)
- **THEN** metric cards render at their standard size as displayed on the summary slide

#### Scenario: Compact rendering on floor-grid slides

- **WHEN** `SummaryStatsBar` renders with `compact={true}`
- **THEN** metric cards render visually smaller via the `summary-stats-bar--compact` CSS modifier class

