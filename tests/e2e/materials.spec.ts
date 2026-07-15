import { expect, test } from "@playwright/test";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";

test("imports, reads, quizzes, and updates a Phoenix material without losing progress", async ({ page }) => {
  await page.goto("/materials");
  await expect(page.getByTestId("materials-page")).toHaveAttribute("data-hydrated", "true");

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

  await expect(page.getByRole("heading", { name: "梯度到底指哪裡？" }).first()).toBeVisible();
  await expect(page.getByTestId("battlefield-3d")).toBeVisible();
  await expect(page.getByRole("button", { name: "2D 戰術圖" })).toBeVisible();
  await page.getByRole("button", { name: "診斷" }).click();
  await expect(page.getByText("先命名卡住的層級，再決定要補位置、定義、比較或題幹訊號。")).toBeVisible();
  await page.getByRole("button", { name: "閱讀" }).click();
  const firstQuestion = page.locator("fieldset").filter({ hasText: "梯度 ∇L 的方向代表什麼" });
  await firstQuestion.getByLabel("損失上升最快的方向").check();
  await firstQuestion.getByRole("button", { name: "送出答案" }).click();
  await expect(firstQuestion.getByText("答對", { exact: true })).toBeVisible();

  const progress = page.getByLabel("梯度到底指哪裡？進度");
  await progress.fill("60");
  await expect(progress).toHaveValue("60");
  await page.getByRole("button", { name: "戰場" }).click();
  await expect(page.getByTestId("battlefield-animation-status")).toContainText("作答正確，己方推進");
  await page.getByRole("button", { name: "2D 戰術圖" }).click();
  await expect(page.locator('button[data-status="frontline"]').filter({ hasText: "梯度到底指哪裡？" })).toContainText("60%");

  const consolePanel = page.getByRole("complementary", { name: "Rékaí 浮動戰術控制台" });
  await consolePanel.getByRole("button").first().click();
  await expect(consolePanel.getByText("今日喝水")).toBeVisible();
  await consolePanel.getByRole("button", { name: "已喝水" }).click();
  await expect(consolePanel.getByText("今日喝水").locator("..")).toContainText("1");

  const updated = structuredClone(sampleJson);
  updated.version = "1.2.0";
  updated.chapters.push({
    ...structuredClone(updated.chapters[0]),
    key: "gradient-descent-advanced",
    title: "進階更新策略",
  });
  await packageInput.setInputFiles({
    name: "example-gradient-descent-v1.2.phoenix-material.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(updated)),
  });

  await expect(page.getByText("可更新", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "確認更新教材" }).click();
  await expect(page.getByLabel("梯度到底指哪裡？進度")).toHaveValue("60");
  await page.getByRole("navigation", { name: "教材章節路線圖" }).getByRole("button", { name: /進階更新策略/ }).click();
  await expect(page.getByLabel("進階更新策略進度")).toHaveValue("0");
});

test("unlocks a campaign achievement after securing a chapter", async ({ page }) => {
  await page.goto("/materials");
  await expect(page.getByTestId("materials-page")).toHaveAttribute("data-hydrated", "true");
  const packageInput = page.locator('input[accept*=".phoenix-material.json"]');
  await packageInput.setInputFiles({
    name: "example-gradient-descent.phoenix-material.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(sampleJson)),
  });
  await page.getByRole("button", { name: "確認匯入教材" }).click();
  await page.getByRole("button", { name: "閱讀" }).click();
  await page.getByLabel("梯度到底指哪裡？進度").fill("100");
  await page.getByRole("button", { name: "戰場" }).click();
  await expect(page.getByTestId("battlefield-animation-status")).toContainText("章節完成，據點已固守");
  await page.getByRole("button", { name: "跳過目前動畫" }).click();
  await page.goto("/achievements");
  await expect(page.getByRole("heading", { name: "戰役成就庫" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "據點收復" })).toBeVisible();
  await expect(page.getByText(/解鎖於/).first()).toBeVisible();
});

test("serves the criminal rose legacy prototype with its local assets", async ({ page }) => {
  await page.goto("/legacy/criminal-law-general-principles/");
  await expect(page).toHaveTitle("罪責之骨｜刑法總則上課系統");
  await expect(page.getByRole("heading", { name: "罪責之骨" })).toBeVisible();
  await expect(page.locator("img").first()).toBeVisible();
});
