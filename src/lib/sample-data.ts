import { DEFAULT_HOUSE_NAME, type MovementRecord, type VisitSession } from "./models";
import { deriveFlatStatus } from "./movements";

export const sampleMovements: MovementRecord[] = [
  record(DEFAULT_HOUSE_NAME, 1, 1, "05/20/2026", "AM", "08:10", "09:05", 2, 3, 1, "CAS-1101", ""),
  record(DEFAULT_HOUSE_NAME, 1, 2, "05/20/2026", "AM", "08:15", "09:20", 3, 5, 2, "CAS-1102, CAS-1103", ""),
  record(DEFAULT_HOUSE_NAME, 2, 8, "05/20/2026", "AM", "08:22", "09:35", 1, 7, 3, "CAS-1201, CAS-1202, CAS-1203", "Wheelchair"),
  record(DEFAULT_HOUSE_NAME, 8, 4, "05/20/2026", "AM", "08:40", "10:00", 4, 2, 0, ""),
  record(DEFAULT_HOUSE_NAME, 16, 6, "05/20/2026", "AM", "09:00", "", 2, 6, 4, "CAS-1601, CAS-1602, CAS-1603, CAS-1604"),
  record(DEFAULT_HOUSE_NAME, 17, 1, "05/20/2026", "AM", "09:10", "", 1, 4, 2, "CAS-1701, CAS-1702"),
  record(DEFAULT_HOUSE_NAME, 24, 5, "05/20/2026", "AM", "09:25", "", 3, 8, 5, "CAS-2401, CAS-2402, CAS-2403, CAS-2404, CAS-2405"),
  record(DEFAULT_HOUSE_NAME, 31, 8, "05/20/2026", "AM", "", "", 0, 0, 0, ""),
  record("Wang Tai House", 1, 1, "05/20/2026", "PM", "08:05", "09:00", 4, 6, 2, "CAS-2001", ""),
  record("Wang Tai House", 17, 3, "05/20/2026", "PM", "09:15", "", 2, 8, 4, "CAS-2002, CAS-2003", "Oxygen")
];

function record(
  houseName: string,
  floor: number,
  unit: number,
  entryDate: string,
  session: VisitSession,
  entryTime: string,
  exitTime: string,
  paxCount: number,
  luggageCount: number,
  casStaffCount = 0,
  casStaffNo = "",
  medicalNecessity = ""
): MovementRecord {
  return {
    id: `${houseName}-${floor}-${unit}`,
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
