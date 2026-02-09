import { test, expect } from "@playwright/test";

test("console add task/question and snapshot generation", async ({ page }) => {
  await page.goto("/console");

  await page.getByRole("button", { name: "Insert Task" }).click();

  await page.getByRole("button", { name: "Insert Structured" }).click();

  await page.goto("/settings");
  await page.getByRole("button", { name: "Download Snapshot" }).click();
  await expect(page.getByText("generated at:")).toBeVisible();
});
