import { DEFAULT_HOUSE_NAME, type MovementRecord } from "./models";
import type { MovementSession } from "./models";
import { deriveFlatStatus } from "./movements";

export type CsvRow = Record<string, string>;

const aliases = {
  houseName: ["housename"],
  floor: ["floor"],
  unit: ["unit"],
  entryDate: ["entrydate"],
  session: ["am/pm", "ampm", "session"],
  entryTime: ["entrytime", "entry", "starttime", "start"],
  exitTime: ["exittime", "exit", "completiontime", "completion"],
  paxCount: ["paxcount", "pax", "peoplecount"],
  luggageCount: ["luggagecount", "luggage", "bagcount"],
  casStaffCount: ["staffcount", "casstaffcount", "casstaff"],
  casStaffNo: ["staffnosof民安隊staff", "csastaffno", "casstaffno", "civilaidstaffno", "民安隊員編號"],
  medicalNecessity: ["medicalnecessity", "medical"],
  flatStatus: ["flatstatus", "status"]
} as const;

export function parseCsv(csv: string): CsvRow[] {
  const rows = parseCsvLines(csv.trim());
  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).filter((row) => row.some(Boolean)).map((row) => {
    return Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ""]));
  });
}

export function normalizeMovementRows(rows: CsvRow[]): MovementRecord[] {
  return rows
    .map((row, index) => normalizeMovementRow(row, index))
    .filter((record): record is MovementRecord => record !== null);
}

export function normalizeMovementRow(row: CsvRow, index = 0): MovementRecord | null {
  const floor = toNumber(readField(row, aliases.floor));
  const unit = toNumber(readField(row, aliases.unit));

  if (!Number.isInteger(floor) || floor < 1 || floor > 31 || !Number.isInteger(unit) || unit < 1 || unit > 8) {
    return null;
  }

  const houseName = readField(row, aliases.houseName) || DEFAULT_HOUSE_NAME;
  const entryDate = readField(row, aliases.entryDate);
  const session = normalizeSession(readField(row, aliases.session));
  const entryTime = readField(row, aliases.entryTime);
  const exitTime = readField(row, aliases.exitTime);
  const flatStatusOverride = readField(row, aliases.flatStatus);

  return {
    id: `${houseName}-${floor}-${unit}-${index}`,
    houseName,
    floor,
    unit,
    entryDate,
    session,
    entryTime,
    exitTime,
    paxCount: toNumber(readField(row, aliases.paxCount)),
    luggageCount: toNumber(readField(row, aliases.luggageCount)),
    casStaffCount: toNumber(readField(row, aliases.casStaffCount)),
    casStaffNo: readField(row, aliases.casStaffNo),
    medicalNecessity: readField(row, aliases.medicalNecessity),
    flatStatus: deriveFlatStatus(entryTime, exitTime, flatStatusOverride)
  };
}

function normalizeSession(value: string): MovementSession {
  const normalized = value.trim().toUpperCase();
  if (normalized === "AM" || normalized === "PM") return normalized;
  return "";
}

function readField(row: CsvRow, names: readonly string[]): string {
  const normalized = new Map(Object.entries(row).map(([key, value]) => [normalizeKey(key), value]));
  for (const name of names) {
    const value = normalized.get(normalizeKey(name));
    if (value !== undefined) {
      return value.trim();
    }
  }
  return "";
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[\s_-]/g, "");
}

function toNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCsvLines(csv: string): string[][] {
  if (!csv) {
    return [];
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);
  return rows;
}
