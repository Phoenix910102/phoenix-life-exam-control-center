import { expect, test } from "@playwright/test";

test("imports the bundled criminal procedure curriculum and records it as the active campaign", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/materials");
  await expect(page.getByTestId("materials-page")).toHaveAttribute("data-hydrated", "true");
  await page.getByRole("button", { name: "載入刑訴全科教材" }).first().click();

  await expect(page.getByRole("heading", { name: "刑事訴訟法：程序玫瑰全科戰役" })).toBeVisible();
  await expect(page.getByText("29 章").first()).toBeVisible();
  const activeCheckbox = page.getByLabel("匯入後設為目前主線");
  if (!(await activeCheckbox.isChecked())) await activeCheckbox.check();
  await page.getByRole("button", { name: "確認匯入教材" }).click();
  await page.getByRole("button", { name: "繼續戰役" }).click();

  await expect(page).toHaveURL(/\/campaigns\/criminal-procedure-complete-phoenix$/);
  await expect(page.getByTestId("campaign-experience")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("campaign-curriculum-home")).toContainText("216");
  await expect(page.getByTestId("campaign-curriculum-home")).toContainText("162");

  await page.getByRole("link", { name: "返回中控台" }).click();
  await expect(page).toHaveURL(/\/command-center$/);
  await expect(page.getByText("刑事訴訟法：程序玫瑰全科戰役").first()).toBeVisible();
});
