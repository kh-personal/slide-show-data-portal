"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_HOUSE_NAME, type Language, type MovementRecord, type ThemeMode } from "@/src/lib/models";
import {
  buildFloorRows,
  getSessionHouseNames,
  getSessionOptions,
  getSessionsForEntryDate,
  summarizeMovementRecords
} from "@/src/lib/movements";
import { fetchMovementData } from "@/src/lib/movement-data";
import { translateHouseName, translations } from "@/src/lib/i18n";
import { useSlideshow } from "@/src/lib/hooks/use-slideshow";
import { FloorGrid } from "./floor-grid";
import { SummarySlide } from "./summary-slide";

const DATA_REFRESH_MS = Number(process.env.NEXT_PUBLIC_DATA_REFRESH_MS ?? 60_000);
const SLIDE_DURATION_MS = Number(process.env.NEXT_PUBLIC_SLIDE_DURATION_MS ?? 15_000);
const CSV_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL ?? "";
const SLIDE_COUNT = 3;

type MovementResponse = {
  records: MovementRecord[];
};

export function KioskPortal() {
  const [selectedEntryDate, setSelectedEntryDate] = useState("");
  const [selectedSession, setSelectedSession] = useState<"AM" | "PM">("AM");
  const [selectedHouseName, setSelectedHouseName] = useState(DEFAULT_HOUSE_NAME);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<Language>("zh-Hant");
  const [nowMinutes, setNowMinutes] = useState(() => currentMinutes());
  const slideshow = useSlideshow(SLIDE_COUNT, SLIDE_DURATION_MS);

  const { data, error } = useQuery({
    queryKey: ["movements"],
    queryFn: fetchMovements,
    refetchInterval: DATA_REFRESH_MS,
    placeholderData: (previous) => previous
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNowMinutes(currentMinutes()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const records = data?.records ?? [];
  const labels = translations[language];
  const sessionOptions = useMemo(() => getSessionOptions(records), [records]);
  const entryDateChoices = sessionOptions.entryDates.length ? sessionOptions.entryDates : [""];
  const activeEntryDate = sessionOptions.entryDates.includes(selectedEntryDate)
    ? selectedEntryDate
    : sessionOptions.entryDates[0] ?? "";
  const sessionChoices = useMemo(
    () => getSessionsForEntryDate(records, activeEntryDate),
    [activeEntryDate, records]
  );
  const activeSession = sessionChoices.includes(selectedSession)
    ? selectedSession
    : sessionChoices[0] ?? "AM";
  const sessionSelectChoices = sessionChoices.length ? sessionChoices : [activeSession];
  const houseNames = useMemo(
    () => getSessionHouseNames(records, activeEntryDate, activeSession),
    [activeEntryDate, activeSession, records]
  );
  const activeHouseName = houseNames.includes(selectedHouseName)
    ? selectedHouseName
    : houseNames[0] ?? DEFAULT_HOUSE_NAME;
  const selectHouseNames = houseNames.length ? houseNames : [DEFAULT_HOUSE_NAME];
  const firstRows = useMemo(
    () => buildFloorRows(records, 1, 16, activeHouseName, activeEntryDate, activeSession),
    [activeEntryDate, activeHouseName, activeSession, records]
  );
  const secondRows = useMemo(
    () => buildFloorRows(records, 17, 31, activeHouseName, activeEntryDate, activeSession),
    [activeEntryDate, activeHouseName, activeSession, records]
  );
  const metrics = useMemo(
    () => summarizeMovementRecords(records, activeHouseName, activeEntryDate, activeSession),
    [activeEntryDate, activeHouseName, activeSession, records]
  );
  const activeSessionRecords = useMemo(
    () => records.filter((record) => record.entryDate === activeEntryDate && record.session === activeSession),
    [activeEntryDate, activeSession, records]
  );
  const targetTheme = theme === "dark" ? "light" : "dark";
  const targetLanguage = language === "en" ? "zh-Hant" : "en";

  if (error && !data) {
    return (
      <main className="kiosk-shell" data-theme={theme}>
        <section className="error-panel" role="alert">
          <div>
            <p className="eyebrow">{labels.dataSourceUnavailable}</p>
            <h1>{labels.unableToLoad}</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="kiosk-shell" data-theme={theme}>
      <section className="kiosk-stage" aria-label="Residential Monitoring Portal">
        <div className="control-bar">
          <label>
            {labels.entryDate}
            <select
              aria-label={labels.entryDate}
              value={activeEntryDate}
              onChange={(event) => setSelectedEntryDate(event.target.value)}
            >
              {entryDateChoices.map((entryDate) => (
                <option key={entryDate} value={entryDate}>
                  {entryDate || labels.noData}
                </option>
              ))}
            </select>
          </label>
          <label>
            {labels.session}
            <select
              aria-label={labels.session}
              value={activeSession}
              onChange={(event) => setSelectedSession(event.target.value === "PM" ? "PM" : "AM")}
            >
              {sessionSelectChoices.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </label>
          <label>
            {labels.houseName}
            <select
              aria-label={labels.houseName}
              value={activeHouseName}
              onChange={(event) => setSelectedHouseName(event.target.value)}
            >
              {selectHouseNames.map((houseName) => (
                <option key={houseName} value={houseName}>
                  {translateHouseName(language, houseName)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="control-nav"
            onClick={slideshow.prev}
            disabled={!slideshow.paused}
            aria-label={labels.previousSlide}
            title={labels.previousSlide}
          >
            ◀
          </button>
          <button
            type="button"
            className="control-toggle"
            onClick={slideshow.toggle}
            aria-pressed={slideshow.paused}
          >
            {slideshow.paused ? labels.play : labels.pause}
          </button>
          <button
            type="button"
            className="control-nav"
            onClick={slideshow.next}
            disabled={!slideshow.paused}
            aria-label={labels.nextSlide}
            title={labels.nextSlide}
          >
            ▶
          </button>
          <button type="button" onClick={() => setTheme(targetTheme)}>
            {labels[targetTheme]}
          </button>
          <button type="button" onClick={() => setLanguage(targetLanguage)}>
            {targetLanguage === "zh-Hant" ? labels.traditionalChinese : labels.english}
          </button>
        </div>
        <div
          className="slide-track"
          style={{ transform: `translateY(-${slideshow.activeIndex * (100 / SLIDE_COUNT)}%)` }}
        >
          <FloorGrid
            title={labels.floorsOneToSixteen}
            houseName={activeHouseName}
            rows={firstRows}
            slideNumber={labels.slideOne}
            labels={labels}
            language={language}
            summaryMetrics={metrics}
            entryDate={activeEntryDate}
            session={activeSession}
          />
          <FloorGrid
            title={labels.floorsSeventeenToThirtyOne}
            houseName={activeHouseName}
            rows={secondRows}
            slideNumber={labels.slideTwo}
            labels={labels}
            language={language}
            summaryMetrics={metrics}
            entryDate={activeEntryDate}
            session={activeSession}
          />
          <SummarySlide
            houseName={activeHouseName}
            metrics={metrics}
            labels={labels}
            records={activeSessionRecords}
            nowMinutes={nowMinutes}
            language={language}
          />
        </div>
      </section>
    </main>
  );
}

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

async function fetchMovements(): Promise<MovementResponse> {
  return fetchMovementData(CSV_URL);
}
