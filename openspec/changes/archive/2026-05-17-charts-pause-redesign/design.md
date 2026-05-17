# Design Notes

## Data model
```ts
export type FlatStatus = "Not Reg" | "Reg" | "Visiting" | "Completed";
export interface MovementRecord {
  houseName: string;
  floor: number;
  unit: number;
  entryTime: string;
  exitTime: string;
  paxCount: number;
  luggageCount: number;
  casStaffCount: number;
  casStaffNo: string;            // NEW free-text id(s)
  medicalNecessity: string;
  flatStatus: FlatStatus;        // NEW (derived if no override)
}
```

`deriveFlatStatus(entryTime, exitTime, override?)`:
- override (trimmed) wins when it matches a known value.
- Else: both times present ⇒ `Completed`; entryTime only ⇒ `Visiting`; exitTime only ⇒ `Reg` (rare/edge); neither ⇒ `Not Reg`.

## Distribution helpers
- Duration buckets: `[0,30],(30,60],(60,90],(90,120],(120,150],(150,180],(180,∞)`.
- `getDurationDistribution(records, now)` — records with entryTime; minutes = (exitTime ?? now) - entryTime.
- `getCsaInFlatDurationDistribution(records, now)` — entryTime only & no exitTime; sums `casStaffCount` per bucket using `now - entryTime`.
- `getCsaStaffCountDistribution(records)` — flats with entryTime; counts records grouped by their `casStaffCount` value.
- Times parsed as `HH:mm` (24h); when format invalid the record is skipped from time-based charts.

## Pie chart component
Inline SVG, viewBox 0 0 200 200, slices via `<path>` arc commands. Legend chips below. Rounded outer container (border-radius 1rem, shadow). Accepts `data: {label, value, color}[]`, `title`, `emptyLabel`.

## Slideshow control
`useSlideshow(slideCount, intervalMs)` returns `{activeIndex, paused, pause, resume, next, prev, goTo}`. Interval cleared while paused; on resume, fresh interval starts.

## I18n additions
Keys (subset): `floorLabel(n)`, `unitLabel(n)`, `houseNameLabel(name)`, `chartFlatStatus`, `chartDurationDistribution`, `chartCsaInFlatDuration`, `chartCsaStaffCount`, `statusNotReg/Reg/Visiting/Completed`, `pause`, `play`, `previousSlide`, `nextSlide`, `bucket0_30`, ..., `bucket180Plus`.
House translation map in `src/lib/i18n.ts`:
```
Wang Yan → 宏仁閣, Wang Do → 宏道閣, Wang San → 宏新閣, Wang Kin → 宏建閣,
Wang Tai → 宏泰閣, Wang Cheong → 宏昌閣, Wang Shing → 宏盛閣, Wang Chi → 宏志閣
```

## Visual redesign
- Dark: deep slate base `#0b1220`, accent indigo→cyan gradient `#6366f1 → #22d3ee`, success `#34d399`, warning `#fbbf24`, danger `#f87171`.
- Light: warm off-white `#f7f6f1`, accent indigo `#4f46e5`, neutral text `#1e293b`.
- Cards: rounded 14px, soft shadow, subtle border. Charts share card style.
- Headers larger weight; numbers tabular-nums.
