## ADDED Requirements

### Requirement: Switch display preferences

The system SHALL provide runtime controls for selecting the active house, switching between dark and light themes, and switching between English and Traditional Chinese labels.

#### Scenario: House dropdown changes

- **WHEN** the operator selects a house name from the dropdown
- **THEN** floor grid slides and summary metrics update to use records for the selected house

#### Scenario: Selected house disappears after refresh

- **WHEN** refreshed movement data no longer includes the selected house
- **THEN** the portal selects the first available house without clearing the kiosk display

#### Scenario: Theme preference changes

- **WHEN** the operator switches between dark and light theme
- **THEN** the kiosk display updates to the selected color palette

#### Scenario: Language preference changes

- **WHEN** the operator switches between English and Traditional Chinese
- **THEN** visible portal labels, headings, metrics, controls, and status text update to the selected language while sheet-provided values remain unchanged
