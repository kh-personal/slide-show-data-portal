import type { ReactElement } from "react";
import { buildAnnularPath, sliceMidpoint } from "@/src/lib/donut-geometry";
import { DonutLegend } from "./donut-legend";

export type DonutChartSlice = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  title: string;
  data: DonutChartSlice[];
  emptyLabel: string;
};

const VIEW_X = -70;
const VIEW_Y = 0;
const VIEW_W = 340;
const VIEW_H = 200;
const CX = 100;
const CY = 100;
const OUTER_R = 70;
const INNER_R = 42;
const LEADER_BEND_R = 78;
const MIN_LABEL_FRACTION = 0.03;

export function DonutChart({ title, data, emptyLabel }: DonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  let cursor = 0;
  const sliceNodes: ReactElement[] = [];
  const annotationNodes: ReactElement[] = [];

  data.forEach((slice) => {
    if (slice.value <= 0 || total <= 0) return;
    const fraction = slice.value / total;
    const startFrac = cursor;
    cursor += fraction;
    const endFrac = cursor;

    if (fraction >= 0.999) {
      sliceNodes.push(
        <g key={`slice-${slice.label}`}>
          <circle cx={CX} cy={CY} r={OUTER_R} fill={slice.color} />
          <circle cx={CX} cy={CY} r={INNER_R} fill="var(--panel-strong)" />
        </g>
      );
    } else {
      sliceNodes.push(
        <path
          key={`slice-${slice.label}`}
          d={buildAnnularPath({
            cx: CX,
            cy: CY,
            rOuter: OUTER_R,
            rInner: INNER_R,
            startFrac,
            endFrac
          })}
          fill={slice.color}
        />
      );
    }

    if (fraction < MIN_LABEL_FRACTION) return;

    const pct = Math.round(fraction * 100);
    const bend = sliceMidpoint(CX, CY, LEADER_BEND_R, startFrac, endFrac);
    const outer = sliceMidpoint(CX, CY, OUTER_R, startFrac, endFrac);
    const isRight = Math.sin(bend.angleRad) >= 0;
    const labelX = isRight ? bend.x + 8 : bend.x - 8;
    const textAnchor = isRight ? "start" : "end";

    annotationNodes.push(
      <g key={`anno-${slice.label}`} className="donut-annotation">
        <polyline
          points={`${outer.x},${outer.y} ${bend.x},${bend.y} ${labelX},${bend.y}`}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={0.8}
        />
        <text
          x={labelX + (isRight ? 2 : -2)}
          y={bend.y}
          textAnchor={textAnchor}
          dominantBaseline="central"
          className="donut-slice-label"
        >
          {`${slice.label} ${pct}%`}
        </text>
      </g>
    );
  });

  return (
    <section className="donut-card" aria-label={title}>
      <h2 className="donut-title">{title}</h2>
      <div className="donut-body">
        <div className="donut-chart-wrap">
          {total > 0 ? (
            <svg
              className="donut-svg"
              viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
              role="img"
              aria-hidden="true"
            >
              {sliceNodes}
              {annotationNodes}
              <text
                x={CX}
                y={CY}
                textAnchor="middle"
                dominantBaseline="central"
                className="donut-center"
              >
                {total}
              </text>
            </svg>
          ) : (
            <div className="donut-empty">{emptyLabel}</div>
          )}
        </div>
        <DonutLegend data={data} total={total} />
      </div>
    </section>
  );
}
