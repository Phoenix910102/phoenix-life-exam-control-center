export const campaignReadingModeValues = ["reading", "immersive", "night"] as const;
export type CampaignReadingMode = (typeof campaignReadingModeValues)[number];

export const campaignReadingThemeValues = ["ivory-archive"] as const;
export type CampaignReadingTheme = (typeof campaignReadingThemeValues)[number];

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
