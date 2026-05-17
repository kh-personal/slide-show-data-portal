## ADDED Requirements

### Requirement: Compute summary metrics

The system SHALL compute total entries, occupied movement records, total pax count, total luggage count, and warning counts for the active block.

#### Scenario: Summary slide is rendered

- **WHEN** the summary slide is active
- **THEN** the portal displays current metrics calculated from the latest movement records

### Requirement: Count excessive luggage warnings

The system SHALL count excessive luggage warnings from records where luggage count is greater than 6.

#### Scenario: Records include excessive luggage

- **WHEN** two active-block records have luggage counts greater than 6
- **THEN** the summary metrics report two excessive luggage warnings

### Requirement: Count moderate luggage warnings

The system SHALL count moderate luggage warnings from records where luggage count is greater than 4 and less than or equal to 6.

#### Scenario: Records include moderate luggage

- **WHEN** three active-block records have luggage counts of 5 or 6
- **THEN** the summary metrics report three moderate luggage warnings
