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

const VIEW_X = -160;
const VIEW_Y = -60;
const VIEW_W = 510;
const VIEW_H = 320;
const CX = 100;
const CY = 100;
const OUTER_R = 140;
const INNER_R = 84;
const LABEL_OFFSET = 14;
const MIN_LABEL_FRACTION = 0.03;
const LABEL_MIN_GAP = 24;
const LABEL_MIN_Y = -35;
const LABEL_MAX_Y = 235;

type Annotation = {
  key: string;
  label: string;
  pct: number;
  outerX: number;
  outerY: number;
  naturalX: number;
  naturalY: number;
  side: "left" | "right";
};

export function DonutChart({ title, data, emptyLabel }: DonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  let cursor = 0;
  const sliceNodes: ReactElement[] = [];
  const annotations: Annotation[] = [];

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
    const outer = sliceMidpoint(CX, CY, OUTER_R, startFrac, endFrac);
    const isRight = Math.sin(outer.angleRad) >= 0;
    const naturalX = outer.x + (isRight ? LABEL_OFFSET : -LABEL_OFFSET);
    const naturalY = outer.y;
    annotations.push({
      key: `anno-${slice.label}`,
      label: slice.label,
      pct,
      outerX: outer.x,
      outerY: outer.y,
      naturalX,
      naturalY,
      side: isRight ? "right" : "left"
    });
  });

  const annotationNodes = arrangeAnnotations(annotations).map((annotation) => (
    <g key={annotation.key} className="donut-annotation">
      {annotation.displaced ? (
        <polyline
          points={`${annotation.outerX},${annotation.outerY} ${annotation.labelX},${annotation.labelY}`}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={0.8}
        />
      ) : null}
      <text
        x={annotation.labelX}
        y={annotation.labelY}
        textAnchor={annotation.side === "right" ? "start" : "end"}
        dominantBaseline="central"
        className="donut-slice-label"
      >
        {`${annotation.label} ${annotation.pct}%`}
      </text>
    </g>
  ));

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

function arrangeAnnotations(annotations: Annotation[]): Array<Annotation & { labelX: number; labelY: number; displaced: boolean }> {
  return (["left", "right"] as const).flatMap((side) => {
    const sideAnnotations = annotations
      .filter((annotation) => annotation.side === side)
      .sort((a, b) => a.naturalY - b.naturalY);
    if (!sideAnnotations.length) return [];
    let lastY = -Infinity;
    return sideAnnotations.map((annotation) => {
      const minY = Math.max(LABEL_MIN_Y, lastY + LABEL_MIN_GAP);
      const labelY = Math.min(LABEL_MAX_Y, Math.max(annotation.naturalY, minY));
      const displaced = Math.abs(labelY - annotation.naturalY) > 0.5;
      lastY = labelY;
      return {
        ...annotation,
        labelX: annotation.naturalX,
        labelY,
        displaced
      };
    });
  });
}
