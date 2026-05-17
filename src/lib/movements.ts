import {
  DEFAULT_HOUSE_NAME,
  DURATION_BUCKETS,
  FLAT_STATUSES,
  UNITS_PER_FLOOR,
  type CellTone,
  type DurationBucket,
  type FlatStatus,
  type FloorRow,
  type LuggageTone,
  type MovementRecord,
  type SummaryMetrics
} from "./models";

export function getLuggageTone(luggageCount: number): LuggageTone {
  if (luggageCount > 6) {
    return "purple";
  }
  if (luggageCount > 4) {
    return "green";
  }
  return "default";
}

export function getRoomTone(
  record: Pick<MovementRecord, "luggageCount" | "medicalNecessity"> | undefined
): { cellTone: CellTone; luggageTone: LuggageTone } {
  const luggageTone = getLuggageTone(record?.luggageCount ?? 0);
  return {
    cellTone: record?.medicalNecessity.trim() ? "medical" : luggageTone,
    luggageTone
  };
}

export function getHouseNames(records: MovementRecord[]): string[] {
  const houseNames = new Set<string>();
  for (const record of records) {
    const houseName = record.houseName.trim();
    if (houseName) {
      houseNames.add(houseName);
    }
  }
  return [...houseNames];
}

export function deriveFlatStatus(
  entryTime: string,
  exitTime: string,
  override?: string
): FlatStatus {
  const trimmedOverride = override?.trim();
  if (trimmedOverride) {
    const match = FLAT_STATUSES.find(
      (status) => status.toLowerCase() === trimmedOverride.toLowerCase()
    );
    if (match) {
      return match;
    }
  }
  const hasEntry = entryTime.trim().length > 0;
  const hasExit = exitTime.trim().length > 0;
  if (hasEntry && hasExit) return "Completed";
  if (hasEntry) return "Visiting";
  if (hasExit) return "Reg";
  return "Not Reg";
}

export function buildFloorRows(
  records: MovementRecord[],
  floorStart: number,
  floorEnd: number,
  houseName = DEFAULT_HOUSE_NAME
): FloorRow[] {
  const recordMap = new Map(
    records
      .filter((record) => record.houseName === houseName)
      .map((record) => [`${record.floor}-${record.unit}`, record])
  );

  return range(floorStart, floorEnd).map((floor) => ({
    floor,
    units: range(1, UNITS_PER_FLOOR).map((unit) => ({
      floor,
      unit,
      unitLabel: unit.toString().padStart(2, "0"),
      record: recordMap.get(`${floor}-${unit}`)
    }))
  }));
}

export function summarizeMovementRecords(
  records: MovementRecord[],
  houseName = DEFAULT_HOUSE_NAME
): SummaryMetrics {
  const houseRecords = records.filter((record) => record.houseName === houseName);
  return {
    totalEntries: houseRecords.filter((record) => record.entryTime.trim()).length,
    totalPax: houseRecords.reduce((total, record) => total + record.paxCount, 0),
    totalLuggage: houseRecords.reduce((total, record) => total + record.luggageCount, 0),
    excessiveLuggageWarnings: houseRecords.filter((record) => record.luggageCount > 6).length,
    moderateLuggageWarnings: houseRecords.filter(
      (record) => record.luggageCount > 4 && record.luggageCount <= 6
    ).length
  };
}

export function parseTimeToMinutes(time: string): number | null {
  const trimmed = time.trim();
  if (!trimmed) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function getDurationBucket(minutes: number): DurationBucket {
  if (minutes <= 30) return "0-30";
  if (minutes <= 60) return "31-60";
  if (minutes <= 90) return "61-90";
  if (minutes <= 120) return "91-120";
  if (minutes <= 150) return "121-150";
  if (minutes <= 180) return "151-180";
  return "180+";
}

function emptyBucketCounts(): Record<DurationBucket, number> {
  return DURATION_BUCKETS.reduce((acc, bucket) => {
    acc[bucket] = 0;
    return acc;
  }, {} as Record<DurationBucket, number>);
}

function selectHouseRecords(records: MovementRecord[], houseName: string): MovementRecord[] {
  return records.filter((record) => record.houseName === houseName);
}

export function getFlatStatusDistribution(
  records: MovementRecord[],
  houseName = DEFAULT_HOUSE_NAME
): Record<FlatStatus, number> {
  const counts: Record<FlatStatus, number> = { "Not Reg": 0, Reg: 0, Visiting: 0, Completed: 0 };
  for (const record of selectHouseRecords(records, houseName)) {
    counts[record.flatStatus] += 1;
  }
  return counts;
}

export function getDurationDistribution(
  records: MovementRecord[],
  nowMinutes: number,
  houseName = DEFAULT_HOUSE_NAME
): Record<DurationBucket, number> {
  const buckets = emptyBucketCounts();
  for (const record of selectHouseRecords(records, houseName)) {
    const start = parseTimeToMinutes(record.entryTime);
    if (start === null) continue;
    const end = parseTimeToMinutes(record.exitTime) ?? nowMinutes;
    const duration = Math.max(0, end - start);
    buckets[getDurationBucket(duration)] += 1;
  }
  return buckets;
}

export function getCsaInFlatDurationDistribution(
  records: MovementRecord[],
  nowMinutes: number,
  houseName = DEFAULT_HOUSE_NAME
): Record<DurationBucket, number> {
  const buckets = emptyBucketCounts();
  for (const record of selectHouseRecords(records, houseName)) {
    const start = parseTimeToMinutes(record.entryTime);
    if (start === null) continue;
    if (record.exitTime.trim()) continue;
    const duration = Math.max(0, nowMinutes - start);
    buckets[getDurationBucket(duration)] += record.casStaffCount;
  }
  return buckets;
}

export function getCsaStaffCountDistribution(
  records: MovementRecord[],
  houseName = DEFAULT_HOUSE_NAME
): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const record of selectHouseRecords(records, houseName)) {
    if (!record.entryTime.trim()) continue;
    const key = record.casStaffCount;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
