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
      <MetricCard label={labels.totalRegFlatsToday} value={metrics.totalRegFlatsToday} />
      <MetricCard label={labels.totalPaxToday} value={metrics.totalPaxToday} />
      <MetricCard label={labels.activeFlats} value={metrics.activeFlats} tone="active" />
      <MetricCard label={labels.activePax} value={metrics.activePax} tone="active" />
      <MetricCard label={labels.completedFlats} value={metrics.completedFlats} tone="completed" />
      <MetricCard label={labels.completedPax} value={metrics.completedPax} tone="completed" />
    </section>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone?: "active" | "completed" }) {
  return (
    <div className={`metric-card${tone ? ` metric-card--${tone}` : ""}`}>
      <p className="metric-label">{label}</p>
      <div className="metric-value">{value}</div>
    </div>
  );
}
