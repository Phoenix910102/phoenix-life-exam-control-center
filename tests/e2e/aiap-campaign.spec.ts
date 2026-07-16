import { expect, test } from "@playwright/test";
test("imports the complete AIAP campaign and exposes searchable term cards", async ({ page }) => {
  await page.goto("/materials");
  await expect(page.getByTestId("materials-page")).toHaveAttribute("data-hydrated", "true");

  await page.getByRole("button", { name: "載入 AIAP 全科教材" }).first().click();
  await expect(page.getByText("15 章").first()).toBeVisible();
  await page.getByLabel("匯入後設為目前主線").check();
  await page.getByRole("button", { name: "確認匯入教材" }).click();
  await page.getByRole("button", { name: "繼續戰役" }).click();

  await expect(page).toHaveURL(/\/campaigns\/aiap-intermediate-complete-guide$/);
  await expect(page.getByRole("heading", { name: "AIAP 中級：情境判題與應用全科戰役" })).toBeVisible();

  const roadmap = page.getByRole("navigation", { name: "教材章節路線圖" });
  await roadmap.getByRole("button", { name: /中級總地圖：兩科其實是一條流程/ }).click();
  await page.getByLabel("搜尋本章內容").fill("超參數");

  await expect(page.getByRole("heading", { name: "超參數", exact: true })).toBeVisible();
  await expect(page.getByText("判題信號", { exact: true })).toBeVisible();
  await expect(page.getByText("應用情況", { exact: true })).toBeVisible();
  await expect(page.getByText("考題例子", { exact: true })).toBeVisible();
  await expect(page.getByText("容易混", { exact: true })).toBeVisible();

  await page.getByTestId("campaign-mode-toggle").getByRole("button", { name: "夜讀" }).click();
  await expect(page.locator('[data-campaign-mode="night"]')).toBeVisible();

  await page.getByRole("link", { name: "返回中控台" }).click();
  await expect(page).toHaveURL(/\/command-center$/);
  await expect(page.getByText("AIAP 中級：情境判題與應用全科戰役").first()).toBeVisible();
});
