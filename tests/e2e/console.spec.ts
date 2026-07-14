import { test, expect } from "@playwright/test";

test("console add task/question and snapshot generation", async ({ page }) => {
  await page.goto("/console");

  await page.getByRole("button", { name: "新增任務" }).click();

  await page.getByRole("button", { name: "新增結構化題目" }).click();

  await page.goto("/settings");
  await page.getByRole("button", { name: "下載快照" }).click();
  await expect(page.getByText(/^產生時間：/)).not.toHaveText("產生時間：-");
});
