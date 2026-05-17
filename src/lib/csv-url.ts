export function buildCacheBustedCsvUrl(csvUrl: string, cacheBustValue = createCacheBustValue()): string {
  const url = new URL(csvUrl);
  url.searchParams.set("_cacheBust", cacheBustValue);
  return url.toString();
}

function createCacheBustValue(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
