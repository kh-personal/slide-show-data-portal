import { useMemo } from "react";
import {
  DURATION_BUCKETS,
  FLAT_STATUSES,
  type Language,
  type MovementRecord
} from "@/src/lib/models";
import {
  getDurationDistribution,
  getFlatStatusDistribution
} from "@/src/lib/movements";
import {
  formatDurationBucket,
  translateFlatStatus,
  type TranslationKey
} from "@/src/lib/i18n";
import { BUCKET_COLORS, STATUS_COLORS } from "@/src/lib/chart-palette";
import { DonutChart, type DonutChartSlice } from "./donut-chart";

type SummaryChartsProps = {
  houseName: string;
  records: MovementRecord[];
  nowMinutes: number;
  language: Language;
  labels: Record<TranslationKey, string>;
};

export function SummaryCharts({
  houseName,
  records,
  nowMinutes,
  language,
  labels
}: SummaryChartsProps) {
  const statusSlices = useMemo<DonutChartSlice[]>(() => {
    const dist = getFlatStatusDistribution(records, houseName);
    return FLAT_STATUSES.map((status) => ({
      label: translateFlatStatus(language, status),
      value: dist[status],
      color: STATUS_COLORS[status]
    }));
  }, [records, houseName, language]);

  const durationSlices = useMemo<DonutChartSlice[]>(() => {
    const dist = getDurationDistribution(records, nowMinutes, houseName);
    return DURATION_BUCKETS.map((bucket) => ({
      label: formatDurationBucket(language, bucket),
      value: dist[bucket],
      color: BUCKET_COLORS[bucket]
    }));
  }, [records, houseName, language, nowMinutes]);

  return (
    <section className="charts-grid" aria-label="Distribution charts">
      <DonutChart title={labels.chartFlatStatus} data={statusSlices} emptyLabel={labels.noData} />
      <DonutChart title={labels.chartDurationDistribution} data={durationSlices} emptyLabel={labels.noData} />
    </section>
  );
}
