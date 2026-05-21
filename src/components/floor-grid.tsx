import { type FloorRow, type Language, type SummaryMetrics as SummaryMetricsType, type VisitSession } from "@/src/lib/models";
import { getRoomTone } from "@/src/lib/movements";
import {
  formatFloorLabel,
  formatUnitLabel,
  translateHouseName,
  type TranslationKey
} from "@/src/lib/i18n";
import { SummaryStatsBar } from "./summary-stats-bar";

type FloorGridProps = {
  title: string;
  houseName: string;
  rows: FloorRow[];
  slideNumber: string;
  labels: Record<TranslationKey, string>;
  language: Language;
  entryDate: string;
  session: VisitSession;
  summaryMetrics?: SummaryMetricsType;
};

export function FloorGrid({ title, houseName, rows, slideNumber, labels, language, entryDate, session, summaryMetrics }: FloorGridProps) {
  const unitLabels = Array.from({ length: 8 }, (_, index) => formatUnitLabel(language, index + 1));
  const selected = { entryDate, session };
  return (
    <article className="slide">
      <header className="slide-header">
        <div>
          <p className="eyebrow">
            {slideNumber} / {translateHouseName(language, houseName)}
          </p>
          <h1>{title}</h1>
        </div>
        <div className="timestamp">{labels.livePolling}</div>
        {summaryMetrics ? (
          <SummaryStatsBar metrics={summaryMetrics} labels={labels} compact />
        ) : null}
      </header>

      <div className="floor-grid" aria-label={`${title} floor grid`}>
        <div className="unit-header-row">
          <div className="floor-label" aria-hidden="true" />
          {unitLabels.map((unitLabel) => (
            <div className="unit-header" key={unitLabel}>{unitLabel}</div>
          ))}
        </div>
        {rows.map((row) => (
          <div className="floor-row" key={row.floor}>
            <div className="floor-label">{formatFloorLabel(language, row.floor)}</div>
            {row.units.map((cell) => {
              const { cellTone, showBookmark, showMedicalIcon } = getRoomTone(cell.record, selected);
              const casNo = cell.record?.casStaffNo?.trim();
              const entryTime = cell.record?.entryTime?.trim() || "--:--";
              const exitTime = cell.record?.exitTime?.trim() || "--:--";
              return (
                <div className={`unit-square warning-${cellTone}`} key={`${row.floor}-${cell.unit}`}>
                  <div className="unit-details">
                    {cell.record?.entryDate || cell.record?.session ? (
                      <span>{[cell.record.entryDate, cell.record.session].filter(Boolean).join(" ")}</span>
                    ) : null}
                    <span>{labels.entry} {entryTime} | {labels.exit} {exitTime}</span>
                    <span>{labels.pax} {cell.record?.paxCount ?? 0}</span>
                    <span>
                      {labels.casStaff} {cell.record?.casStaffCount ?? 0}
                      {casNo ? ` · ${labels.casStaffNo} ${casNo}` : ""}
                    </span>
                  </div>
                  {showBookmark ? (
                    <span
                      className="session-bookmark"
                      aria-label="Selected session flat"
                    />
                  ) : null}
                  {showMedicalIcon ? (
                    <span
                      className="medical-cross-icon"
                      aria-label={labels.medicalNecessity}
                      title={labels.medicalNecessity}
                    >
                      +
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </article>
  );
}
