import { expect, test } from "@playwright/test";

test("shows the first floor-grid slide with unit movement data and CAS staff no", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause" }).click();
  // Make sure we're on slide 1
  await expect(page.getByRole("heading", { name: "Floors 1-16" })).toBeVisible();

  await expect(page.getByText("Slide 1 / Wang Yan House")).toBeVisible();
  await expect(page.locator(".unit-header", { hasText: "Unit 01" }).first()).toBeVisible();
  await expect(page.locator(".unit-square .unit-id")).toHaveCount(0);
  await expect(page.getByText("Entry 08:10")).toBeVisible();
  await expect(page.locator(".unit-details", { hasText: "CAS no. CAS-1101" }).first()).toBeVisible();
  await expect(page.locator(".unit-square.warning-medical").first()).toBeVisible();
  await expect(page.locator(".unit-square.warning-medical .luggage-indicator.indicator-purple").first()).toBeVisible();
});

test("wires house, theme, and language controls with Chinese floor/unit/house labels", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("heading", { name: "Floors 1-16" })).toBeVisible();

  // Wait for the option to appear in the select before choosing it.
  const houseSelect = page.getByLabel("House Name");
  await expect(houseSelect.locator("option", { hasText: "Wang Tai House" })).toHaveCount(1);
  await houseSelect.selectOption("Wang Tai House");
  await expect(page.getByText("Slide 1 / Wang Tai House")).toBeVisible();
  await expect(page.getByText("Entry 08:05")).toBeVisible();

  await page.getByRole("button", { name: "Light" }).click();
  await expect(page.locator(".kiosk-shell")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "繁體中文" }).click();
  await expect(page.getByLabel("樓宇名稱")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1至16樓" })).toBeVisible();
  await expect(page.locator(".floor-label", { hasText: "1樓" }).first()).toBeVisible();
  await expect(page.locator(".unit-header", { hasText: "01室" }).first()).toBeVisible();
  await expect(page.locator(".eyebrow", { hasText: "宏泰閣" }).first()).toBeVisible();
});

test("pause stops auto-advance and prev/next navigate manually", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("heading", { name: "Floors 1-16" })).toBeVisible();

  const nextBtn = page.locator("button.control-nav[aria-label='Next']");
  const prevBtn = page.locator("button.control-nav[aria-label='Previous']");

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "Floors 17-31" })).toBeVisible();

  await nextBtn.click();
  await expect(page.getByRole("heading", { name: "Building Summary" })).toBeVisible();

  await prevBtn.click();
  await expect(page.getByRole("heading", { name: "Floors 17-31" })).toBeVisible();
});

test("summary slide donuts have side legend, slice labels and right-of-chart layout", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause" }).click();
  const nextBtn = page.locator("button.control-nav[aria-label='Next']");
  await nextBtn.click();
  await nextBtn.click();

  await expect(page.getByRole("heading", { name: "Building Summary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Flat Status" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Duration Distribution" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CSA Staff In-Flat Duration" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CSA Staff Count Distribution" })).toBeVisible();
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
  const durationCard = page.locator(".donut-card", { has: page.getByRole("heading", { name: "Duration Distribution" }) });
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
