import type { Language, MovementRecord, SummaryMetrics as SummaryMetricsType } from "@/src/lib/models";
import { translateHouseName, type TranslationKey } from "@/src/lib/i18n";
import { SummaryMetrics } from "./summary-metrics";
import { SummaryCharts } from "./summary-charts";

type SummarySlideProps = {
  houseName: string;
  metrics: SummaryMetricsType;
  labels: Record<TranslationKey, string>;
  records: MovementRecord[];
  nowMinutes: number;
  language: Language;
};

export function SummarySlide({
  houseName,
  metrics,
  labels,
  records,
  nowMinutes,
  language
}: SummarySlideProps) {
  return (
    <article className="slide summary-slide">
      <header className="slide-header">
        <div>
          <p className="eyebrow">{labels.slideThree} / {translateHouseName(language, houseName)}</p>
          <h1>{labels.buildingSummary}</h1>
        </div>
        <div className="timestamp">{labels.realTimeStats}</div>
      </header>

      <SummaryMetrics metrics={metrics} labels={labels} />
      <SummaryCharts
        houseName={houseName}
        records={records}
        nowMinutes={nowMinutes}
        language={language}
        labels={labels}
      />
    </article>
  );
}
