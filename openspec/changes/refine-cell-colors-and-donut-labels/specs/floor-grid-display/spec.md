# floor-grid-display delta

## MODIFIED Requirements

### Requirement: Use filled styling for selected-session records without times

Flat cell tone SHALL be determined strictly by whether the record's Entry Date and AM/PM match the currently selected Entry Date and AM/PM:

- White (filled) when the matching record has no entry time.
- Yellow (active) when the matching record has an entry time but no exit time.
- Green (completed) when the matching record has both entry and exit times.
- Light grey (empty) for all other cases, including cells whose only available record is a fallback from a different Entry Date or AM/PM.

Cells MAY still display detail text from fallback records, but their background SHALL remain light grey unless the displayed record matches the selected period.

#### Scenario: Matching record without entry time is white

- **WHEN** a flat has a record whose Entry Date and AM/PM equal the selected period
- **AND** the record has no entry time
- **THEN** the flat cell uses the white filled background

#### Scenario: Matching record in progress is yellow

- **WHEN** a flat has a matching-period record with an entry time and no exit time
- **THEN** the flat cell uses the yellow active background

#### Scenario: Matching record completed is green

- **WHEN** a flat has a matching-period record with both entry and exit times
- **THEN** the flat cell uses the green completed background

#### Scenario: Fallback record cell stays grey

- **WHEN** a flat has no record for the selected Entry Date and AM/PM
- **AND** a fallback record from a different date or session is shown for display
- **THEN** the flat cell uses the light grey empty background
