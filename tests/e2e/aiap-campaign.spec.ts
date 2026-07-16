import { expect, test } from "@playwright/test";

const campaignPath = "/campaigns/aiap-intermediate-complete-guide";

test("opens the bundled AIAP v2 curriculum with computed metrics", async ({ page }) => {
  await page.goto(campaignPath);

  await expect(page.getByTestId("campaign-experience")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "AIAP 中級：情境判題與應用全科戰役" }).first()).toBeVisible();
  await expect(page.getByTestId("campaign-curriculum-home")).toContainText("305");
  await expect(page.getByTestId("campaign-curriculum-home")).toContainText("340");
  await expect(page.getByTestId("campaign-curriculum-home")).toContainText("17");
  await page.screenshot({ path: "docs/screenshots/aiap-v2-campaign-desktop.png" });
});

test("searches the glossary, opens a term dossier and returns to its chapter", async ({ page }) => {
  await page.goto(campaignPath);
  await page.getByRole("button", { name: "進入名詞庫" }).click();
  await page.getByLabel("搜尋名詞").fill("超參數");
  await expect(page.getByTestId("campaign-glossary")).toContainText("2 / 305 詞");
  await page.getByText("超參數", { exact: true }).click();
  await expect(page.getByTestId("term-dossier")).toBeVisible();
  await expect(page.getByTestId("term-dossier")).toContainText("判題信號");
  await expect(page.getByRole("navigation", { name: "詞條前後導覽" })).toBeVisible();
  await page.getByRole("button", { name: "回到引用章節" }).first().click();
  await expect(page.getByTestId("term-dossier")).toBeHidden();

  await page.getByTestId("campaign-mode-toggle").getByRole("button", { name: "夜讀" }).click();
  await expect(page.locator('[data-campaign-mode="night"]')).toBeVisible();
  await page.getByRole("link", { name: "返回中控台" }).click();
  await expect(page).toHaveURL(/\/command-center$/);
  await expect(page.getByText("AIAP 中級：情境判題與應用全科戰役").first()).toBeVisible();
});

test("opens Boss Quiz, Final Exam and preserves image questions", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto(campaignPath);
  await page.getByRole("button", { name: "開始 Boss Quiz" }).click();
  await expect(page.getByTestId("campaign-question-banks")).toBeVisible();
  await expect(page.getByTestId("question-runner")).toContainText("1 / 20");

  await page.getByRole("button", { name: /114 年第二梯次公告題 Final Exam/ }).click();
  await expect(page.getByTestId("question-runner")).toContainText("1 / 100");
  for (let index = 1; index < 53; index += 1) {
    await page.getByRole("button", { name: "下一題" }).click();
  }
  const image = page.getByAltText("s2-q003 題目附圖");
  await expect(image).toBeVisible();
  await expect(image).toHaveJSProperty("complete", true);
});

test("uses a mobile bottom sheet for the term dossier", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(campaignPath);
  await page.getByRole("button", { name: "進入名詞庫" }).click();
  await page.getByLabel("搜尋名詞").fill("超參數");
  await page.getByText("超參數", { exact: true }).click();
  const drawer = page.getByTestId("term-dossier");
  await expect(drawer).toBeVisible();
  const box = await drawer.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(390);
  expect(box?.height).toBeLessThan(844);
  await page.screenshot({ path: "docs/screenshots/aiap-v2-campaign-mobile.png" });
});
