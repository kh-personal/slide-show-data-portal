## MODIFIED Requirements

### Requirement: Default to light theme and Traditional Chinese language

The system SHALL initialise with `light` theme and `zh-Hant` (Traditional Chinese) language as the default state when the kiosk portal first loads, without any user interaction.

#### Scenario: Portal opens with light theme

- **WHEN** a user opens the kiosk portal for the first time
- **THEN** the portal renders with the light theme applied (`data-theme="light"` on the root element)

#### Scenario: Portal opens in Traditional Chinese

- **WHEN** a user opens the kiosk portal for the first time
- **THEN** all labels, headings, and controls are rendered in Traditional Chinese
