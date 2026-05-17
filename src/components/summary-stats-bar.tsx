import type { SummaryMetrics as SummaryMetricsType } from "@/src/lib/models";
import type { TranslationKey } from "@/src/lib/i18n";

type SummaryStatsBarProps = {
  metrics: SummaryMetricsType;
  labels: Record<TranslationKey, string>;
  compact?: boolean;
};

export function SummaryStatsBar({ metrics, labels, compact }: SummaryStatsBarProps) {
  return (
    <section
      className={`summary-grid${compact ? " summary-stats-bar--compact" : ""}`}
      aria-label="Summary metrics"
    >
      <MetricCard label={labels.totalEntriesToday} value={metrics.totalEntries} />
      <MetricCard label={labels.totalPax} value={metrics.totalPax} />
      <MetricCard label={labels.totalLuggage} value={metrics.totalLuggage} />
      <MetricCard label={labels.excessiveLuggage} value={metrics.excessiveLuggageWarnings} />
      <MetricCard label={labels.moderateLuggage} value={metrics.moderateLuggageWarnings} />
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <div className="metric-value">{value}</div>
    </div>
  );
}
