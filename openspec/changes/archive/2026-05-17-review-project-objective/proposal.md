## Why

The project needs a clear implementation objective for a fixed-kiosk residential monitoring portal before application work begins. This change turns the portal brief into a concrete product contract for real-time Google Sheets-driven floor/unit monitoring, slideshow display, and summary reporting.

## What Changes

- Create a Next.js App Router portal for a fullscreen kiosk display.
- Ingest residential movement data from a Google Sheets CSV endpoint with secure environment-based configuration.
- Normalize sheet rows into block, floor, unit, entry time, exit time, pax count, and luggage count records.
- Render a 3-slide loop: floors 1-16, floors 17-31, and summary metrics.
- Display 31 floors and 8 units per floor for one residential block at a time.
- Apply luggage warning colors to unit squares: purple for more than 6 luggage items, green for more than 4, default otherwise.
- Poll data every 60 seconds without interrupting the slideshow or flashing loading states.
- Add unit and end-to-end coverage for data normalization, warning colors, slideshow behavior, and visible kiosk content.

## Capabilities

### New Capabilities

- `sheet-data-ingestion`: Fetches and normalizes Google Sheets CSV movement data for residential block monitoring.
- `floor-grid-display`: Renders floor/unit grid slides with unit details and luggage warning colors.
- `kiosk-slideshow`: Runs the automatic 3-slide vertical slideshow with no-flash refresh behavior.
- `summary-metrics`: Computes and displays real-time building-level summary metrics.
- `kiosk-runtime`: Provides fixed-aspect fullscreen kiosk behavior suitable for continuous operation.

### Modified Capabilities

None.

## Impact

- Adds a Next.js App Router frontend application.
- Adds TanStack Query for polling and cache ownership.
- Adds CSV parsing, domain normalization, and summary calculation logic.
- Adds unit and e2e test tooling for portal behavior.
- Adds environment configuration for Google Sheets CSV source and kiosk timing.
