## ADDED Requirements

### Requirement: Fetch movement data from configured sheet source

The system SHALL fetch residential movement data from a server-side configured Google Sheets CSV source.

#### Scenario: CSV source is configured

- **WHEN** the movement API is requested and `GOOGLE_SHEETS_CSV_URL` is configured
- **THEN** the system fetches the CSV source and returns normalized movement records

#### Scenario: CSV source is not configured

- **WHEN** the movement API is requested without a configured source
- **THEN** the system returns deterministic sample movement records suitable for local development and tests

### Requirement: Normalize sheet rows

The system SHALL normalize each sheet row into a movement record with block, floor, unit, entry time, exit time, pax count, and luggage count fields.

#### Scenario: Row contains required fields

- **WHEN** a row contains Floor, Unit, EntryTime, ExitTime, PaxCount, and LuggageCount values
- **THEN** the normalized record contains numeric floor, unit, pax count, luggage count, and display-safe time values

#### Scenario: Row uses common field aliases

- **WHEN** a row uses aliases such as Entry Time, entry_time, Pax Count, or luggage_count
- **THEN** the normalized record maps those values to the canonical movement fields

### Requirement: Poll for fresh data

The system SHALL poll movement data every 60 seconds in the browser kiosk experience.

#### Scenario: Poll interval elapses

- **WHEN** the portal has been open for 60 seconds
- **THEN** the client requests fresh movement data without clearing the currently displayed slide content
