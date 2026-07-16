import type { MaterialDefinition } from "@/types/materialRecord";

export type MaterialPresentation = NonNullable<MaterialDefinition["presentation"]>;

export const defaultPhoenixMaterialPresentation: MaterialPresentation = {
  layout: "immersive-academy",
  theme: "criminal-rose",
  renderOrder: "authored",
  modules: [
    "battlefield",
    "roadmap",
    "reader",
    "lesson",
    "duel",
    "diagnostic",
    "trap-field",
    "quiz",
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
    modules: presentation.modules?.length > 0
      ? presentation.modules
      : defaultPhoenixMaterialPresentation.modules,
  };
}
