export const DEFAULT_HOUSE_NAME = "Wang Yan House";
export const UNITS_PER_FLOOR = 8;

export type FlatStatus = "Not Started" | "Visiting" | "Completed";
export type VisitSession = "AM" | "PM";
export type MovementSession = VisitSession | "";

export const FLAT_STATUSES: readonly FlatStatus[] = ["Not Started", "Visiting", "Completed"];

export type MovementRecord = {
  id: string;
  houseName: string;
  floor: number;
  unit: number;
  entryDate: string;
  session: MovementSession;
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
  totalRegFlatsToday: number;
  totalPaxToday: number;
  activeFlats: number;
  activePax: number;
  completedFlats: number;
  completedPax: number;
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

export type VisitStateTone = "pending" | "active" | "completed";
export type CellTone = "empty" | "filled" | VisitStateTone;
export type ThemeMode = "dark" | "light";
export type Language = "en" | "zh-Hant";
