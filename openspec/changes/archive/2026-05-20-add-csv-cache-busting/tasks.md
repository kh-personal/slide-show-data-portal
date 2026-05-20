## 1. Tests

- [x] 1.1 Add unit tests for cache-busting URL construction that preserves existing query parameters and produces distinct `_cacheBust` values.
- [x] 1.2 Add or update an E2E test to verify the kiosk still loads movement data through the browser fetch path.

## 2. Implementation

- [x] 2.1 Add a browser-safe cache-busting URL helper.
- [x] 2.2 Update configured CSV fetching to use the cache-busted URL on every request while leaving sample-data fallback unchanged.

## 3. Verification

- [x] 3.1 Run unit tests and confirm they pass.
- [x] 3.2 Run E2E tests and confirm they pass.
