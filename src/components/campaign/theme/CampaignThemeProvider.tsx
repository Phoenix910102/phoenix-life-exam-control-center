"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getSettings, upsertSettings } from "@/lib/db/repository";
import type { MaterialPresentation } from "@/lib/materials/presentation";
import type { CampaignReadingMode, CampaignThemePreference } from "./campaign-theme.types";

type CampaignThemeContextValue = CampaignThemePreference & {
  hydrated: boolean;
  setMode: (mode: CampaignReadingMode) => void;
};

const CampaignThemeContext = createContext<CampaignThemeContextValue | null>(null);

export function CampaignThemeProvider({
  children,
  presentation,
}: {
  children: ReactNode;
  presentation: MaterialPresentation;
}) {
  const availableModes = useMemo(
    () => presentation.availableModes?.length > 0
      ? presentation.availableModes
      : (["reading", "immersive", "night"] as CampaignReadingMode[]),
    [presentation.availableModes],
  );
  const defaultMode = availableModes.includes(presentation.defaultMode)
    ? presentation.defaultMode
    : (availableModes[0] ?? "reading");
  const [mode, setModeState] = useState<CampaignReadingMode>(defaultMode);
  const [hydrated, setHydrated] = useState(false);
  const userSelectedMode = useRef(false);

  useEffect(() => {
    let active = true;
    getSettings()
      .then((settings) => {
        if (!active) return;
        const savedMode = settings.campaign.readingMode;
        if (!userSelectedMode.current) {
          setModeState(availableModes.includes(savedMode) ? savedMode : defaultMode);
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, [availableModes, defaultMode]);

  const setMode = useCallback((nextMode: CampaignReadingMode) => {
    if (!availableModes.includes(nextMode)) return;
    userSelectedMode.current = true;
    setModeState(nextMode);
    void upsertSettings({ campaign: { readingMode: nextMode } });
  }, [availableModes]);

  const value = useMemo<CampaignThemeContextValue>(() => ({
    mode,
    hydrated,
    setMode,
    availableModes,
    shellTheme: presentation.shellTheme ?? presentation.theme ?? "criminal-rose",
    readingTheme: presentation.readingTheme ?? "ivory-archive",
  }), [availableModes, hydrated, mode, presentation.readingTheme, presentation.shellTheme, presentation.theme, setMode]);

  return (
    <CampaignThemeContext.Provider value={value}>
      <div
        className="campaign-theme-root"
        data-campaign-mode={mode}
        data-reading-theme={value.readingTheme}
        data-shell-theme={value.shellTheme}
        data-theme-hydrated={hydrated ? "true" : "false"}
      >
        {children}
      </div>
    </CampaignThemeContext.Provider>
  );
}

export function useCampaignTheme() {
  const context = useContext(CampaignThemeContext);
  if (!context) throw new Error("useCampaignTheme 必須在 CampaignThemeProvider 內使用");
  return context;
}
