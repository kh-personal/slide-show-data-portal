## Why

Published Google Sheets CSV endpoints can serve cached or temporarily inconsistent content after a sheet update. Adding a unique cache-busting query parameter to each client fetch reduces the chance that the kiosk alternates between stale and updated CSV data during polling.

## What Changes

- Add a browser-side cache-busting query parameter to the configured public CSV URL for every movement data fetch.
- Preserve existing CSV URL query parameters such as `gid` and `output=csv`.
- Keep sample-data fallback behavior unchanged when no CSV URL is configured.
- Add tests for cache-busting URL construction and existing kiosk loading behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `sheet-data-ingestion`: Require browser CSV polling to request a cache-busted URL on each configured source fetch.

## Impact

- Affects client-side CSV data fetching in `src/components/kiosk-portal.tsx` and/or a small shared helper.
- No data schema, deployment, or dependency changes.
