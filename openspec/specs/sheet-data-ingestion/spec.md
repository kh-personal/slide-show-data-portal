## Purpose

Define how Google Sheets CSV rows are fetched, normalized, and refreshed for the portal.

## Requirements

### Requirement: Fetch movement data from configured sheet source

The system SHALL fetch residential movement data from a server-side configured Google Sheets CSV source.

#### Scenario: CSV source is configured

- **WHEN** the movement API is requested and `GOOGLE_SHEETS_CSV_URL` is configured
- **THEN** the system fetches the CSV source and returns normalized movement records

#### Scenario: CSV source is not configured

- **WHEN** the movement API is requested without a configured source
- **THEN** the system returns deterministic sample movement records suitable for local development and tests

### Requirement: Normalize sheet rows

The system SHALL normalize each sheet row into a movement record with house name, floor, unit, entry time, exit time, pax count, luggage count, CAS staff count, CAS staff number, medical necessity, and flat status fields. `House Name` SHALL replace the previous block field as the canonical building selector.

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

### Requirement: Poll for fresh data

The system SHALL poll movement data every 60 seconds in the browser kiosk experience.

#### Scenario: Poll interval elapses

- **WHEN** the portal has been open for 60 seconds
- **THEN** the client requests fresh movement data without clearing the currently displayed slide content
