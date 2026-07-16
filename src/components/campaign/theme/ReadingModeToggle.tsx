"use client";

import { BookOpen, MoonStar, Sparkles, type LucideIcon } from "lucide-react";
import type { CampaignReadingMode } from "./campaign-theme.types";
import { useCampaignTheme } from "./CampaignThemeProvider";

const modeMeta: Record<CampaignReadingMode, { label: string; description: string; icon: LucideIcon }> = {
  reading: { label: "紙本閱讀", description: "暖白書頁與低干擾排版", icon: BookOpen },
  immersive: { label: "沉浸", description: "完整戰場與互動模組", icon: Sparkles },
  night: { label: "夜讀", description: "低刺激深褐閱讀", icon: MoonStar },
};

export function ReadingModeToggle() {
  const { availableModes, mode, setMode } = useCampaignTheme();

  return (
    <div className="campaign-mode-toggle" data-testid="campaign-mode-toggle" role="group" aria-label="教材閱讀主題">
      {availableModes.map((item) => {
        const { description, icon: Icon, label } = modeMeta[item];
        return (
          <button
            aria-pressed={mode === item}
            className="campaign-mode-toggle__button"
            data-active={mode === item ? "true" : "false"}
            key={item}
            onClick={() => setMode(item)}
            title={description}
            type="button"
          >
            <Icon aria-hidden="true" size={15} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
