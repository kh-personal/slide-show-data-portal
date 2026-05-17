## MODIFIED Requirements

### Requirement: Normalize sheet rows

The system SHALL normalize each sheet row into a movement record with house name, floor, unit, entry time, exit time, pax count, luggage count, CAS staff count, and medical necessity fields. `House Name` SHALL replace the previous block field as the canonical building selector.

#### Scenario: Row contains expanded house schema fields

- **WHEN** a row contains `House Name`, `Floor`, `Unit`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity` values
- **THEN** the normalized record contains `houseName`, numeric floor, numeric unit, display-safe entry and exit times, numeric pax count, numeric luggage count, numeric CAS staff count, and the medical necessity text

#### Scenario: Row uses common field aliases

- **WHEN** a row uses aliases such as `EntryTime`, `entry_time`, `Pax Count`, `luggage_count`, or CAS staff count variants
- **THEN** the normalized record maps those values to the canonical movement fields while preserving `House Name` as the house selector
