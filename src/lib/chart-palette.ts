import type { DurationBucket, FlatStatus } from "./models";

export const STATUS_COLORS: Record<FlatStatus, string> = {
  "Not Started": "#94a3b8",
  Visiting: "#ca8a04",
  Completed: "#22c55e"
};

export const BUCKET_COLORS: Record<DurationBucket, string> = {
  "0-30": "#22d3ee",
  "31-60": "#6366f1",
  "61-90": "#a855f7",
  "91-120": "#ec4899",
  "121-150": "#f59e0b",
  "151-180": "#ef4444",
  "180+": "#b91c1c"
};

export const STAFF_COUNT_COLORS = [
  "#22c55e",
  "#22d3ee",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#94a3b8"
];
