import { describe, expect, it } from "vitest";
import { fetchMovementData } from "@/src/lib/movement-data";

describe("movement data fetching", () => {
  it("fetches configured CSV data with a cache-busted URL", async () => {
    const fetchedUrls: string[] = [];
    const fetchCsv = async (input: string | URL | Request) => {
      fetchedUrls.push(String(input));
      return new Response("House Name,Floor,Unit,Entry Date,AM/PM,Entry Time\nWang Yan House,1,1,05/20/2026,AM,08:00");
    };

    const result = await fetchMovementData(
      "https://docs.google.com/spreadsheets/d/example/pub?gid=0&output=csv",
      fetchCsv
    );

    expect(result.records[0]).toMatchObject({
      houseName: "Wang Yan House",
      floor: 1,
      unit: 1,
      entryDate: "05/20/2026",
      session: "AM",
      entryTime: "08:00"
    });
    expect(fetchedUrls).toHaveLength(1);
    const fetchedUrl = new URL(fetchedUrls[0]);
    expect(fetchedUrl.searchParams.get("gid")).toBe("0");
    expect(fetchedUrl.searchParams.get("output")).toBe("csv");
    expect(fetchedUrl.searchParams.get("_cacheBust")).toBeTruthy();
  });
});
