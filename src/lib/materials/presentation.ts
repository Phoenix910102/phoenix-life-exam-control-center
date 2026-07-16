import type { MaterialDefinition } from "@/types/materialRecord";
import { defaultCampaignModuleSurfaces } from "@/components/campaign/theme/campaign-theme.types";

export type MaterialPresentation = NonNullable<MaterialDefinition["presentation"]>;

export const defaultPhoenixMaterialPresentation: MaterialPresentation = {
  layout: "immersive-academy",
  theme: "criminal-rose",
  shellTheme: "criminal-rose",
  readingTheme: "ivory-archive",
  defaultMode: "reading",
  availableModes: ["reading", "immersive", "night"],
  moduleSurfaces: { ...defaultCampaignModuleSurfaces },
  renderOrder: "authored",
  modules: [
    "home",
    "battlefield",
    "roadmap",
    "reader",
    "lesson",
    "duel",
    "diagnostic",
    "trap-field",
    "quiz",
    "glossary",
    "question-bank",
    "source-library",
    "quick-review",
    "achievements",
    "floating-console",
  ],
};

export function normalizeMaterialPresentation(
  presentation?: MaterialDefinition["presentation"],
): MaterialPresentation {
  if (!presentation) return { ...defaultPhoenixMaterialPresentation };
  return {
    ...defaultPhoenixMaterialPresentation,
    ...presentation,
    shellTheme: presentation.shellTheme ?? presentation.theme ?? "criminal-rose",
    readingTheme: presentation.readingTheme ?? "ivory-archive",
    defaultMode: presentation.defaultMode ?? "reading",
    availableModes: presentation.availableModes?.length > 0
      ? presentation.availableModes
      : defaultPhoenixMaterialPresentation.availableModes,
    moduleSurfaces: {
      ...defaultCampaignModuleSurfaces,
      ...presentation.moduleSurfaces,
    },
    modules: presentation.modules?.length > 0
      ? presentation.modules
      : defaultPhoenixMaterialPresentation.modules,
  };
}
