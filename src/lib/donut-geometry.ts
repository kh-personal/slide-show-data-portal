export type AnnularPathInput = {
  cx: number;
  cy: number;
  rOuter: number;
  rInner: number;
  startFrac: number;
  endFrac: number;
};

export function buildAnnularPath({ cx, cy, rOuter, rInner, startFrac, endFrac }: AnnularPathInput): string {
  const startAngle = startFrac * 2 * Math.PI;
  const endAngle = endFrac * 2 * Math.PI;
  const largeArc = endFrac - startFrac > 0.5 ? 1 : 0;

  const x1o = cx + rOuter * Math.sin(startAngle);
  const y1o = cy - rOuter * Math.cos(startAngle);
  const x2o = cx + rOuter * Math.sin(endAngle);
  const y2o = cy - rOuter * Math.cos(endAngle);
  const x1i = cx + rInner * Math.sin(startAngle);
  const y1i = cy - rInner * Math.cos(startAngle);
  const x2i = cx + rInner * Math.sin(endAngle);
  const y2i = cy - rInner * Math.cos(endAngle);

  return [
    `M ${x1o} ${y1o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x1i} ${y1i}`,
    "Z"
  ].join(" ");
}

export type SliceMidpoint = { x: number; y: number; angleRad: number };

export function sliceMidpoint(
  cx: number,
  cy: number,
  radius: number,
  startFrac: number,
  endFrac: number
): SliceMidpoint {
  const angleRad = ((startFrac + endFrac) / 2) * 2 * Math.PI;
  return {
    x: cx + radius * Math.sin(angleRad),
    y: cy - radius * Math.cos(angleRad),
    angleRad
  };
}
