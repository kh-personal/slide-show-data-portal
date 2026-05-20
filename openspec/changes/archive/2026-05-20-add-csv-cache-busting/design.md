## Context

The static GitHub Pages deployment fetches the public Google Sheets CSV directly from the browser. Even with `cache: "no-store"`, public CSV endpoints or intermediate caches can briefly serve stale content after sheet updates, causing the kiosk to alternate between old and new data during polling.

## Goals / Non-Goals

**Goals:**
- Append a unique cache-busting parameter to each configured CSV fetch.
- Preserve all existing CSV URL query parameters.
- Keep the sample-data fallback unchanged when no CSV URL is configured.
- Keep fetch error handling explicit.

**Non-Goals:**
- Change polling interval behavior, TanStack Query cache policy, CSV parsing, Google Sheets configuration, or data normalization.
- Add server-side API routes or new dependencies.

## Decisions

- Add a small exported URL helper in the client data-fetching path so unit tests can verify behavior without rendering React components.
- Use `_cacheBust=<timestamp>-<random>` as the parameter name/value. This combines time ordering with uniqueness across rapid repeated fetches.
- Use the standard `URL` API to preserve existing query parameters and correctly choose `?` or `&`.

## Risks / Trade-offs

- Some upstream Google Sheets propagation delay may still occur even when caches are bypassed -> the cache buster only prevents reused cached responses; it cannot force Google to publish a changed sheet instantly.
- Invalid configured URLs would fail when constructing a `URL` -> keep the failure explicit instead of silently falling back to stale or sample data.
