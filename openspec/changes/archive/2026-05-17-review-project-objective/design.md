## Context

The workspace currently contains OpenSpec project metadata but no application scaffold. The change therefore needs to establish both the project objective and a working Next.js App Router implementation for the residential kiosk portal.

The portal is a fixed-display system for Wang Fuk Court, Fan Shang Lou. It must read movement records from Google Sheets, normalize them into 31-floor by 8-unit block data, and continuously render one block at a time in a 3-slide loop without disrupting the kiosk view during data refreshes.

## Goals / Non-Goals

**Goals:**

- Build a Next.js App Router application suitable for Vercel deployment.
- Use TanStack Query as the client cache and polling owner.
- Keep Google Sheets source configuration in environment variables.
- Normalize CSV rows into typed movement records and deterministic grid data.
- Render slides for floors 1-16, floors 17-31, and summary metrics.
- Use smooth upward slide transitions and fixed-aspect fullscreen layout.
- Add unit and e2e tests for data logic and kiosk-visible behavior.

**Non-Goals:**

- Editing Google Sheets data from the portal.
- Supporting user authentication or multi-user dashboards.
- Persisting data outside the Google Sheets source.
- Building administrative controls for kiosk timing or block selection.

## Decisions

### Use a client-rendered kiosk shell with TanStack Query

The portal will render the main kiosk experience as a client component because slideshow timing, animation state, and polling cache updates are browser-runtime concerns. TanStack Query will own refetching with a 60-second interval and keep previous data visible during refreshes.

Alternative considered: server-only rendering with route refreshes. This was rejected because route-level refreshes increase the risk of blank states or visible reload behavior on kiosk displays.

### Use a server API route as the Sheets boundary

The browser will call an internal `/api/movements` endpoint. The endpoint will fetch `GOOGLE_SHEETS_CSV_URL`, parse CSV, normalize records, and return typed JSON. This keeps source URLs configurable and avoids exposing private API-key style values directly in client code.

Alternative considered: client-side CSV fetching. This was rejected for private or semi-private sheet sources because it exposes the configured URL to the browser.

### Normalize sheet rows before rendering

CSV rows will be converted into `MovementRecord` objects with explicit field parsing for block, floor, unit, entry time, exit time, pax count, and luggage count. Missing block values will fall back to the default active block so the minimum required sheet schema remains usable.

Alternative considered: rendering raw CSV rows. This was rejected because display logic, summary metrics, and tests need stable typed data.

### Keep slideshow state independent from data state

The slide index will advance on its own interval. Data updates will update the query cache in the background and be reflected by render state without resetting the slide index.

Alternative considered: resetting the slide loop after every refetch. This was rejected because it can produce jarring kiosk behavior and makes Slide 2 or Slide 3 less likely to be seen under frequent updates.

### Use CSS transforms for vertical slide animation

Slides will be stacked vertically in one viewport and moved with `transform: translateY(...)`. This avoids unmount/remount flashes and keeps all slide content available while only the viewport position changes.

Alternative considered: conditional rendering a single slide. This was rejected because it increases flicker risk and can hide background-updated slide state.

## Risks / Trade-offs

- [Risk] CSV column names may vary by sheet owner -> Mitigation: accept common aliases such as `EntryTime`, `entry_time`, and `Entry Time`.
- [Risk] Private Google Sheets endpoints may require credentials beyond a public CSV URL -> Mitigation: isolate source fetching behind `/api/movements` so a future API-auth implementation does not affect UI components.
- [Risk] Kiosk timers can leak when components remount -> Mitigation: use effect cleanup and unit/e2e coverage for stable slide behavior.
- [Risk] Visual density is high for 16 floors by 8 units -> Mitigation: use fixed aspect scaling and compact unit cards optimized for 16:9 fullscreen.
- [Risk] GitHub Pages static export cannot securely hide runtime secrets -> Mitigation: prefer Vercel for environment-backed server API routes.

## Migration Plan

1. Scaffold the Next.js application in the repository root.
2. Add data normalization and summary logic with unit tests.
3. Add the API route and environment configuration example.
4. Add kiosk UI components and slideshow behavior.
5. Add e2e coverage for visible floor ranges, summary metrics, and slide transitions.
6. Deploy to Vercel with `GOOGLE_SHEETS_CSV_URL` configured.

Rollback is to remove the app scaffold and keep only OpenSpec artifacts; no production data migration is required.

## Open Questions

- Whether the production sheet will include a `Block` column or use one sheet per block.
- The final kiosk aspect ratio, defaulting to 16:9 until the monitor is confirmed.
- Whether block rotation should be added after the first one-block-at-a-time implementation.
