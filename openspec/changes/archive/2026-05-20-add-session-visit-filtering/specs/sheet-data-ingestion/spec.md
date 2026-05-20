## MODIFIED Requirements

### Requirement: Normalize sheet rows

The system SHALL normalize each sheet row into a movement record with house name, floor, unit, entry date, AM/PM session, entry time, exit time, pax count, luggage count, CAS staff count, CAS staff number, medical necessity, and flat status fields. `Entry Date` SHALL be retained in `MM/DD/YYYY` display format and `AM/PM` SHALL be retained as `AM` or `PM`.

#### Scenario: Row contains session visit schema fields

- **WHEN** a row contains `House Name`, `Floor`, `Unit`, `Entry Date`, `AM/PM`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`
- **THEN** the normalized record contains `houseName`, numeric floor, numeric unit, `entryDate`, `session`, display-safe entry and exit times, numeric pax count, numeric luggage count, numeric CAS staff count, CAS staff number text, medical necessity text, and a derived flat status

#### Scenario: Row uses legacy staff count alias

- **WHEN** a row uses `Staff Count` for the number of 民安隊 staff
- **THEN** the normalized record maps that value to the numeric CAS staff count field
