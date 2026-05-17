export const DEFAULT_HOUSE_NAME = "Wang Yan House";
export const UNITS_PER_FLOOR = 8;

export type FlatStatus = "Not Reg" | "Reg" | "Visiting" | "Completed";

export const FLAT_STATUSES: readonly FlatStatus[] = ["Not Reg", "Reg", "Visiting", "Completed"];

export type MovementRecord = {
  id: string;
  houseName: string;
  floor: number;
  unit: number;
  entryTime: string;
  exitTime: string;
  paxCount: number;
  luggageCount: number;
  casStaffCount: number;
  casStaffNo: string;
  medicalNecessity: string;
  flatStatus: FlatStatus;
};

export type UnitCell = {
  floor: number;
  unit: number;
  unitLabel: string;
  record?: MovementRecord;
};

export type FloorRow = {
  floor: number;
  units: UnitCell[];
};

export type SummaryMetrics = {
  totalEntries: number;
  totalPax: number;
  totalLuggage: number;
  excessiveLuggageWarnings: number;
  moderateLuggageWarnings: number;
};

export type DurationBucket =
  | "0-30"
  | "31-60"
  | "61-90"
  | "91-120"
  | "121-150"
  | "151-180"
  | "180+";

export const DURATION_BUCKETS: readonly DurationBucket[] = [
  "0-30",
  "31-60",
  "61-90",
  "91-120",
  "121-150",
  "151-180",
  "180+"
];

export type LuggageTone = "default" | "green" | "purple";
export type CellTone = LuggageTone | "medical";
export type ThemeMode = "dark" | "light";
export type Language = "en" | "zh-Hant";
