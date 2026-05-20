## Purpose

Define how Google Sheets CSV rows are fetched, normalized, and refreshed for the portal.
## Requirements
### Requirement: Fetch movement data from configured sheet source

The system SHALL fetch residential movement data from a browser-configured public Google Sheets CSV source. Each configured-source fetch SHALL append a unique cache-busting query parameter while preserving existing CSV URL query parameters.

#### Scenario: CSV source is configured

- **WHEN** movement data is requested and `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` is configured
- **THEN** the browser fetches a cache-busted CSV URL and returns normalized movement records

#### Scenario: Existing query parameters are preserved

- **WHEN** the configured CSV URL already contains query parameters such as `gid=0` and `output=csv`
- **THEN** the cache-busted request URL preserves those parameters and adds a unique `_cacheBust` parameter

#### Scenario: Repeated polling requests use distinct URLs

- **WHEN** two configured-source movement fetches occur
- **THEN** each request URL contains a different `_cacheBust` value

#### Scenario: CSV source is not configured

- **WHEN** movement data is requested without a configured source
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

### Requirement: Poll for fresh data

The system SHALL poll movement data every 60 seconds in the browser kiosk experience.

#### Scenario: Poll interval elapses

- **WHEN** the portal has been open for 60 seconds
- **THEN** the client requests fresh movement data without clearing the currently displayed slide content

### Requirement: Filter selected sessions strictly

The system SHALL include records in an `AM` selected-session view only when the normalized session value is exactly `AM`, and SHALL include records in a `PM` selected-session view only when the normalized session value is exactly `PM`. Records with blank or missing session values SHALL be excluded from both selected-session views.

#### Scenario: AM view excludes blank session records

- **WHEN** the selected session is `AM`
- **THEN** records with blank, missing, or non-`AM` session values are not shown or counted

#### Scenario: PM view excludes blank session records

- **WHEN** the selected session is `PM`
- **THEN** records with blank, missing, or non-`PM` session values are not shown or counted

