import { expect, test } from "@playwright/test";

test("command center presents the primary mission and global status", async ({ page }) => {
  await page.goto("/command-center");

  await expect(page.getByText("COMMAND CENTER", { exact: true })).toBeVisible();
  await expect(page.getByText("今日主線", { exact: true })).toBeVisible();
  await expect(page.getByTestId("currency-bar")).toContainText("SP");
  await expect(page.getByTestId("currency-bar")).toContainText("BP");
  await expect(page.getByTestId("upcoming-reward")).toContainText("Night Commander");
  await expect(page.getByRole("button", { name: "進入戰役" })).toBeVisible();
  await expect(page.getByRole("button", { name: "軍需庫" })).toBeVisible();

  const scene = page.getByTestId("command-scene");
  await page.mouse.move(1200, 220);
  await expect.poll(() => scene.evaluate((element) => element.style.getPropertyValue("--pointer-x"))).not.toBe("0");
});

test("command center keeps the primary actions visible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/command-center");

  await expect(page.getByTestId("current-mission")).toBeVisible();
  await expect(page.getByRole("button", { name: "進入戰役" })).toBeVisible();
  await expect(page.getByRole("button", { name: "軍需庫" })).toBeVisible();

  await page.getByRole("button", { name: "開啟全域導航" }).click();
  const mobileNavigation = page.getByRole("navigation", { name: "Phoenix 行動版全域導航" });
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "教材戰役" })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "生活紀錄" })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "用藥協議" })).toBeVisible();
});
