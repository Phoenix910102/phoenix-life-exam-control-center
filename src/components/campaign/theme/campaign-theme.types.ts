export const campaignReadingModeValues = ["reading", "immersive", "night"] as const;
export type CampaignReadingMode = (typeof campaignReadingModeValues)[number];

export const campaignReadingThemeValues = ["ivory-archive"] as const;
export type CampaignReadingTheme = (typeof campaignReadingThemeValues)[number];

export const campaignSurfaceModuleValues = [
  "battlefield",
  "roadmap",
  "reader",
  "lesson",
  "duel",
  "diagnostic",
  "trap-field",
  "quiz",
] as const;
export type CampaignSurfaceModule = (typeof campaignSurfaceModuleValues)[number];

export const campaignModuleSurfaceValues = [
  "immersive-dark",
  "rose-parchment",
  "rose-dossier",
  "night-manuscript",
  "adaptive",
] as const;
export type CampaignModuleSurface = (typeof campaignModuleSurfaceValues)[number];
export type ResolvedCampaignModuleSurface = Exclude<CampaignModuleSurface, "adaptive">;
export type CampaignModuleSurfaceMap = Partial<Record<CampaignSurfaceModule, CampaignModuleSurface>>;

export const defaultCampaignModuleSurfaces: Required<CampaignModuleSurfaceMap> = {
  battlefield: "immersive-dark",
  roadmap: "immersive-dark",
  reader: "rose-parchment",
  lesson: "rose-parchment",
  duel: "immersive-dark",
  diagnostic: "immersive-dark",
  "trap-field": "rose-dossier",
  quiz: "adaptive",
};

export function resolveCampaignModuleSurface(
  module: CampaignSurfaceModule,
  readingMode: CampaignReadingMode,
  configured?: CampaignModuleSurfaceMap,
): ResolvedCampaignModuleSurface {
  const requested = configured?.[module] ?? defaultCampaignModuleSurfaces[module];

  if (readingMode === "night" && (requested === "rose-parchment" || requested === "adaptive")) {
    return "night-manuscript";
  }
  if (requested === "adaptive") {
    return readingMode === "immersive" ? "immersive-dark" : "rose-parchment";
  }
  return requested;
}

export type CampaignThemePreference = {
  mode: CampaignReadingMode;
  shellTheme: string;
  readingTheme: CampaignReadingTheme;
  availableModes: CampaignReadingMode[];
};

export const campaignReadingPalettes = {
  reading: {
    surface: "#fffaf0",
    text: "#2b2622",
    muted: "#645b53",
    tableHeader: "#eee1cf",
  },
  immersive: {
    surface: "#f4eddf",
    text: "#2c2521",
    muted: "#6b5e55",
    tableHeader: "#e5d4b9",
  },
  night: {
    surface: "#25211e",
    text: "#d8cfc3",
    muted: "#aaa095",
    tableHeader: "#332d29",
  },
} as const satisfies Record<CampaignReadingMode, Record<string, string>>;
