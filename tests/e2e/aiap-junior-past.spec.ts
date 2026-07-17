import { expect, test } from "@playwright/test";

test("opens and practices the AIAP junior official past exam bank", async ({ page }) => {
  await page.goto("/exams/past?bank=junior-official");

  await expect(page.getByRole("heading", { name: "AIAP 初級官方考古題戰情室" })).toBeVisible();
  await expect(page.getByText("初級官方公告 / 100 題")).toBeVisible();
  await expect(page.getByRole("button", { name: /初級官方題/ })).toHaveClass(/bg-primary/);
  const subjectSelect = page.getByRole("combobox", { name: "科目" });
  await expect(subjectSelect.locator("option")).toHaveText(["全部科目", "AIAP 初級 第一科", "AIAP 初級 第二科"]);
  await subjectSelect.selectOption("AIAP 初級 第一科");
  await expect(subjectSelect).toHaveValue("AIAP 初級 第一科");

  await expect(page.getByText(/初級[一二]科-\d+/).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^A\./ }).first()).toBeVisible();
});
