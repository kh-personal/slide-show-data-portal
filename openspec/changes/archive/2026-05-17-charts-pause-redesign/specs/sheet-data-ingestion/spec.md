## MODIFIED Requirements

### Requirement: Normalize sheet rows

The system SHALL normalize each sheet row into a movement record with house name, floor, unit, entry time, exit time, pax count, luggage count, CAS staff count, CAS staff number, medical necessity, and flat status fields.

#### Scenario: Row contains expanded house schema fields

- **WHEN** a row contains `House Name`, `Floor`, `Unit`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, `CSA Staff No`, `Medical Necessity`, and optionally `Flat Status` values
- **THEN** the normalized record contains `houseName`, numeric floor, numeric unit, display-safe entry and exit times, numeric pax count, numeric luggage count, numeric CAS staff count, free-text `casStaffNo`, medical necessity text, and a `flatStatus` value

#### Scenario: Row uses common field aliases

- **WHEN** a row uses aliases such as `EntryTime`, `entry_time`, `Pax Count`, `luggage_count`, `casstaffno`, or `flatstatus`
- **THEN** the normalized record maps those values to the canonical movement fields

### Requirement: Derive flat status when not provided

The system SHALL derive `flatStatus` from entry and exit times when the row does not provide an explicit Flat Status value.

#### Scenario: No entry time and no exit time

- **WHEN** entry time and exit time are both empty
- **THEN** the record `flatStatus` is `Not Reg`

#### Scenario: Entry time only

- **WHEN** entry time is set and exit time is empty
- **THEN** the record `flatStatus` is `Visiting`

#### Scenario: Entry and exit time both set

- **WHEN** both entry time and exit time are set
- **THEN** the record `flatStatus` is `Completed`

#### Scenario: Explicit status override

- **WHEN** the row provides a recognized Flat Status value
- **THEN** the normalized record uses that explicit status
