import { expect, test } from "@playwright/test";

test("shows the first floor-grid slide with unit movement data and CAS staff no (default zh-Hant)", async ({ page }) => {
  await page.goto("/slide-show-data-portal/");
  await page.getByRole("button", { name: "暫停" }).click();
  // Make sure we're on slide 1 (default language is Traditional Chinese)
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();

  await expect(page.getByText("第1頁 / 宏仁閣")).toBeVisible();
  await expect(page.locator(".unit-header", { hasText: "01室" }).first()).toBeVisible();
  await expect(page.locator(".unit-square .unit-id")).toHaveCount(0);

  // Wait for movement data to load (Wang Tai House option appears only after API responds)
  const houseSelect = page.getByLabel("樓宇名稱");
  await expect(houseSelect.locator("option", { hasText: "宏泰閣" })).toHaveCount(1);

  await expect(page.getByText("進入 08:10")).toBeVisible();
  await expect(page.locator(".unit-details", { hasText: "民安隊編號 CAS-1101" }).first()).toBeVisible();
  await expect(page.locator(".unit-square.warning-medical").first()).toBeVisible();
  await expect(page.locator(".unit-square.warning-medical .luggage-indicator.indicator-purple").first()).toBeVisible();
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

  // Wait for the option to appear in the select before choosing it.
  const houseSelect = page.getByLabel("樓宇名稱");
  await expect(houseSelect.locator("option", { hasText: "宏泰閣" })).toHaveCount(1);
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
  await expect(page.getByRole("heading", { name: "民安隊在單位時間分佈" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "民安隊人數分佈" })).toBeVisible();
  await expect(page.locator(".donut-card")).toHaveCount(4);

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

