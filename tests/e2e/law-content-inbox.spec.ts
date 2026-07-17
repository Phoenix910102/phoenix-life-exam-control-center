import { expect, test } from "@playwright/test";

test("law operations exposes the incremental content pipeline", async ({ page }) => {
  await page.goto("/law");

  await expect(page.getByRole("heading", { name: "司律題目主線" })).toBeVisible();
  await expect(page.getByRole("link", { name: /內容收件匣/ })).toBeVisible();
  await expect(page.getByText("增量內容管線")).toBeVisible();
  await expect(page.getByText("題庫主線", { exact: true })).toBeVisible();
  await expect(page.getByText("來源與版本", { exact: true })).toBeVisible();
  if (process.platform === "darwin") {
    await expect(page).toHaveScreenshot("law-operations-desktop.png", { fullPage: true });
  }
});

test("content inbox validates an incremental patch before any content is changed", async ({ page }) => {
  await page.goto("/law/content-inbox");
  await page.getByRole("button", { name: "載入範例" }).click();

  await expect(page.getByRole("heading", { name: "可進入待審" })).toBeVisible();
  await expect(page.getByText("新增題目", { exact: true })).toBeVisible();
  await expect(page.getByText("新增來源", { exact: true })).toBeVisible();
  await expect(page.getByText("建立關聯", { exact: true })).toBeVisible();

  const stats = page.locator('[class*="analysisStats"]');
  await expect(stats).toContainText("ADD2");
  await expect(stats).toContainText("LINK1");
  if (process.platform === "darwin") {
    await expect(page).toHaveScreenshot("law-content-inbox-desktop.png", { fullPage: true });
  }
});

test("mobile content inbox keeps the parchment report and actions in view", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/law/content-inbox");
  await page.getByRole("button", { name: "載入範例" }).click();

  await expect(page.getByRole("heading", { name: "可進入待審" })).toBeVisible();
  await expect(page.getByRole("button", { name: "匯出待審 Patch" })).toBeVisible();
  const bodyWidth = await page.locator("body").evaluate((element) => element.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(390);
  if (process.platform === "darwin") {
    await expect(page).toHaveScreenshot("law-content-inbox-mobile.png", { fullPage: true });
  }
});
