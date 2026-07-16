import { expect, test, type Page } from "@playwright/test";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";

const campaignUrl = `/campaigns/${sampleJson.slug}`;

async function importSampleCampaign(page: Page) {
  await page.goto("/materials");
  await expect(page.getByTestId("materials-page")).toHaveAttribute("data-hydrated", "true");
  await page.locator('input[accept*=".phoenix-material.json"]').setInputFiles({
    name: "example-gradient-descent.phoenix-material.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(sampleJson)),
  });
  await page.getByRole("button", { name: "確認匯入教材" }).click();
  const continueButton = page.getByRole("button", { name: "繼續戰役" });
  await expect(continueButton).toBeEnabled();
  await Promise.all([
    page.waitForURL(new RegExp(`${campaignUrl}$`), { timeout: 15_000 }),
    continueButton.click(),
  ]);
  await expect(page.locator('[data-theme-hydrated="true"]')).toBeVisible();
}

async function selectReadingMode(page: Page, name: "紙本閱讀" | "沉浸" | "夜讀") {
  const button = page.getByTestId("campaign-mode-toggle").getByRole("button", { name });
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
}

async function reloadAtCampaignTop(page: Page, modeLabel: "紙本閱讀" | "沉浸" | "夜讀") {
  await page.goto(campaignUrl);
  await expect(page.getByTestId("campaign-experience")).toBeVisible();
  await expect(page.locator('[data-theme-hydrated="true"]')).toBeVisible();
  await expect(page.getByTestId("campaign-mode-toggle").getByRole("button", { name: modeLabel })).toHaveAttribute("aria-pressed", "true");
}

test("shares reading preference and keeps AIAP-style search and classification controls", async ({ page }) => {
  await importSampleCampaign(page);

  await expect(page.getByTestId("campaign-reading-surface")).toBeVisible();
  await expect(page.locator('[data-module="reader"]')).toHaveAttribute("data-module-surface", "rose-parchment");
  await expect(page.getByLabel("搜尋本章內容")).toBeVisible();
  await expect(page.getByLabel("篩選內容分類")).toBeVisible();

  await page.getByLabel("搜尋本章內容").fill("學習率");
  await expect(page.getByRole("heading", { name: "梯度是上坡指標，不是下坡命令" })).toBeVisible();
  await page.getByLabel("搜尋本章內容").fill("");
  await page.getByLabel("篩選內容分類").selectOption("memory");
  await expect(page.getByText("梯度舉牌指上坡，模型看到負號才往下走。", { exact: true })).toBeVisible();

  await selectReadingMode(page, "夜讀");
  await expect(page.locator('[data-campaign-mode="night"]')).toBeVisible();
  await expect(page.locator('[data-module="reader"]')).toHaveAttribute("data-module-surface", "night-manuscript");
  await page.reload();
  await expect(page.locator('[data-theme-hydrated="true"]')).toBeVisible();
  await expect(page.getByTestId("campaign-mode-toggle").getByRole("button", { name: "夜讀" })).toHaveAttribute("aria-pressed", "true");

  await selectReadingMode(page, "沉浸");
  await expect(page.getByRole("navigation", { name: "教材模式" })).toBeVisible();
  await page.getByRole("button", { name: "診斷" }).click();
  await expect(page.getByText("卡點診斷", { exact: true })).toBeVisible();
  await expect(page.locator('[data-module="diagnostic"]')).toHaveAttribute("data-module-surface", "immersive-dark");

  await page.getByRole("button", { name: "陷阱" }).click();
  await expect(page.locator('[data-module="trap-field"]')).toHaveAttribute("data-module-surface", "rose-dossier");

  await selectReadingMode(page, "紙本閱讀");
  await expect(page.getByTestId("campaign-reading-surface")).toBeVisible();
});

test("campaign reading themes match desktop and mobile visual baselines", async ({ page }) => {
  test.skip(process.platform !== "darwin", "視覺基準使用 Phoenix 的 macOS 字型與渲染環境");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await importSampleCampaign(page);
  await expect(page.getByText("Phoenix 教材已匯入")).toBeHidden({ timeout: 7_000 });
  await page.addStyleTag({ content: "[data-sonner-toaster] { display: none !important; }" });

  const modes = [
    ["紙本閱讀", "campaign-reading"],
    ["沉浸", "campaign-immersive"],
    ["夜讀", "campaign-night"],
  ] as const;

  for (const [label, filename] of modes) {
    await selectReadingMode(page, label);
    await reloadAtCampaignTop(page, label);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    await expect(page).toHaveScreenshot(`${filename}-desktop.png`, {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const [label, filename] of modes) {
    await selectReadingMode(page, label);
    await reloadAtCampaignTop(page, label);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    await expect(page).toHaveScreenshot(`${filename}-mobile.png`, {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }
});
