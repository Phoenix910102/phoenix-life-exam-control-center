import { expect, test } from "@playwright/test";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";

test("imports, reads, quizzes, and updates a Phoenix material without losing progress", async ({ page }) => {
  await page.goto("/materials");

  const packageInput = page.locator('input[accept*=".phoenix-material.json"]');
  await packageInput.setInputFiles({
    name: "example-gradient-descent.phoenix-material.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(sampleJson)),
  });

  await expect(page.getByText("phoenix.material.v1")).toBeVisible();
  await expect(page.getByText("人工智慧技術應用與規劃").first()).toBeVisible();
  await expect(page.getByText("1 章").first()).toBeVisible();
  await page.getByRole("button", { name: "確認匯入教材" }).click();

  await expect(page.getByRole("heading", { name: "梯度到底指哪裡？" })).toBeVisible();
  const firstQuestion = page.locator("fieldset").filter({ hasText: "梯度 ∇L 的方向代表什麼" });
  await firstQuestion.getByLabel("損失上升最快的方向").check();
  await firstQuestion.getByRole("button", { name: "送出答案" }).click();
  await expect(firstQuestion.getByText("答對", { exact: true })).toBeVisible();

  const progress = page.getByLabel("梯度到底指哪裡？進度");
  await progress.fill("60");
  await expect(progress).toHaveValue("60");

  const updated = structuredClone(sampleJson);
  updated.version = "1.1.0";
  updated.chapters.push({
    ...structuredClone(updated.chapters[0]),
    key: "gradient-descent-advanced",
    title: "進階更新策略",
  });
  await packageInput.setInputFiles({
    name: "example-gradient-descent-v1.1.phoenix-material.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(updated)),
  });

  await expect(page.getByText("可更新", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "確認更新教材" }).click();
  await expect(page.getByLabel("梯度到底指哪裡？進度")).toHaveValue("60");
  await expect(page.getByLabel("進階更新策略進度")).toHaveValue("0");
});
