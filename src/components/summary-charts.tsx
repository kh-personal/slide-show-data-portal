import { useMemo } from "react";
import {
  DURATION_BUCKETS,
  FLAT_STATUSES,
  type Language,
  type MovementRecord
} from "@/src/lib/models";
import {
  getCsaInFlatDurationDistribution,
  getCsaStaffCountDistribution,
  getDurationDistribution,
  getFlatStatusDistribution
} from "@/src/lib/movements";
import {
  formatDurationBucket,
  translateFlatStatus,
  type TranslationKey
} from "@/src/lib/i18n";
import { BUCKET_COLORS, STAFF_COUNT_COLORS, STATUS_COLORS } from "@/src/lib/chart-palette";
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

  const csaDurationSlices = useMemo<DonutChartSlice[]>(() => {
    const dist = getCsaInFlatDurationDistribution(records, nowMinutes, houseName);
    return DURATION_BUCKETS.map((bucket) => ({
      label: formatDurationBucket(language, bucket),
      value: dist[bucket],
      color: BUCKET_COLORS[bucket]
    }));
  }, [records, houseName, language, nowMinutes]);

  const staffCountSlices = useMemo<DonutChartSlice[]>(() => {
    const dist = getCsaStaffCountDistribution(records, houseName);
    return Object.keys(dist)
      .map((key) => Number(key))
      .sort((a, b) => a - b)
      .map((count, idx) => ({
        label: `${count} ${labels.staffCountLabel}`,
        value: dist[count],
        color: STAFF_COUNT_COLORS[idx % STAFF_COUNT_COLORS.length]
      }));
  }, [records, houseName, labels.staffCountLabel]);

  return (
    <section className="charts-grid" aria-label="Distribution charts">
      <DonutChart title={labels.chartFlatStatus} data={statusSlices} emptyLabel={labels.noData} />
      <DonutChart title={labels.chartDurationDistribution} data={durationSlices} emptyLabel={labels.noData} />
      <DonutChart title={labels.chartCsaInFlatDuration} data={csaDurationSlices} emptyLabel={labels.noData} />
      <DonutChart title={labels.chartCsaStaffCount} data={staffCountSlices} emptyLabel={labels.noData} />
    </section>
  );
}
