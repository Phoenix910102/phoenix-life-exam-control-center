import { expect, test } from "@playwright/test";

test("completes the question-first vertical slice and restores state after reload", async ({ page }) => {
  await page.goto("/law/practice");

  await expect(page).toHaveURL(/\/law\/practice\/session\/law-session%3A/);
  await expect(page.getByText("題幹先行", { exact: true })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
  if (process.platform === "darwin") {
    await expect(page).toHaveScreenshot("legal-practice-stem-desktop.png", { fullPage: true });
  }

  await page.getByRole("button", { name: /開始鎖定題眼/ }).click();
  await page.getByRole("button", { name: "判斷順序" }).click();
  await page.getByRole("button", { name: /確認題眼/ }).click();
  await page.getByRole("radio", { name: /構成要件該當性/ }).click();
  await page.getByRole("button", { name: "確定" }).click();
  await page.getByRole("button", { name: /顯示選項/ }).click();
  await page.getByRole("radio", { name: /構成要件該當性 → 違法性 → 有責性/ }).click();
  await page.getByRole("button", { name: "確定" }).click();

  await expect(page.getByRole("heading", { name: "答案與信心已封存" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "答案與信心已封存" })).toBeVisible();

  await page.getByRole("button", { name: /提交答案/ }).click();
  await page.getByRole("button", { name: /查看逐項解析/ }).click();
  await expect(page.getByText("最小修正：先構成要件，再違法性，最後有責性。")).toBeVisible();
  await page.getByRole("button", { name: /只補這題的缺口/ }).click();
  await expect(page.getByRole("heading", { name: "這題只需要守住一條判斷線" })).toBeVisible();
  await page.getByRole("button", { name: "用變化題確認" }).click();
  await page.getByRole("radio", { name: /行為人的有責性/ }).click();
  await page.getByRole("button", { name: /提交變化題/ }).click();
  await expect(page.getByText("QUESTION SECURED")).toBeVisible();
  await page.getByRole("button", { name: /進入下一題/ }).click();
  await expect(page.getByText("正當防衛", { exact: false })).toBeVisible();
});

test("mobile practice remains single-column and preserves reading mode", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/law/practice");
  await page.getByRole("button", { name: "夜讀" }).click();
  await page.reload();

  await expect(page.locator("main").first()).toHaveAttribute("data-reading-mode", "night");
  await expect(page.getByRole("button", { name: "夜讀" })).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator("body").evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(390);
  if (process.platform === "darwin") {
    await expect(page).toHaveScreenshot("legal-practice-stem-mobile.png", { fullPage: true });
  }
});
