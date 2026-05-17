import { describe, expect, it } from "vitest";
import { buildCacheBustedCsvUrl } from "@/src/lib/csv-url";

describe("CSV URL cache busting", () => {
  it("preserves existing query parameters and appends a cache-busting value", () => {
    const url = buildCacheBustedCsvUrl(
      "https://docs.google.com/spreadsheets/d/example/pub?gid=0&single=true&output=csv",
      "12345-abc"
    );
    const parsed = new URL(url);

    expect(parsed.searchParams.get("gid")).toBe("0");
    expect(parsed.searchParams.get("single")).toBe("true");
    expect(parsed.searchParams.get("output")).toBe("csv");
    expect(parsed.searchParams.get("_cacheBust")).toBe("12345-abc");
  });

  it("produces distinct cache-busting values for repeated requests", () => {
    const first = new URL(buildCacheBustedCsvUrl("https://example.com/data.csv"));
    const second = new URL(buildCacheBustedCsvUrl("https://example.com/data.csv"));

    expect(first.searchParams.get("_cacheBust")).toBeTruthy();
    expect(second.searchParams.get("_cacheBust")).toBeTruthy();
    expect(first.searchParams.get("_cacheBust")).not.toBe(second.searchParams.get("_cacheBust"));
  });
});
