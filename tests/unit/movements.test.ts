import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FloorGrid } from "@/src/components/floor-grid";
import { normalizeMovementRows, parseCsv } from "@/src/lib/csv";
import {
  formatFloorLabel,
  formatUnitLabel,
  translateFlatStatus,
  translateHouseName,
  translations
} from "@/src/lib/i18n";
import { DEFAULT_HOUSE_NAME, type FloorRow, type MovementRecord } from "@/src/lib/models";
import {
  buildFloorRows,
  deriveFlatStatus,
  getCsaInFlatDurationDistribution,
  getCsaStaffCountDistribution,
  getDurationBucket,
  getDurationDistribution,
  getFlatStatusDistribution,
  getHouseNames,
  getRoomTone,
  getSessionHouseNames,
  getSessionOptions,
  getVisitStateTone,
  parseTimeToMinutes,
  summarizeMovementRecords
} from "@/src/lib/movements";

describe("grid and warning logic", () => {
  it("creates 8 unit cells for every floor in the requested range", () => {
    const rows = buildFloorRows(sampleMovements, 1, 16);

    expect(rows).toHaveLength(16);
    expect(rows[0].units).toHaveLength(8);
    expect(rows[0].units[0].unitLabel).toBe("01");
  });

  it("keeps floor-grid rows visually ascending instead of reversing them in CSS", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const floorGridRule = css.match(/\.floor-grid\s*\{[^}]*\}/)?.[0];

    expect(floorGridRule).toContain("flex-direction: column;");
    expect(floorGridRule).not.toContain("column-reverse");
  });

  it("derives session date and AM/PM choices in first-seen order", () => {
    expect(getSessionOptions([
      record("one", "Wang Yan House", 1, 1, "", "", 1, 7, 0, "", "", "05/20/2026", "AM"),
      record("two", "Wang Do House", 1, 2, "", "", 1, 7, 0, "", "", "05/20/2026", "PM"),
      record("three", "Wang San House", 1, 3, "", "", 1, 7, 0, "", "", "05/21/2026", "AM"),
      record("duplicate", "Wang Kin House", 1, 4, "", "", 1, 7, 0, "", "", "05/20/2026", "AM")
    ])).toEqual({
      entryDates: ["05/20/2026", "05/21/2026"],
      sessions: ["AM", "PM"]
    });
  });

  it("does not expose sessions from rows without an entry date", () => {
    expect(getSessionOptions([
      record("blank-date", "Wang Yan House", 1, 1, "", "", 1, 7, 0, "", "", "", "PM")
    ])).toEqual({
      entryDates: [],
      sessions: []
    });
  });

  it("filters house names by selected entry date and AM/PM session", () => {
    const records = [
      record("one", "Wang Yan House", 1, 1, "", "", 1, 1, 0, "", "", "05/20/2026", "AM"),
      record("two", "Wang Do House", 1, 2, "", "", 1, 1, 0, "", "", "05/20/2026", "PM"),
      record("three", "Wang Tai House", 1, 3, "", "", 1, 1, 0, "", "", "05/20/2026", "AM"),
      record("duplicate", "Wang Yan House", 2, 1, "", "", 1, 1, 0, "", "", "05/20/2026", "AM")
    ];

    expect(getSessionHouseNames(records, "05/20/2026", "AM")).toEqual(["Wang Yan House", "Wang Tai House"]);
  });

  it("returns stable unique house names in first-seen order", () => {
    expect(getHouseNames([
      record("one", "Wang Yan House", 1, 1),
      record("two", "Wang Do House", 1, 2),
      record("three", "Wang Yan House", 1, 3),
      record("four", "Wang San House", 1, 4),
      record("blank", "", 1, 5)
    ])).toEqual(["Wang Yan House", "Wang Do House", "Wang San House"]);
  });

  it("keeps medical rooms on visit-state tone and marks them with a medical icon", () => {
    expect(getRoomTone({ medicalNecessity: "Wheelchair", luggageCount: 7, entryTime: "08:00", exitTime: "" })).toEqual({
      cellTone: "active",
      showBookmark: true,
      showMedicalIcon: true
    });
  });

  it("uses grey, yellow, and pink-blue visit-state tones instead of luggage tones", () => {
    expect(getVisitStateTone({ entryTime: "", exitTime: "" })).toBe("pending");
    expect(getVisitStateTone({ entryTime: "08:00", exitTime: "" })).toBe("active");
    expect(getVisitStateTone({ entryTime: "08:00", exitTime: "09:00" })).toBe("completed");
    expect(getRoomTone({ medicalNecessity: "", luggageCount: 99, entryTime: "08:00", exitTime: "" })).toEqual({
      cellTone: "active",
      showBookmark: true,
      showMedicalIcon: false
    });
  });

  it("renders placeholders for whitespace-only entry and exit times and shows CAS staff number", () => {
    const rows: FloorRow[] = [{
      floor: 1,
      units: [{
        floor: 1,
        unit: 1,
        unitLabel: "01",
        record: record("blank-times", DEFAULT_HOUSE_NAME, 1, 1, "   ", "  ", 1, 1, 2, "CAS-9001")
      }]
    }];

    const text = collectText(FloorGrid({
      title: "Test House",
      houseName: "Wang Yan House",
      rows,
      slideNumber: "1",
      labels: translations.en,
      language: "en",
      entryDate: "05/20/2026",
      session: "AM"
    }));

    expect(text).toContain("Entry --:--");
    expect(text).toContain("Exit --:--");
    expect(text).toContain("CAS no. CAS-9001");
  });

  it("renders medical necessity as a red cross icon instead of a medical cell class", () => {
    const rows: FloorRow[] = [{
      floor: 1,
      units: [{
        floor: 1,
        unit: 1,
        unitLabel: "01",
        record: record("medical", DEFAULT_HOUSE_NAME, 1, 1, "08:00", "", 1, 1, 0, "", "Wheelchair")
      }]
    }];

    const tree = FloorGrid({
      title: "Test House",
      houseName: "Wang Yan House",
      rows,
      slideNumber: "1",
      labels: translations.en,
      language: "en",
      entryDate: "05/20/2026",
      session: "AM"
    });

    expect(findByClass(tree, "medical-cross-icon")).toHaveLength(1);
    expect(findByClass(tree, "session-bookmark")).toHaveLength(1);
    expect(findByClass(tree, "unit-square")[0].props.className).toContain("warning-active");
    expect(findByClass(tree, "unit-square")[0].props.className).not.toContain("warning-medical");
  });

  it("renders Chinese floor labels and unit headers when language is zh-Hant", () => {
    const rows: FloorRow[] = [{
      floor: 5,
      units: [{ floor: 5, unit: 1, unitLabel: "01", record: undefined }]
    }];

    const text = collectText(FloorGrid({
      title: "中文標題",
      houseName: "Wang Yan House",
      rows,
      slideNumber: "第1頁",
      labels: translations["zh-Hant"],
      language: "zh-Hant",
      entryDate: "05/20/2026",
      session: "AM"
    }));

    expect(text).toContain("5樓");
    expect(text).toContain("01室");
    expect(text).toContain("宏仁閣");
  });
});

describe("summary metrics", () => {
  it("summarizes active house entries, pax, luggage, and warnings", () => {
    const metrics = summarizeMovementRecords(sampleMovements);
    expect(metrics.totalRegFlatsToday).toBe(4);
    expect(metrics.totalPaxToday).toBe(10);
  });

  it("does not count whitespace-only entry times as entries", () => {
    const metrics = summarizeMovementRecords([
      record("entered", DEFAULT_HOUSE_NAME, 1, 1, "08:10", ""),
      record("blank-entry", DEFAULT_HOUSE_NAME, 1, 2, "   ")
    ]);

    expect(metrics.totalRegFlatsToday).toBe(2);
    expect(metrics.activeFlats).toBe(1);
  });

  it("summarizes active and completed flats and pax for the selected session", () => {
    const metrics = summarizeMovementRecords([
      record("pending", DEFAULT_HOUSE_NAME, 1, 1, "", "", 2, 1, 0, "", "", "05/20/2026", "AM"),
      record("active", DEFAULT_HOUSE_NAME, 1, 2, "08:00", "", 3, 1, 0, "", "", "05/20/2026", "AM"),
      record("completed", DEFAULT_HOUSE_NAME, 1, 3, "08:00", "09:00", 4, 1, 0, "", "", "05/20/2026", "AM"),
      record("other-session", DEFAULT_HOUSE_NAME, 1, 4, "08:00", "09:00", 99, 1, 0, "", "", "05/20/2026", "PM")
    ], DEFAULT_HOUSE_NAME, "05/20/2026", "AM");

    expect(metrics).toEqual({
      totalRegFlatsToday: 3,
      totalPaxToday: 9,
      activeFlats: 1,
      activePax: 3,
      completedFlats: 1,
      completedPax: 4
    });
  });

  it("excludes blank CSV session records from selected AM and PM summaries", () => {
    const records = normalizeMovementRows(parseCsv(
      "House Name,Floor,Unit,Entry Date,AM/PM,Entry Time,Pax Count\n" +
      "Wang Yan House,1,1,05/20/2026,AM,08:00,1\n" +
      "Wang Yan House,1,2,05/20/2026,PM,13:00,2\n" +
      "Wang Yan House,1,3,05/20/2026,,09:00,99"
    ));

    expect(summarizeMovementRecords(records, DEFAULT_HOUSE_NAME, "05/20/2026", "AM").totalPaxToday).toBe(1);
    expect(summarizeMovementRecords(records, DEFAULT_HOUSE_NAME, "05/20/2026", "PM").totalPaxToday).toBe(2);
    expect(buildFloorRows(records, 1, 1, DEFAULT_HOUSE_NAME, "05/20/2026", "AM")[0].units[2].record).toBeUndefined();
    expect(buildFloorRows(records, 1, 1, DEFAULT_HOUSE_NAME, "05/20/2026", "PM")[0].units[2].record).toBeUndefined();
  });
});

describe("flat status derivation", () => {
  it("derives Not Started, Visiting, Completed, and respects override", () => {
    expect(deriveFlatStatus("", "")).toBe("Not Started");
    expect(deriveFlatStatus("", "09:00")).toBe("Not Started");
    expect(deriveFlatStatus("08:10", "")).toBe("Visiting");
    expect(deriveFlatStatus("08:10", "09:30")).toBe("Completed");
    expect(deriveFlatStatus("08:10", "09:30", "  visiting  ")).toBe("Visiting");
    expect(deriveFlatStatus("08:10", "", "garbage")).toBe("Visiting");
  });
});

describe("duration helpers", () => {
  it("parses HH:mm and rejects invalid", () => {
    expect(parseTimeToMinutes("08:30")).toBe(510);
    expect(parseTimeToMinutes("  9:05 ")).toBe(545);
    expect(parseTimeToMinutes("")).toBeNull();
    expect(parseTimeToMinutes("abc")).toBeNull();
    expect(parseTimeToMinutes("25:00")).toBeNull();
  });

  it("buckets minutes correctly", () => {
    expect(getDurationBucket(0)).toBe("0-30");
    expect(getDurationBucket(30)).toBe("0-30");
    expect(getDurationBucket(31)).toBe("31-60");
    expect(getDurationBucket(180)).toBe("151-180");
    expect(getDurationBucket(181)).toBe("180+");
  });
});

describe("distribution helpers", () => {
  const records: MovementRecord[] = [
    record("a", DEFAULT_HOUSE_NAME, 1, 1, "08:00", "08:20", 1, 1, 1), // Completed, 20m
    record("b", DEFAULT_HOUSE_NAME, 1, 2, "08:00", "", 1, 1, 3),       // Visiting (now=09:00 ⇒ 60m)
    record("c", DEFAULT_HOUSE_NAME, 1, 3, "07:00", "", 1, 1, 2),       // Visiting, 120m
    record("d", DEFAULT_HOUSE_NAME, 1, 4, "", "", 0, 0, 0),             // Not Started
    record("e", "Other House", 1, 1, "08:00", "", 1, 1, 9)              // excluded
  ];
  const now = 9 * 60; // 09:00

  it("counts flat statuses for the selected house", () => {
    expect(getFlatStatusDistribution(records)).toEqual({
      "Not Started": 1,
      Visiting: 2,
      Completed: 1
    });
  });

  it("counts durations for all records with entry time", () => {
    const dist = getDurationDistribution(records, now);
    expect(dist["0-30"]).toBe(1); // record a (20m)
    expect(dist["31-60"]).toBe(1); // record b (60m)
    expect(dist["91-120"]).toBe(1); // record c (120m)
  });

  it("sums CAS staff in-flat durations only for entry-only records", () => {
    const dist = getCsaInFlatDurationDistribution(records, now);
    expect(dist["31-60"]).toBe(3); // record b: 3 staff at 60m
    expect(dist["91-120"]).toBe(2); // record c: 2 staff at 120m
    expect(dist["0-30"]).toBe(0);   // record a excluded (has exit)
  });

  it("counts CAS staff counts per flat with entry", () => {
    const dist = getCsaStaffCountDistribution(records);
    expect(dist[1]).toBe(1);
    expect(dist[2]).toBe(1);
    expect(dist[3]).toBe(1);
    expect(dist[0]).toBeUndefined();
  });
});

describe("CSV movement normalization", () => {
  it("normalizes house name, CAS staff, CSA staff no, medical, and flat status", () => {
    const csv = "House Name,Floor,Unit,Entry Date,AM/PM,Entry Time,Exit Time,Pax Count,Luggage Count,Staff Count,Staff Nos of 民安隊 staff,Medical Necessity\nWang Tai House,2,08,05/20/2026,PM,08:30,09:15,3,7,4,CAS-1234,Wheelchair";

    expect(normalizeMovementRows(parseCsv(csv))).toEqual([{
      id: "Wang Tai House-2-8-0",
      houseName: "Wang Tai House",
      floor: 2,
      unit: 8,
      entryDate: "05/20/2026",
      session: "PM",
      entryTime: "08:30",
      exitTime: "09:15",
      paxCount: 3,
      luggageCount: 7,
      casStaffCount: 4,
      casStaffNo: "CAS-1234",
      medicalNecessity: "Wheelchair",
      flatStatus: "Completed"
    }]);
  });

  it("derives Visiting status when only entry is present", () => {
    const csv = "House Name,Floor,Unit,Entry Time,Exit Time\nWang Yan House,3,1,08:00,";
    expect(normalizeMovementRows(parseCsv(csv))[0].flatStatus).toBe("Visiting");
  });

  it("preserves blank AM/PM values so selected sessions can exclude them", () => {
    const csv = "House Name,Floor,Unit,Entry Date,AM/PM,Entry Time\nWang Yan House,3,1,05/20/2026,,08:00";
    expect(normalizeMovementRows(parseCsv(csv))[0].session).toBe("");
  });
});

describe("translations and formatters", () => {
  it("provides English and Traditional Chinese kiosk labels", () => {
    expect(translations.en.houseName).toBe("House Name");
    expect(translations["zh-Hant"].houseName).toBe("樓宇名稱");
    expect(translations["zh-Hant"].chartFlatStatus).toBe("單位狀態");
  });

  it("formats floor and unit labels per language", () => {
    expect(formatFloorLabel("en", 12)).toBe("12/F");
    expect(formatFloorLabel("zh-Hant", 12)).toBe("12樓");
    expect(formatUnitLabel("en", 3)).toBe("Unit 03");
    expect(formatUnitLabel("zh-Hant", 3)).toBe("03室");
  });

  it("translates house names to Traditional Chinese", () => {
    expect(translateHouseName("en", "Wang Yan House")).toBe("Wang Yan House");
    expect(translateHouseName("zh-Hant", "Wang Yan House")).toBe("宏仁閣");
    expect(translateHouseName("zh-Hant", "Wang Tai House")).toBe("宏泰閣");
    expect(translateHouseName("zh-Hant", "Unknown House")).toBe("Unknown House");
  });

  it("translates flat statuses", () => {
    expect(translateFlatStatus("en", "Visiting")).toBe("Packing");
    expect(translateFlatStatus("zh-Hant", "Visiting")).toBe("收拾中");
    expect(translateFlatStatus("en", "Not Started")).toBe("Not registered");
    expect(translateFlatStatus("zh-Hant", "Not Started")).toBe("未登記");
  });
});

const sampleMovements: MovementRecord[] = [
  record("1", DEFAULT_HOUSE_NAME, 1, 1, "08:10", "09:05", 2, 3),
  record("2", DEFAULT_HOUSE_NAME, 1, 2, "08:15", "09:20", 3, 5),
  record("3", DEFAULT_HOUSE_NAME, 2, 8, "08:22", "09:35", 1, 7),
  record("4", DEFAULT_HOUSE_NAME, 8, 4, "08:40", "10:00", 4, 2),
  record("other-house", "Wang Do House", 1, 1, "10:00", "11:00", 99, 99)
];

function record(
  id: string,
  houseName: string,
  floor: number,
  unit: number,
  entryTime = "08:00",
  exitTime = "09:00",
  paxCount = 1,
  luggageCount = 1,
  casStaffCount = 0,
  casStaffNo = "",
  medicalNecessity = "",
  entryDate = "05/20/2026",
  session: "AM" | "PM" = "AM"
): MovementRecord {
  return {
    id,
    houseName,
    floor,
    unit,
    entryDate,
    session,
    entryTime,
    exitTime,
    paxCount,
    luggageCount,
    casStaffCount,
    casStaffNo,
    medicalNecessity,
    flatStatus: deriveFlatStatus(entryTime, exitTime)
  };
}

function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join("");
  }

  if (typeof node === "object" && "props" in node) {
    return collectText((node as { props?: { children?: unknown } }).props?.children);
  }

  return "";
}

function findByClass(node: unknown, className: string, results: { props: { className?: string } }[] = []): { props: { className?: string } }[] {
  if (node == null || typeof node === "boolean") return results;
  if (Array.isArray(node)) {
    node.forEach((child) => findByClass(child, className, results));
    return results;
  }

  if (typeof node === "object" && "props" in node) {
    const element = node as { props?: { className?: string; children?: unknown } };
    if (element.props?.className?.split(/\s+/).includes(className)) {
      results.push(element as { props: { className?: string } });
    }
    findByClass(element.props?.children, className, results);
  }

  return results;
}
