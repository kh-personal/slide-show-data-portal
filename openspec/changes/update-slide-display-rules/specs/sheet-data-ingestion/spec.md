## ADDED Requirements

### Requirement: Filter selected sessions strictly

The system SHALL include records in an `AM` selected-session view only when the normalized session value is exactly `AM`, and SHALL include records in a `PM` selected-session view only when the normalized session value is exactly `PM`. Records with blank or missing session values SHALL be excluded from both selected-session views.

#### Scenario: AM view excludes blank session records

- **WHEN** the selected session is `AM`
- **THEN** records with blank, missing, or non-`AM` session values are not shown or counted

#### Scenario: PM view excludes blank session records

- **WHEN** the selected session is `PM`
- **THEN** records with blank, missing, or non-`PM` session values are not shown or counted
