## MODIFIED Requirements

### Requirement: Derive flat status when not provided

The system SHALL derive a record's `flatStatus` from entry and exit times using a three-state model: `Not Started`, `Visiting`, `Completed`. The legacy `Reg` and `Not Reg` values SHALL NOT be produced.

#### Scenario: No entry and no exit time

- **WHEN** both `Entry Time` and `Exit Time` are blank
- **THEN** the record `flatStatus` is `Not Started`

#### Scenario: Exit time without entry time

- **WHEN** `Entry Time` is blank but `Exit Time` is present
- **THEN** the record `flatStatus` is `Not Started`

#### Scenario: Entry time without exit time

- **WHEN** `Entry Time` is present and `Exit Time` is blank
- **THEN** the record `flatStatus` is `Visiting`

#### Scenario: Both entry and exit times

- **WHEN** both `Entry Time` and `Exit Time` are present
- **THEN** the record `flatStatus` is `Completed`

