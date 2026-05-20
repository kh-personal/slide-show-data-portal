## MODIFIED Requirements

### Requirement: Switch display preferences

The system SHALL provide runtime controls for selecting entry date, AM/PM session, active house, switching between dark and light themes, and switching between English and Traditional Chinese labels. Entry date and AM/PM controls SHALL be selected before the house selector is used, and the house selector SHALL only contain houses available for the selected session.

#### Scenario: Session controls filter house dropdown

- **WHEN** the operator selects an entry date and AM/PM session
- **THEN** the house dropdown only lists house names from movement records whose `Entry Date` and `AM/PM` match the selected values

#### Scenario: Selected session disappears after refresh

- **WHEN** refreshed movement data no longer includes the selected entry date or AM/PM session
- **THEN** the portal selects the first available entry date and session without clearing the kiosk display

#### Scenario: Selected house disappears after session change

- **WHEN** the selected house is not available in the selected entry date and AM/PM session
- **THEN** the portal selects the first available house for that session without clearing the kiosk display
