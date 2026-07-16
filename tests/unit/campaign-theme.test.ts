import { beforeEach, describe, expect, it } from "vitest";
import { campaignReadingPalettes } from "@/components/campaign/theme/campaign-theme.types";
import { contrastRatio } from "@/lib/accessibility/contrast";
import { db } from "@/lib/db/client";
import { getSettings, upsertSettings } from "@/lib/db/repository";
import { defaultSettings, type AppSettings } from "@/types/settings";

describe("campaign reading themes", () => {
  beforeEach(async () => {
    await db.settings.clear();
  });

  it("keeps the selected reading mode in the shared application settings", async () => {
    await upsertSettings({ campaign: { readingMode: "night" } });
    await expect(getSettings()).resolves.toMatchObject({ campaign: { readingMode: "night" } });
  });

  it("fills the reading preference for settings created before campaign themes", async () => {
    const legacySettings = structuredClone(defaultSettings) as unknown as Record<string, unknown>;
    delete legacySettings.campaign;
    await db.settings.put(legacySettings as AppSettings);
    await expect(getSettings()).resolves.toMatchObject({ campaign: { readingMode: "reading" } });
  });

  it.each(Object.entries(campaignReadingPalettes))(
    "%s mode keeps body and secondary text at WCAG AA contrast",
    (_mode, palette) => {
      expect(contrastRatio(palette.text, palette.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(palette.muted, palette.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(palette.text, palette.tableHeader)).toBeGreaterThanOrEqual(4.5);
    },
  );
});
