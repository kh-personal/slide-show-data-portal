import type { DonutChartSlice } from "./donut-chart";

type DonutLegendProps = {
  data: DonutChartSlice[];
  total: number;
};

export function DonutLegend({ data, total }: DonutLegendProps) {
  return (
    <ul className="donut-legend">
      {data.map((slice) => {
        const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
        return (
          <li key={slice.label}>
            <span
              className="legend-dot"
              style={{ background: slice.color }}
              aria-hidden="true"
            />
            <span className="legend-label">{slice.label}</span>
            <span className="legend-percent">{pct}%</span>
            <span className="legend-value">{slice.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
