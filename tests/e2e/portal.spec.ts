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
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();

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
  await expect(page.locator(".unit-square.warning-medical").first()).toBeVisible();
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
  // Default language is Traditional Chinese
  await expect(page.getByLabel("樓宇名稱")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();
});

test("wires house, theme, and language controls", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();

  await page.getByLabel("上午/下午").selectOption("PM");
  const houseSelect = page.getByLabel("樓宇名稱");
  await expect(houseSelect.locator("option", { hasText: "宏泰閣" })).toHaveCount(1);
  await expect(houseSelect.locator("option", { hasText: "宏仁閣" })).toHaveCount(0);
  await houseSelect.selectOption("Wang Tai House");
  await expect(page.getByText("第1頁 / 宏泰閣")).toBeVisible();
  await expect(page.getByText("進入 08:05")).toBeVisible();

  // Default is light; clicking theme button switches to dark
  await expect(page.locator(".kiosk-shell")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "深色" }).click();
  await expect(page.locator(".kiosk-shell")).toHaveAttribute("data-theme", "dark");

  // Switch to English
  await page.getByRole("button", { name: "English" }).click();
  await expect(page.getByLabel("House Name")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Floors 1-16" })).toBeVisible();
  await expect(page.locator(".floor-label", { hasText: "1/F" }).first()).toBeVisible();
  await expect(page.locator(".unit-header", { hasText: "Unit 01" }).first()).toBeVisible();
  await expect(page.locator(".eyebrow", { hasText: "Wang Tai House" }).first()).toBeVisible();
});

test("pause stops auto-advance and prev/next navigate manually", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();

  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  const prevBtn = page.locator("button.control-nav[aria-label='上一頁']");

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "17至31樓" })).toBeVisible();

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "樓宇總覽" })).toBeVisible();

  await prevBtn.click();
  await expect(page.getByRole("heading", { name: "17至31樓" })).toBeVisible();
});

test("summary slide donuts have side legend, slice labels and right-of-chart layout", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await nextBtn.click();

  await expect(page.getByRole("heading", { name: "樓宇總覽" })).toBeVisible();
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

  // Per-slice annotation rendered (label + %)
  await expect(firstDonut.locator("g.donut-annotation").first()).toBeVisible();
  await expect(firstDonut.locator("g.donut-annotation text.donut-slice-label").first()).toContainText("%");

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
});

test("summary metric cards use selected session labels and status backgrounds", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();

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
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();
  const slide1Header = page.locator("article.slide").first().locator(".slide-header");
  await expect(slide1Header.locator(".summary-grid.summary-stats-bar--compact")).toBeVisible();

  // Navigate to Slide 2: stats bar also present
  const nextBtn = page.locator("button.control-nav[aria-label='下一頁']");
  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "17至31樓" })).toBeVisible();
  const slide2Header = page.locator("article.slide").nth(1).locator(".slide-header");
  await expect(slide2Header.locator(".summary-grid.summary-stats-bar--compact")).toBeVisible();
});

test("floor-grid slides display floor rows in ascending visual order", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();

  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();
  const slide1FloorLabels = page.locator("article.slide").first().locator(".floor-row .floor-label");
  await expect(slide1FloorLabels.first()).toHaveText("1樓");
  await expect(slide1FloorLabels.last()).toHaveText("16樓");
  const slide1FirstFloorBox = await slide1FloorLabels.first().boundingBox();
  const slide1LastFloorBox = await slide1FloorLabels.last().boundingBox();
  expect(slide1FirstFloorBox).not.toBeNull();
  expect(slide1LastFloorBox).not.toBeNull();
  if (slide1FirstFloorBox && slide1LastFloorBox) {
    expect(slide1FirstFloorBox.y).toBeLessThan(slide1LastFloorBox.y);
  }

  await page.locator("button.control-nav[aria-label='下一頁']").click();
  await expect(page.getByRole("heading", { name: "17至31樓" })).toBeVisible();
  const slide2FloorLabels = page.locator("article.slide").nth(1).locator(".floor-row .floor-label");
  await expect(slide2FloorLabels.first()).toHaveText("17樓");
  await expect(slide2FloorLabels.last()).toHaveText("31樓");
  const slide2FirstFloorBox = await slide2FloorLabels.first().boundingBox();
  const slide2LastFloorBox = await slide2FloorLabels.last().boundingBox();
  expect(slide2FirstFloorBox).not.toBeNull();
  expect(slide2LastFloorBox).not.toBeNull();
  if (slide2FirstFloorBox && slide2LastFloorBox) {
    expect(slide2FirstFloorBox.y).toBeLessThan(slide2LastFloorBox.y);
  }
});
