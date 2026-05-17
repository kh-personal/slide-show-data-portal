# House Controls Theme I18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the kiosk portal to filter by House Name, display CAS staff and medical necessity, move unit labels into headers, and add light/dark plus English/Traditional Chinese controls.

**Architecture:** Keep the current Next.js App Router, TanStack Query polling, and three-slide kiosk shell. Extend the typed movement model and parser, add small presentation helpers for house selection/theme/language state, and keep grid, summary, and styling changes localized to existing components.

**Tech Stack:** Next.js 16, React 19, TypeScript, TanStack Query, Vitest, Playwright, CSS variables.

---

## File Structure

- Modify `src/lib/models.ts`: replace `block` terminology with `houseName`, add `casStaffCount`, `medicalNecessity`, medical/luggage tone types, and language/theme types.
- Modify `src/lib/csv.ts`: normalize `House Name`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`.
- Modify `src/lib/movements.ts`: filter by house name, derive house options, compute medical and luggage display state.
- Modify `src/lib/sample-data.ts`: add multiple house names, CAS staff counts, and medical necessity examples.
- Create `src/lib/i18n.ts`: typed English and Traditional Chinese labels.
- Modify `src/components/kiosk-portal.tsx`: manage selected house, theme, language, and pass labels to slides.
- Modify `src/components/floor-grid.tsx`: render unit header row, remove repeated cell unit labels, show CAS staff and medical/luggage indicators.
- Modify `src/components/summary-slide.tsx`: use translated labels and selected house name.
- Modify `app/globals.css`: add light palette, control bar, unit header, medical red cell, and luggage indicator styles.
- Modify `tests/unit/movements.test.ts`: cover new parser/model/filtering/tones.
- Modify `tests/e2e/portal.spec.ts`: cover dropdown, headers, medical indicator, theme, and language switching.
- Modify `README.md`: document the three new Google Sheet columns.
- Modify `openspec/changes/house-controls-theme-i18n/*`: fill proposal, design, delta specs, and tasks to match this work.

---

### Task 1: Data Model and Unit Tests

**Files:**
- Modify: `src/lib/models.ts`
- Modify: `src/lib/movements.ts`
- Modify: `tests/unit/movements.test.ts`

- [ ] **Step 1: Write failing tests for house filtering and medical/luggage state**

Add these imports and tests to `tests/unit/movements.test.ts`:

```ts
import { getHouseNames, getRoomTone } from "@/src/lib/movements";

it("derives stable house names from movement records", () => {
  expect(getHouseNames([
    { id: "a", houseName: "Wang Yan House", floor: 1, unit: 1, entryTime: "08:00", exitTime: "09:00", paxCount: 1, luggageCount: 1, casStaffCount: 2, medicalNecessity: "" },
    { id: "b", houseName: "Wang Tai House", floor: 1, unit: 2, entryTime: "08:10", exitTime: "09:10", paxCount: 1, luggageCount: 7, casStaffCount: 1, medicalNecessity: "Wheelchair" },
    { id: "c", houseName: "Wang Yan House", floor: 2, unit: 1, entryTime: "08:20", exitTime: "09:20", paxCount: 1, luggageCount: 5, casStaffCount: 0, medicalNecessity: "" }
  ])).toEqual(["Wang Yan House", "Wang Tai House"]);
});

it("prioritizes medical cell tone while preserving luggage indicator tone", () => {
  expect(getRoomTone({ luggageCount: 7, medicalNecessity: "Oxygen" })).toEqual({
    cellTone: "medical",
    luggageTone: "purple"
  });
  expect(getRoomTone({ luggageCount: 5, medicalNecessity: "" })).toEqual({
    cellTone: "green",
    luggageTone: "green"
  });
});
```

- [ ] **Step 2: Run unit tests to verify failure**

Run: `npm test -- tests/unit/movements.test.ts`

Expected: FAIL because `getHouseNames`, `getRoomTone`, `houseName`, `casStaffCount`, and `medicalNecessity` are not implemented.

- [ ] **Step 3: Implement model and movement helpers**

Update `src/lib/models.ts` to use this shape:

```ts
export const DEFAULT_HOUSE_NAME = "Wang Yan House";
export const UNITS_PER_FLOOR = 8;

export type MovementRecord = {
  id: string;
  houseName: string;
  floor: number;
  unit: number;
  entryTime: string;
  exitTime: string;
  paxCount: number;
  luggageCount: number;
  casStaffCount: number;
  medicalNecessity: string;
};

export type UnitCell = {
  floor: number;
  unit: number;
  unitLabel: string;
  record?: MovementRecord;
};

export type FloorRow = {
  floor: number;
  units: UnitCell[];
};

export type SummaryMetrics = {
  totalEntries: number;
  totalPax: number;
  totalLuggage: number;
  excessiveLuggageWarnings: number;
  moderateLuggageWarnings: number;
};

export type LuggageTone = "default" | "green" | "purple";
export type CellTone = LuggageTone | "medical";
export type ThemeMode = "dark" | "light";
export type Language = "en" | "zh-Hant";
```

Update `src/lib/movements.ts` imports and add helpers:

```ts
import { DEFAULT_HOUSE_NAME, UNITS_PER_FLOOR, type CellTone, type FloorRow, type LuggageTone, type MovementRecord, type SummaryMetrics } from "./models";

export function getLuggageTone(luggageCount: number): LuggageTone {
  if (luggageCount > 6) return "purple";
  if (luggageCount > 4) return "green";
  return "default";
}

export function getRoomTone(record: Pick<MovementRecord, "luggageCount" | "medicalNecessity"> | undefined): { cellTone: CellTone; luggageTone: LuggageTone } {
  const luggageTone = getLuggageTone(record?.luggageCount ?? 0);
  return {
    cellTone: record?.medicalNecessity.trim() ? "medical" : luggageTone,
    luggageTone
  };
}

export function getHouseNames(records: MovementRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.houseName).filter(Boolean)));
}

export function buildFloorRows(records: MovementRecord[], floorStart: number, floorEnd: number, houseName = DEFAULT_HOUSE_NAME): FloorRow[] {
  const recordMap = new Map(
    records
      .filter((record) => record.houseName === houseName)
      .map((record) => [`${record.floor}-${record.unit}`, record])
  );

  return range(floorStart, floorEnd).map((floor) => ({
    floor,
    units: range(1, UNITS_PER_FLOOR).map((unit) => ({
      floor,
      unit,
      unitLabel: unit.toString().padStart(2, "0"),
      record: recordMap.get(`${floor}-${unit}`)
    }))
  }));
}

export function summarizeMovementRecords(records: MovementRecord[], houseName = DEFAULT_HOUSE_NAME): SummaryMetrics {
  const houseRecords = records.filter((record) => record.houseName === houseName);
  return {
    totalEntries: houseRecords.filter((record) => record.entryTime).length,
    totalPax: houseRecords.reduce((total, record) => total + record.paxCount, 0),
    totalLuggage: houseRecords.reduce((total, record) => total + record.luggageCount, 0),
    excessiveLuggageWarnings: houseRecords.filter((record) => record.luggageCount > 6).length,
    moderateLuggageWarnings: houseRecords.filter((record) => record.luggageCount > 4 && record.luggageCount <= 6).length
  };
}
```

- [ ] **Step 4: Update existing unit tests for renamed fields**

Replace expected `block` properties with `houseName`, replace `DEFAULT_BLOCK` with `DEFAULT_HOUSE_NAME`, and include `casStaffCount` plus `medicalNecessity` in expected records.

- [ ] **Step 5: Run focused unit tests**

Run: `npm test -- tests/unit/movements.test.ts`

Expected: Tests still fail only where CSV/sample data have not been updated.

---

### Task 2: CSV Normalization and Sample Data

**Files:**
- Modify: `src/lib/csv.ts`
- Modify: `src/lib/sample-data.ts`
- Modify: `tests/unit/movements.test.ts`

- [ ] **Step 1: Write failing CSV normalization test**

Replace the first normalization test CSV with:

```ts
const rows = parseCsv("House Name,Floor,Unit,Entry Time,Exit Time,Pax Count,Luggage Count,Staff Nos of 民安隊 staff,Medical Necessity\nWang Tai House,2,08,08:30,09:15,3,7,4,Wheelchair");
```

Expect the normalized record to include:

```ts
{
  id: "Wang Tai House-2-8-0",
  houseName: "Wang Tai House",
  floor: 2,
  unit: 8,
  entryTime: "08:30",
  exitTime: "09:15",
  paxCount: 3,
  luggageCount: 7,
  casStaffCount: 4,
  medicalNecessity: "Wheelchair"
}
```

- [ ] **Step 2: Run focused unit tests to verify failure**

Run: `npm test -- tests/unit/movements.test.ts`

Expected: FAIL because the parser still reads `block` and does not emit new fields.

- [ ] **Step 3: Implement CSV aliases**

Update `src/lib/csv.ts` aliases:

```ts
const aliases = {
  houseName: ["housename"],
  floor: ["floor"],
  unit: ["unit"],
  entryTime: ["entrytime", "entry"],
  exitTime: ["exittime", "exit"],
  paxCount: ["paxcount", "pax", "peoplecount"],
  luggageCount: ["luggagecount", "luggage", "bagcount"],
  casStaffCount: ["staffnosof民安隊staff", "casstaffcount", "casstaff", "staffcount"],
  medicalNecessity: ["medicalnecessity", "medical"]
} as const;
```

Update `normalizeMovementRow` return object:

```ts
const houseName = readField(row, aliases.houseName) || DEFAULT_HOUSE_NAME;

return {
  id: `${houseName}-${floor}-${unit}-${index}`,
  houseName,
  floor,
  unit,
  entryTime: readField(row, aliases.entryTime),
  exitTime: readField(row, aliases.exitTime),
  paxCount: toNumber(readField(row, aliases.paxCount)),
  luggageCount: toNumber(readField(row, aliases.luggageCount)),
  casStaffCount: toNumber(readField(row, aliases.casStaffCount)),
  medicalNecessity: readField(row, aliases.medicalNecessity)
};
```

- [ ] **Step 4: Update sample data**

Update `src/lib/sample-data.ts` so `record` accepts `houseName`, `casStaffCount`, and `medicalNecessity`, with at least one medical red room and at least two houses:

```ts
record(DEFAULT_HOUSE_NAME, 1, 1, "08:10", "09:05", 2, 3, 1, ""),
record(DEFAULT_HOUSE_NAME, 1, 2, "08:15", "09:20", 3, 5, 2, ""),
record(DEFAULT_HOUSE_NAME, 2, 8, "08:22", "09:35", 1, 7, 3, "Wheelchair"),
record("Wang Tai House", 1, 1, "08:05", "09:00", 4, 6, 2, ""),
record("Wang Tai House", 17, 3, "09:15", "10:25", 2, 8, 4, "Oxygen")
```

- [ ] **Step 5: Run focused unit tests**

Run: `npm test -- tests/unit/movements.test.ts`

Expected: PASS.

---

### Task 3: Translation Dictionary

**Files:**
- Create: `src/lib/i18n.ts`
- Modify: `tests/unit/movements.test.ts`

- [ ] **Step 1: Write failing translation test**

Add:

```ts
import { translations } from "@/src/lib/i18n";

it("provides English and Traditional Chinese kiosk labels", () => {
  expect(translations.en.houseName).toBe("House Name");
  expect(translations["zh-Hant"].houseName).toBe("樓宇名稱");
  expect(translations["zh-Hant"].medicalNecessity).toBe("醫療需要");
});
```

- [ ] **Step 2: Run focused unit tests**

Run: `npm test -- tests/unit/movements.test.ts`

Expected: FAIL because `src/lib/i18n.ts` does not exist.

- [ ] **Step 3: Create translation dictionary**

Create `src/lib/i18n.ts`:

```ts
import type { Language } from "./models";

export type TranslationKey =
  | "houseName"
  | "theme"
  | "dark"
  | "light"
  | "language"
  | "english"
  | "traditionalChinese"
  | "floorsOneToSixteen"
  | "floorsSeventeenToThirtyOne"
  | "slideOne"
  | "slideTwo"
  | "slideThree"
  | "livePolling"
  | "entry"
  | "exit"
  | "pax"
  | "casStaff"
  | "medicalNecessity"
  | "buildingSummary"
  | "realTimeStats"
  | "totalEntriesToday"
  | "totalPax"
  | "totalLuggage"
  | "excessiveLuggage"
  | "moderateLuggage"
  | "luggageLegend"
  | "dataSourceUnavailable"
  | "unableToLoad";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    houseName: "House Name",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    language: "Language",
    english: "English",
    traditionalChinese: "繁體中文",
    floorsOneToSixteen: "Floors 1-16",
    floorsSeventeenToThirtyOne: "Floors 17-31",
    slideOne: "Slide 1",
    slideTwo: "Slide 2",
    slideThree: "Slide 3",
    livePolling: "Live Google Sheets polling every 60s",
    entry: "Entry",
    exit: "Exit",
    pax: "Pax",
    casStaff: "CAS staff",
    medicalNecessity: "Medical Necessity",
    buildingSummary: "Building Summary",
    realTimeStats: "Real-time movement statistics",
    totalEntriesToday: "Total entries today",
    totalPax: "Total pax",
    totalLuggage: "Total luggage",
    excessiveLuggage: "Excessive luggage",
    moderateLuggage: "Moderate luggage",
    luggageLegend: "Purple indicates more than 6 luggage items. Green indicates more than 4 luggage items.",
    dataSourceUnavailable: "Data source unavailable",
    unableToLoad: "Unable to load movement data"
  },
  "zh-Hant": {
    houseName: "樓宇名稱",
    theme: "主題",
    dark: "深色",
    light: "淺色",
    language: "語言",
    english: "English",
    traditionalChinese: "繁體中文",
    floorsOneToSixteen: "1至16樓",
    floorsSeventeenToThirtyOne: "17至31樓",
    slideOne: "第1頁",
    slideTwo: "第2頁",
    slideThree: "第3頁",
    livePolling: "每60秒從 Google Sheets 更新",
    entry: "進入",
    exit: "離開",
    pax: "人數",
    casStaff: "民安隊人數",
    medicalNecessity: "醫療需要",
    buildingSummary: "樓宇總覽",
    realTimeStats: "即時出入統計",
    totalEntriesToday: "今日進入總數",
    totalPax: "總人數",
    totalLuggage: "總行李數",
    excessiveLuggage: "嚴重行李提示",
    moderateLuggage: "中度行李提示",
    luggageLegend: "紫色代表行李超過6件。綠色代表行李超過4件。",
    dataSourceUnavailable: "資料來源未能使用",
    unableToLoad: "未能載入出入資料"
  }
};
```

- [ ] **Step 4: Run focused unit tests**

Run: `npm test -- tests/unit/movements.test.ts`

Expected: PASS.

---

### Task 4: Kiosk Controls and Component Wiring

**Files:**
- Modify: `src/components/kiosk-portal.tsx`
- Modify: `src/components/floor-grid.tsx`
- Modify: `src/components/summary-slide.tsx`

- [ ] **Step 1: Write failing E2E test for controls**

Add to `tests/e2e/portal.spec.ts`:

```ts
test("filters by house name and switches theme and language", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("House Name").selectOption("Wang Tai House");
  await expect(page.getByText("Slide 1 / Wang Tai House")).toBeVisible();
  await expect(page.getByText("Entry 08:05")).toBeVisible();

  await page.getByRole("button", { name: "Light" }).click();
  await expect(page.locator(".kiosk-shell")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "繁體中文" }).click();
  await expect(page.getByLabel("樓宇名稱")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();
});
```

- [ ] **Step 2: Run E2E test to verify failure**

Run: `npm run test:e2e -- tests/e2e/portal.spec.ts`

Expected: FAIL because the controls do not exist.

- [ ] **Step 3: Wire kiosk state and controls**

Update `src/components/kiosk-portal.tsx` to:

```tsx
const [selectedHouseName, setSelectedHouseName] = useState(DEFAULT_HOUSE_NAME);
const [theme, setTheme] = useState<ThemeMode>("dark");
const [language, setLanguage] = useState<Language>("en");
const labels = translations[language];
const houseNames = useMemo(() => getHouseNames(records), [records]);
const activeHouseName = houseNames.includes(selectedHouseName) ? selectedHouseName : houseNames[0] ?? DEFAULT_HOUSE_NAME;
```

Render a `.control-bar` above `.slide-track` with a labeled select and two buttons:

```tsx
<div className="control-bar">
  <label>
    <span>{labels.houseName}</span>
    <select aria-label={labels.houseName} value={activeHouseName} onChange={(event) => setSelectedHouseName(event.target.value)}>
      {houseNames.map((houseName) => <option key={houseName} value={houseName}>{houseName}</option>)}
    </select>
  </label>
  <button type="button" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>
    {theme === "dark" ? labels.light : labels.dark}
  </button>
  <button type="button" onClick={() => setLanguage((current) => current === "en" ? "zh-Hant" : "en")}>
    {language === "en" ? labels.traditionalChinese : labels.english}
  </button>
</div>
```

Set `<main className="kiosk-shell" data-theme={theme}>` and pass `labels` plus `activeHouseName` to slides.

- [ ] **Step 4: Update slide components to accept labels**

Change `FloorGrid` props to include `houseName` and `labels: Record<TranslationKey, string>`. Replace hard-coded text with `labels`. Change `SummarySlide` props similarly.

- [ ] **Step 5: Run E2E control test**

Run: `npm run test:e2e -- tests/e2e/portal.spec.ts`

Expected: Failing only for grid/header styling still not implemented.

---

### Task 5: Grid Header, Medical Cell, and Styling

**Files:**
- Modify: `src/components/floor-grid.tsx`
- Modify: `app/globals.css`
- Modify: `tests/e2e/portal.spec.ts`

- [ ] **Step 1: Write failing grid E2E assertions**

Update the first E2E test so it expects unit labels in headers and not inside room cells:

```ts
await expect(page.locator(".unit-header", { hasText: "Unit 01" })).toBeVisible();
await expect(page.locator(".unit-square .unit-id")).toHaveCount(0);
await expect(page.getByText("CAS staff 1")).toBeVisible();
await expect(page.locator(".unit-square.warning-medical").first()).toBeVisible();
await expect(page.locator(".unit-square.warning-medical .luggage-indicator.indicator-purple").first()).toBeVisible();
```

- [ ] **Step 2: Run E2E test to verify failure**

Run: `npm run test:e2e -- tests/e2e/portal.spec.ts`

Expected: FAIL because the grid still repeats unit labels and has no medical indicator.

- [ ] **Step 3: Update `FloorGrid` rendering**

Add one `.unit-header-row` before floor rows:

```tsx
<div className="unit-header-row" aria-hidden="true">
  <div className="floor-label" />
  {Array.from({ length: 8 }, (_, index) => (
    <div className="unit-header" key={index}>Unit {(index + 1).toString().padStart(2, "0")}</div>
  ))}
</div>
```

For each cell, use:

```tsx
const { cellTone, luggageTone } = getRoomTone(cell.record);
<div className={`unit-square warning-${cellTone}`} key={`${row.floor}-${cell.unit}`}>
  <div className="unit-details">
    <span>{labels.entry} {cell.record?.entryTime || "--:--"}</span>
    <span>{labels.exit} {cell.record?.exitTime || "--:--"}</span>
    <span>{labels.pax} {cell.record?.paxCount ?? 0}</span>
    <span>{labels.casStaff} {cell.record?.casStaffCount ?? 0}</span>
  </div>
  {luggageTone !== "default" ? <span className={`luggage-indicator indicator-${luggageTone}`} aria-label={`${luggageTone} luggage warning`} /> : null}
</div>
```

- [ ] **Step 4: Add CSS for themes, controls, headers, and indicators**

Update `app/globals.css` with light theme variables and classes:

```css
.kiosk-shell[data-theme="light"] {
  --bg: #f7fbff;
  --panel: #ffffff;
  --panel-strong: #e8f2ff;
  --border: rgba(20, 40, 70, 0.18);
  --text: #102138;
  --muted: #52667f;
  background:
    radial-gradient(circle at 20% 10%, rgba(120, 180, 255, 0.35), transparent 32%),
    linear-gradient(135deg, #dbeafe, #f7fbff 58%, #eef6ff);
}

.control-bar {
  position: absolute;
  z-index: 2;
  top: clamp(8px, 1vw, 16px);
  right: clamp(8px, 1vw, 16px);
  display: flex;
  gap: 8px;
  align-items: center;
}

.unit-header-row {
  display: grid;
  grid-template-columns: minmax(42px, 0.42fr) repeat(8, minmax(0, 1fr));
  gap: 4px;
}

.unit-header {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  color: var(--muted);
  text-align: center;
  font-size: clamp(9px, 0.8vw, 13px);
  font-weight: 800;
}

.unit-square.warning-medical {
  position: relative;
  background: linear-gradient(135deg, #c82f2f, #7f1616);
}

.luggage-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: clamp(8px, 0.8vw, 14px);
  height: clamp(8px, 0.8vw, 14px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 3px;
}

.indicator-green { background: var(--green); }
.indicator-purple { background: var(--purple); }
```

Make `.kiosk-stage` `position: relative`.

- [ ] **Step 5: Run E2E tests**

Run: `npm run test:e2e -- tests/e2e/portal.spec.ts`

Expected: PASS.

---

### Task 6: Documentation and OpenSpec Artifacts

**Files:**
- Modify: `README.md`
- Modify: `openspec/changes/house-controls-theme-i18n/proposal.md`
- Modify: `openspec/changes/house-controls-theme-i18n/design.md`
- Create/Modify: `openspec/changes/house-controls-theme-i18n/specs/sheet-data-ingestion/spec.md`
- Create/Modify: `openspec/changes/house-controls-theme-i18n/specs/floor-grid-display/spec.md`
- Create/Modify: `openspec/changes/house-controls-theme-i18n/specs/kiosk-runtime/spec.md`
- Modify: `openspec/changes/house-controls-theme-i18n/tasks.md`

- [ ] **Step 1: Update README sheet columns**

Add a table under "Configure local data" documenting columns:

```md
Expected Google Sheet CSV columns include `House Name`, `Floor`, `Unit`, `Entry Time`, `Exit Time`, `Pax Count`, `Luggage Count`, `Staff Nos of 民安隊 staff`, and `Medical Necessity`.
```

- [ ] **Step 2: Fill OpenSpec proposal/design/tasks**

Use the approved design in `docs/superpowers/specs/2026-05-17-house-controls-theme-i18n-design.md`. Add tasks matching this plan and mark them complete only after implementation and tests pass.

- [ ] **Step 3: Add delta specs**

Add delta requirements for sheet ingestion, floor grid display, and kiosk runtime:

```md
## MODIFIED Requirements

### Requirement: Normalize sheet rows
The system SHALL normalize each sheet row into a movement record with house name, floor, unit, entry time, exit time, pax count, luggage count, CAS staff count, and medical necessity fields.
```

```md
## MODIFIED Requirements

### Requirement: Render unit square contents
The system SHALL render Unit 01 through Unit 08 as column headers and SHALL display entry time, exit time, pax count, and CAS staff count inside each room cell.
```

```md
## ADDED Requirements

### Requirement: Switch display preferences
The system SHALL provide controls to switch selected house name, dark/light theme, and English/Traditional Chinese language.
```

- [ ] **Step 4: Validate OpenSpec status**

Run: `openspec status --change "house-controls-theme-i18n" --json`

Expected: all artifacts show `done`.

---

### Task 7: Full Verification

**Files:**
- No new source files; validate all touched files.

- [ ] **Step 1: Run unit tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run E2E tests**

Run: `npm run test:e2e`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Mark OpenSpec tasks complete**

Update `openspec/changes/house-controls-theme-i18n/tasks.md` so all completed implementation and validation tasks use `- [x]`.

---

## Self-Review

Spec coverage:

- Expanded Google Sheet columns are covered by Tasks 1, 2, and 6.
- House Name dropdown/filtering is covered by Tasks 1 and 4.
- CAS staff display is covered by Tasks 1, 2, and 5.
- Medical red cells plus luggage indicator are covered by Tasks 1 and 5.
- Unit headers and removing repeated cell labels are covered by Task 5.
- Dark/light theme and Traditional Chinese language switching are covered by Tasks 3, 4, and 5.
- Unit and E2E tests are covered by Tasks 1-5 and Task 7.

Placeholder scan: no TBD/TODO/fill-later instructions remain.

Type consistency: the canonical field is `houseName`; `block` and `DEFAULT_BLOCK` are replaced by `houseName` and `DEFAULT_HOUSE_NAME`.
