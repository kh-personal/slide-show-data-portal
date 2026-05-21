import { expect, test } from "@playwright/test";

const CSV_ROUTE = "**/spreadsheets/d/example/pub**";
const MOVEMENTS_CSV = `House Name,Floor,Unit,Entry Date,AM/PM,Entry Time,Exit Time,Pax Count,Luggage Count,Staff Count,Staff Nos of 民安隊 staff,Medical Necessity
Wang Yan House,1,1,05/20/2026,AM,08:10,09:05,2,3,1,CAS-1101,
Wang Yan House,1,2,05/20/2026,AM,08:15,09:20,3,5,2,CAS-1102,
Wang Yan House,2,8,05/20/2026,AM,08:22,09:35,1,7,3,CAS-1201,Wheelchair
Wang Yan House,8,4,05/20/2026,AM,08:40,10:00,4,2,0,,
Wang Yan House,16,6,05/20/2026,AM,09:00,,2,6,4,CAS-1601,
Wang Yan House,17,1,05/20/2026,AM,09:10,,1,4,2,CAS-1701,
Wang Yan House,24,5,05/20/2026,AM,09:25,,3,8,5,CAS-2401,
Wang Yan House,31,8,05/20/2026,AM,,,6,0,0,,
Wang Yan House,10,8,05/21/2026,PM,,,5,0,0,,
Wang Tai House,1,1,05/20/2026,PM,08:05,09:00,4,6,2,CAS-2001,
Wang Tai House,17,3,05/20/2026,PM,09:15,,2,8,4,CAS-2002,Oxygen,
Wang Do House,1,1,05/21/2026,AM,,,5,1,0,,`;

test.beforeEach(async ({ page }) => {
  await page.route(CSV_ROUTE, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/csv",
      body: MOVEMENTS_CSV
    });
  });
});

test("shows the first floor-grid slide with unit movement data and CAS staff no (default zh-Hant)", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  // Make sure we're on slide 1 (default language is Traditional Chinese)
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  await expect(page.getByText("第1頁 / 宏仁閣")).toBeVisible();
  await expect(page.locator(".unit-header", { hasText: "01室" }).first()).toBeVisible();
  await expect(page.locator(".unit-square .unit-id")).toHaveCount(0);

  // Wait for movement data to load and session filters to populate.
  await expect(page.getByLabel("進入日期")).toHaveValue("05/20/2026");
  await expect(page.getByLabel("上午/下午")).toHaveValue("AM");
  const houseSelect = page.getByLabel("樓宇名稱");
  await expect(houseSelect.locator("option", { hasText: "宏泰閣" })).toHaveCount(0);

  await expect(page.getByText("進入 08:10")).toBeVisible();
  await expect(page.locator(".unit-details", { hasText: "民安隊編號 CAS-1101" }).first()).toBeVisible();
  await expect(page.locator(".unit-square.warning-medical")).toHaveCount(0);
  await expect(page.locator(".unit-square .medical-cross-icon").first()).toBeVisible();
  await expect(page.locator(".unit-square .session-bookmark").first()).toBeVisible();
  await expect(page.locator(".unit-square.warning-purple")).toHaveCount(0);
});

test("requests configured CSV with a cache-busting query parameter", async ({ page }) => {
  const csvRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/spreadsheets/d/example/pub")) {
      csvRequests.push(request.url());
    }
  });

  await page.goto("/slide-show-data-portal/");
  await expect(page.getByText("進入 08:10")).toBeVisible();

  expect(csvRequests.length).toBeGreaterThan(0);
  const csvUrl = new URL(csvRequests[0]);
  expect(csvUrl.searchParams.get("gid")).toBe("0");
  expect(csvUrl.searchParams.get("output")).toBe("csv");
  expect(csvUrl.searchParams.get("_cacheBust")).toBeTruthy();
});

test("portal opens with light theme and Traditional Chinese by default", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  // Default theme is light
  await expect(page.locator(".kiosk-shell")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "深色" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "淺色" })).toHaveCount(0);
  // Default language is Traditional Chinese
  await expect(page.getByLabel("樓宇名稱")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();
});

test("wires house and language controls", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  await page.getByLabel("上午/下午").selectOption("PM");
  const houseSelect = page.getByLabel("樓宇名稱");
  await expect(houseSelect.locator("option", { hasText: "宏泰閣" })).toHaveCount(1);
  await expect(houseSelect.locator("option", { hasText: "宏仁閣" })).toHaveCount(0);
  await houseSelect.selectOption("Wang Tai House");
  await expect(page.getByText("第1頁 / 宏泰閣")).toBeVisible();
  await expect(page.getByText("進入 08:05")).toBeVisible();

  await expect(page.locator(".kiosk-shell")).toHaveAttribute("data-theme", "light");

  // Switch to English
  await page.getByRole("button", { name: "English" }).click();
  await expect(page.getByLabel("House Name")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Floors 1-10" })).toBeVisible();
  await expect(page.locator(".floor-label", { hasText: "1/F" }).first()).toBeVisible();
  await expect(page.locator(".unit-header", { hasText: "Unit 01" }).first()).toBeVisible();
  await expect(page.locator(".eyebrow", { hasText: "Wang Tai House" }).first()).toBeVisible();
});

test("pause stops auto-advance and prev/next navigate manually", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  const prevBtn = page.locator("button.control-nav[aria-label='上一頁']");

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "11至20樓" })).toBeVisible();

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "21至31樓" })).toBeVisible();

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "樓宇總覽" })).toBeVisible();

  await prevBtn.click();
  await expect(page.getByRole("heading", { name: "21至31樓" })).toBeVisible();
});

test("summary slide donuts have side legend, slice labels and right-of-chart layout", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await nextBtn.click();
  await nextBtn.click();

  await expect(page.getByRole("heading", { name: "樓宇總覽" })).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(page.getByRole("heading", { name: "單位狀態" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "停留時間分佈" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "民安隊在單位時間分佈" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "民安隊人數分佈" })).toHaveCount(0);
  await expect(page.locator(".donut-card")).toHaveCount(2);

  const firstDonut = page.locator(".donut-card").first();
  await expect(firstDonut.locator("svg.donut-svg")).toBeVisible();
  await expect(firstDonut.locator("text.donut-center")).toBeVisible();

  // Side-by-side: SVG is left of legend
  const svgBox = await firstDonut.locator("svg.donut-svg").boundingBox();
  const legendBox = await firstDonut.locator(".donut-legend").boundingBox();
  expect(svgBox).not.toBeNull();
  expect(legendBox).not.toBeNull();
  if (svgBox && legendBox) {
    expect(svgBox.x + svgBox.width).toBeLessThanOrEqual(legendBox.x + 4);
  }

  const donutCards = page.locator(".donut-card");
  const donutCount = await donutCards.count();
  for (let i = 0; i < donutCount; i += 1) {
    const bodyBox = await donutCards.nth(i).locator(".donut-body").boundingBox();
    const chartBox = await donutCards.nth(i).locator(".donut-chart-wrap").boundingBox();
    const cardLegendBox = await donutCards.nth(i).locator(".donut-legend").boundingBox();
    expect(bodyBox).not.toBeNull();
    expect(chartBox).not.toBeNull();
    expect(cardLegendBox).not.toBeNull();
    if (bodyBox && chartBox && cardLegendBox) {
      expect(chartBox.width + 1).toBeGreaterThanOrEqual(bodyBox.width * 0.7);
      expect(chartBox.x + chartBox.width).toBeLessThanOrEqual(cardLegendBox.x + 4);
    }
  }

  // Per-slice annotation rendered (label + %)
  await expect(firstDonut.locator("g.donut-annotation").first()).toBeVisible();
  await expect(firstDonut.locator("g.donut-annotation text.donut-slice-label").first()).toContainText("%");
  await expect(firstDonut).toContainText("未登記");
  await expect(firstDonut).toContainText("收拾中");
  await expect(firstDonut).not.toContainText("未開始");
  await expect(firstDonut).not.toContainText("訪問中");

  // Legend rows include label, percent and value cells; all visible inside the card
  const firstLegendItem = firstDonut.locator(".donut-legend li").first();
  await expect(firstLegendItem.locator(".legend-percent")).toContainText("%");
  await expect(firstLegendItem.locator(".legend-value")).toBeVisible();

  // Every Duration Distribution legend row visible without horizontal scroll inside its card
  const durationCard = page.locator(".donut-card", { has: page.getByRole("heading", { name: "停留時間分佈" }) });
  const durationRows = durationCard.locator(".donut-legend li");
  const rowCount = await durationRows.count();
  const cardBox = await durationCard.boundingBox();
  expect(cardBox).not.toBeNull();
  for (let i = 0; i < rowCount; i += 1) {
    const rowBox = await durationRows.nth(i).boundingBox();
    expect(rowBox).not.toBeNull();
    if (cardBox && rowBox) {
      expect(rowBox.x + rowBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
    }
  }

  const stageBox = await page.locator(".kiosk-stage").boundingBox();
  expect(stageBox).not.toBeNull();
  const visibleChartParts = page.locator(".donut-card, .donut-svg, .donut-legend, .donut-slice-label");
  const partCount = await visibleChartParts.count();
  for (let i = 0; i < partCount; i += 1) {
    const partBox = await visibleChartParts.nth(i).boundingBox();
    expect(partBox).not.toBeNull();
    if (stageBox && partBox) {
      expect(partBox.x).toBeGreaterThanOrEqual(stageBox.x);
      expect(partBox.y).toBeGreaterThanOrEqual(stageBox.y);
      expect(partBox.x + partBox.width).toBeLessThanOrEqual(stageBox.x + stageBox.width + 1);
      expect(partBox.y + partBox.height).toBeLessThanOrEqual(stageBox.y + stageBox.height + 1);
    }
  }
});

test("summary donut labels are enlarged while staying inside the chart area", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await nextBtn.click();
  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "樓宇總覽" })).toBeVisible();
  await page.waitForTimeout(1000);

  const svg = page.locator(".donut-card").first().locator("svg.donut-svg");
  const labels = svg.locator("text.donut-slice-label");
  const svgBox = await svg.boundingBox();
  expect(svgBox).not.toBeNull();
  const count = await labels.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i += 1) {
    const label = labels.nth(i);
    const fontSize = Number.parseFloat(await label.evaluate((el) => getComputedStyle(el).fontSize));
    const labelBox = await label.boundingBox();
    expect(fontSize).toBeGreaterThanOrEqual(18);
    expect(labelBox).not.toBeNull();
    if (svgBox && labelBox) {
      expect(labelBox.x).toBeGreaterThanOrEqual(svgBox.x);
      expect(labelBox.y).toBeGreaterThanOrEqual(svgBox.y);
      expect(labelBox.x + labelBox.width).toBeLessThanOrEqual(svgBox.x + svgBox.width + 1);
      expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(svgBox.y + svgBox.height + 1);
    }
  }
});

test("duration donut labels spread without overlap", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await nextBtn.click();
  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "樓宇總覽" })).toBeVisible();
  await page.waitForTimeout(1000);

  const durationCard = page.locator(".donut-card", { has: page.getByRole("heading", { name: "停留時間分佈" }) });
  const labels = durationCard.locator("text.donut-slice-label");
  const labelCount = await labels.count();
  expect(labelCount).toBeGreaterThan(1);
  const polylineCount = await durationCard.locator("polyline").count();
  expect(polylineCount).toBeLessThan(labelCount);
  for (let i = 1; i < labelCount; i += 1) {
    const prev = await labels.nth(i - 1).boundingBox();
    const curr = await labels.nth(i).boundingBox();
    expect(prev).not.toBeNull();
    expect(curr).not.toBeNull();
    if (prev && curr) {
      const separated = curr.y >= prev.y + prev.height || prev.y >= curr.y + curr.height || curr.x >= prev.x + prev.width || prev.x >= curr.x + curr.width;
      expect(separated).toBe(true);
    }
  }
});

test("summary metric cards use selected session labels and status backgrounds", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  const header = page.locator("article.slide").first().locator(".slide-header");
  await expect(header.getByText("今日可訪單位")).toBeVisible();
  await expect(header.getByText("今日總人數")).toBeVisible();
  await expect(header.getByText("正在訪問單位")).toBeVisible();
  await expect(header.getByText("正在訪問人數")).toBeVisible();
  await expect(header.getByText("已完成單位")).toBeVisible();
  await expect(header.getByText("已完成人數")).toBeVisible();
  await expect(header.locator(".metric-card--active")).toHaveCount(2);
  await expect(header.locator(".metric-card--completed")).toHaveCount(2);
});

test("compact stats bar is visible inside slide-1 and slide-2 headers", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();

  // Slide 1: stats bar present in header
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();
  const slide1Header = page.locator("article.slide").first().locator(".slide-header");
  await expect(slide1Header.locator(".summary-grid.summary-stats-bar--compact")).toBeVisible();

  // Navigate to Slide 2: stats bar also present
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "11至20樓" })).toBeVisible();
  const slide2Header = page.locator("article.slide").nth(1).locator(".slide-header");
  await expect(slide2Header.locator(".summary-grid.summary-stats-bar--compact")).toBeVisible();

  // Navigate to Slide 3: stats bar also present
  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "21至31樓" })).toBeVisible();
  const slide3Header = page.locator("article.slide").nth(2).locator(".slide-header");
  await expect(slide3Header.locator(".summary-grid.summary-stats-bar--compact")).toBeVisible();
});

test("floor-grid slides display floor rows in ascending visual order", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();

  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();
  const slide1FloorLabels = page.locator("article.slide").first().locator(".floor-row .floor-label");
  await expect(slide1FloorLabels.first()).toHaveText("1樓");
  await expect(slide1FloorLabels.last()).toHaveText("10樓");
  const slide1FirstFloorBox = await slide1FloorLabels.first().boundingBox();
  const slide1LastFloorBox = await slide1FloorLabels.last().boundingBox();
  expect(slide1FirstFloorBox).not.toBeNull();
  expect(slide1LastFloorBox).not.toBeNull();
  if (slide1FirstFloorBox && slide1LastFloorBox) {
    expect(slide1FirstFloorBox.y).toBeLessThan(slide1LastFloorBox.y);
  }

  await page.locator("button.control-nav[aria-label='下一頁']").click();
  await expect(page.getByRole("heading", { name: "11至20樓" })).toBeVisible();
  const slide2FloorLabels = page.locator("article.slide").nth(1).locator(".floor-row .floor-label");
  await expect(slide2FloorLabels.first()).toHaveText("11樓");
  await expect(slide2FloorLabels.last()).toHaveText("20樓");
  const slide2FirstFloorBox = await slide2FloorLabels.first().boundingBox();
  const slide2LastFloorBox = await slide2FloorLabels.last().boundingBox();
  expect(slide2FirstFloorBox).not.toBeNull();
  expect(slide2LastFloorBox).not.toBeNull();
  if (slide2FirstFloorBox && slide2LastFloorBox) {
    expect(slide2FirstFloorBox.y).toBeLessThan(slide2LastFloorBox.y);
  }

  await page.locator("button.control-nav[aria-label='下一頁']").click();
  await expect(page.getByRole("heading", { name: "21至31樓" })).toBeVisible();
  // Wait for slide transition to complete before measuring layout
  await page.waitForTimeout(1000);
  const slide3FloorLabels = page.locator("article.slide").nth(2).locator(".floor-row .floor-label");
  await expect(slide3FloorLabels.first()).toHaveText("21樓");
  await expect(slide3FloorLabels.last()).toHaveText("31樓");
  const slide3FirstFloorBox = await slide3FloorLabels.first().boundingBox();
  const slide3LastFloorBox = await slide3FloorLabels.last().boundingBox();
  expect(slide3FirstFloorBox).not.toBeNull();
  expect(slide3LastFloorBox).not.toBeNull();
  if (slide3FirstFloorBox && slide3LastFloorBox) {
    expect(slide3FirstFloorBox.y).toBeLessThan(slide3LastFloorBox.y);
  }

  // Verify all 11 floor rows in slide 3 fit within stage height without clipping
  const stageBox = await page.locator(".kiosk-stage").boundingBox();
  expect(stageBox).not.toBeNull();
  const slide3Rows = page.locator("article.slide").nth(2).locator(".floor-row");
  const rowCount = await slide3Rows.count();
  expect(rowCount).toBe(11);
  const PX_TOLERANCE = 4;
  for (let i = 0; i < rowCount; i += 1) {
    const rowBox = await slide3Rows.nth(i).boundingBox();
    expect(rowBox).not.toBeNull();
    if (stageBox && rowBox) {
      expect(rowBox.y).toBeGreaterThanOrEqual(stageBox.y - PX_TOLERANCE);
      expect(rowBox.y + rowBox.height).toBeLessThanOrEqual(stageBox.y + stageBox.height + PX_TOLERANCE);
    }
  }
  // Ensure rows do not overlap each other
  for (let i = 1; i < rowCount; i += 1) {
    const prev = await slide3Rows.nth(i - 1).boundingBox();
    const curr = await slide3Rows.nth(i).boundingBox();
    if (prev && curr) {
      expect(curr.y).toBeGreaterThanOrEqual(prev.y + prev.height - PX_TOLERANCE);
    }
  }
});

test("floor-grid labels and empty cells use enhanced readable styling", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  const floorLabel = page.locator("article.slide").first().locator(".floor-row .floor-label").first();
  const unitHeader = page.locator("article.slide").first().locator(".unit-header").first();
  const emptyCell = page.locator("article.slide").first().locator(".unit-square.warning-empty").first();

  await expect(floorLabel).toBeVisible();
  await expect(unitHeader).toBeVisible();
  await expect(emptyCell).toBeVisible();

  const floorLabelFont = Number.parseFloat(await floorLabel.evaluate((el) => getComputedStyle(el).fontSize));
  const unitHeaderFont = Number.parseFloat(await unitHeader.evaluate((el) => getComputedStyle(el).fontSize));
  expect(floorLabelFont).toBeGreaterThanOrEqual(18);
  expect(unitHeaderFont).toBeGreaterThanOrEqual(18);

  for (const locator of [floorLabel, unitHeader]) {
    const box = await locator.boundingBox();
    const scroll = await locator.evaluate((el) => ({ width: el.scrollWidth, height: el.scrollHeight }));
    expect(box).not.toBeNull();
    if (box) {
      expect(scroll.width).toBeLessThanOrEqual(Math.ceil(box.width) + 1);
      expect(scroll.height).toBeLessThanOrEqual(Math.ceil(box.height) + 1);
    }
  }

  const unitHeaderBg = await unitHeader.evaluate((el) => getComputedStyle(el).backgroundImage || getComputedStyle(el).backgroundColor);
  const emptyBg = await emptyCell.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(unitHeaderBg).toContain("187, 247, 208");
  expect(emptyBg).toContain("226, 232, 240");

  await page.locator("button.control-nav[aria-label='下一頁']").click();
  await expect(page.getByRole("heading", { name: "11至20樓" })).toBeVisible();
  const activeCell = page.locator("article.slide").nth(1).locator(".unit-square.warning-active").first();
  await expect(activeCell).toBeVisible();
  const activeBg = await activeCell.evaluate((el) => getComputedStyle(el).backgroundImage || getComputedStyle(el).backgroundColor);
  expect(activeBg).toContain("217, 119, 6");
});

test("date-session flat cells are white, detailed, and magnify on hover", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "21至31樓" })).toBeVisible();
  await page.waitForTimeout(1000);

  const filledCell = page.locator("article.slide").nth(2).locator(".floor-row", { hasText: "31樓" }).locator(".unit-square").nth(7);
  await expect(filledCell).toBeVisible();
  await expect(filledCell).toHaveClass(/warning-filled/);
  await expect(filledCell).toContainText("05/20/2026");
  await expect(filledCell).toContainText("AM");
  await expect(filledCell).toContainText("05/20/2026 AM");
  await expect(filledCell).toContainText("進入 --:-- | 離開 --:--");
  await expect(filledCell).toContainText("人數 6");
  await expect(filledCell).toContainText("民安隊人數 0");
  const bgColor = await filledCell.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bgColor).toBe("rgb(255, 255, 255)");

  const beforeBox = await filledCell.boundingBox();
  const beforeFont = Number.parseFloat(await filledCell.locator(".unit-details").evaluate((el) => getComputedStyle(el).fontSize));
  expect(beforeBox).not.toBeNull();
  await filledCell.hover();
  await expect.poll(async () => {
    const transform = await filledCell.evaluate((el) => getComputedStyle(el).transform);
    return Number.parseFloat(transform.match(/^matrix\(([^,]+)/)?.[1] ?? "1");
  }).toBeGreaterThanOrEqual(1.9);
  const afterTransform = await filledCell.evaluate((el) => getComputedStyle(el).transform);
  const afterFont = Number.parseFloat(await filledCell.locator(".unit-details").evaluate((el) => getComputedStyle(el).fontSize));
  const scaleX = Number.parseFloat(afterTransform.match(/^matrix\(([^,]+)/)?.[1] ?? "1");
  const scaleY = Number.parseFloat(afterTransform.match(/^matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+)/)?.[1] ?? "1");
  expect(scaleX).toBeGreaterThanOrEqual(1.9);
  expect(scaleY).toBeGreaterThanOrEqual(2.4);
  expect(afterFont).toBeGreaterThan(beforeFont);
});

test("floor grid shows non-selected session flat records as empty cells with detail", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  const fallbackCell = page.locator("article.slide").first().locator(".floor-row", { hasText: "10樓" }).locator(".unit-square").nth(7);
  await expect(fallbackCell).toBeVisible();
  await expect(fallbackCell).toHaveClass(/warning-empty/);
  await expect(fallbackCell).toContainText("05/21/2026 PM");
  await expect(fallbackCell).toContainText("進入 --:-- | 離開 --:--");
  await expect(fallbackCell).toContainText("人數 5");
});

test("paused slideshow supports mouse-wheel slide navigation", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await expect(page.getByRole("heading", { name: "1至10樓" })).toBeVisible();

  const stage = page.locator(".kiosk-stage");
  const track = page.locator(".slide-track");
  const initialTransform = await track.evaluate((el) => getComputedStyle(el).transform);
  await stage.hover();
  await page.mouse.wheel(0, 800);
  await expect.poll(() => track.evaluate((el) => getComputedStyle(el).transform)).toBe(initialTransform);

  await page.getByRole("button", { name: "暫停" }).click();
  await page.mouse.wheel(0, 800);
  await expect.poll(() => track.evaluate((el) => getComputedStyle(el).transform)).not.toBe(initialTransform);
  const secondSlideTransform = await track.evaluate((el) => getComputedStyle(el).transform);

  await page.mouse.wheel(0, -800);
  await expect.poll(() => track.evaluate((el) => getComputedStyle(el).transform)).not.toBe(secondSlideTransform);
});

test("control bar renders two rows with selects on top and buttons below", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  const rows = page.locator(".control-bar .control-row");
  await expect(rows).toHaveCount(2);
  const upper = rows.nth(0);
  const lower = rows.nth(1);
  await expect(upper.locator("select")).toHaveCount(3);
  await expect(upper.getByLabel("進入日期")).toBeVisible();
  await expect(upper.getByLabel("上午/下午")).toBeVisible();
  await expect(upper.getByLabel("樓宇名稱")).toBeVisible();
  await expect(lower.getByRole("button", { name: "上一頁" })).toBeVisible();
  await expect(lower.getByRole("button", { name: "暫停" })).toBeVisible();
  await expect(lower.getByRole("button", { name: "下一頁" })).toBeVisible();
  const upperBox = await upper.boundingBox();
  const lowerBox = await lower.boundingBox();
  expect(upperBox).not.toBeNull();
  expect(lowerBox).not.toBeNull();
  if (upperBox && lowerBox) {
    expect(lowerBox.y).toBeGreaterThanOrEqual(upperBox.y + upperBox.height - 1);
  }
});

test("control bar dropdown does not overlap summary metric boxes", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  // Navigate to summary slide (slide 4) -> click next 3 times
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await nextBtn.click();
  await nextBtn.click();
  await page.waitForTimeout(1000);
  // Bounding boxes of the 6 summary metric boxes on the summary slide
  const metricCards = page.locator("article.slide").nth(3).locator(".metric-card");
  const cardCount = await metricCards.count();
  expect(cardCount).toBeGreaterThanOrEqual(5);
  // Control bar upper row bottom edge must be above the top edge of every metric card.
  // This ensures any dropdown opened from the upper row, which appears immediately below the row,
  // cannot extend over the metric boxes when constrained to the bar's vertical placement.
  const upperRow = page.locator(".control-bar .control-row").nth(0);
  const upperBox = await upperRow.boundingBox();
  expect(upperBox).not.toBeNull();
  for (let i = 0; i < cardCount; i++) {
    const cardBox = await metricCards.nth(i).boundingBox();
    if (upperBox && cardBox) {
      // Horizontal overlap check
      const horizOverlap = upperBox.x < cardBox.x + cardBox.width && cardBox.x < upperBox.x + upperBox.width;
      if (horizOverlap) {
        // If horizontally overlapping, upper-row bottom must not be below card top
        expect(upperBox.y + upperBox.height).toBeLessThanOrEqual(cardBox.y);
      }
    }
  }
});
