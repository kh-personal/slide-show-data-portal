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
  getLuggageTone,
  getRoomTone,
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

  it("maps luggage thresholds to default, green, and purple", () => {
    expect(getLuggageTone(4)).toBe("default");
    expect(getLuggageTone(5)).toBe("green");
    expect(getLuggageTone(7)).toBe("purple");
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

  it("uses medical cell tone and purple luggage tone for medical rooms with excessive luggage", () => {
    expect(getRoomTone({ medicalNecessity: "Wheelchair", luggageCount: 7 })).toEqual({
      cellTone: "medical",
      luggageTone: "purple"
    });
  });

  it("uses green cell and luggage tones for non-medical rooms with moderate luggage", () => {
    expect(getRoomTone({ medicalNecessity: "", luggageCount: 5 })).toEqual({
      cellTone: "green",
      luggageTone: "green"
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
      language: "en"
    }));

    expect(text).toContain("Entry --:--");
    expect(text).toContain("Exit --:--");
    expect(text).toContain("CAS no. CAS-9001");
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
      language: "zh-Hant"
    }));

    expect(text).toContain("5樓");
    expect(text).toContain("01室");
    expect(text).toContain("宏仁閣");
  });
});

describe("summary metrics", () => {
  it("summarizes active house entries, pax, luggage, and warnings", () => {
    const metrics = summarizeMovementRecords(sampleMovements);
    expect(metrics.totalEntries).toBeGreaterThan(0);
    expect(metrics.totalPax).toBeGreaterThan(0);
  });

  it("does not count whitespace-only entry times as entries", () => {
    const metrics = summarizeMovementRecords([
      record("entered", DEFAULT_HOUSE_NAME, 1, 1, "08:10"),
      record("blank-entry", DEFAULT_HOUSE_NAME, 1, 2, "   ")
    ]);

    expect(metrics.totalEntries).toBe(1);
  });
});

describe("flat status derivation", () => {
  it("derives Not Reg, Visiting, Completed, and respects override", () => {
    expect(deriveFlatStatus("", "")).toBe("Not Reg");
    expect(deriveFlatStatus("08:10", "")).toBe("Visiting");
    expect(deriveFlatStatus("08:10", "09:30")).toBe("Completed");
    expect(deriveFlatStatus("08:10", "09:30", "Reg")).toBe("Reg");
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
    record("d", DEFAULT_HOUSE_NAME, 1, 4, "", "", 0, 0, 0),             // Not Reg
    record("e", "Other House", 1, 1, "08:00", "", 1, 1, 9)              // excluded
  ];
  const now = 9 * 60; // 09:00

  it("counts flat statuses for the selected house", () => {
    expect(getFlatStatusDistribution(records)).toEqual({
      "Not Reg": 1,
      Reg: 0,
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
    const csv = "House Name,Floor,Unit,Entry Time,Exit Time,Pax Count,Luggage Count,Staff Nos of 民安隊 staff,CSA Staff No,Medical Necessity,Flat Status\nWang Tai House,2,08,08:30,09:15,3,7,4,CAS-1234,Wheelchair,";

    expect(normalizeMovementRows(parseCsv(csv))).toEqual([{
      id: "Wang Tai House-2-8-0",
      houseName: "Wang Tai House",
      floor: 2,
      unit: 8,
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
    expect(translateFlatStatus("en", "Visiting")).toBe("Visiting");
    expect(translateFlatStatus("zh-Hant", "Visiting")).toBe("訪問中");
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
  medicalNecessity = ""
): MovementRecord {
  return {
    id,
    houseName,
    floor,
    unit,
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
