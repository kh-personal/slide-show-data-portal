## MODIFIED Requirements

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
