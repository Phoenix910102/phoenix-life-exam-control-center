import type { MaterialDefinition } from "@/types/materialRecord";

export type BattlefieldTheme = {
  background: string;
  fog: string;
  terrain: string;
  grid: string;
  zone: Record<"fog" | "frontline" | "critical" | "secured", string>;
  allied: string;
  enemy: string;
  neutral: string;
  supply: string;
  active: string;
};

type MaterialThemeName = NonNullable<MaterialDefinition["presentation"]>["theme"];

const criminalRose: BattlefieldTheme = {
  background: "#09080a",
  fog: "#181319",
  terrain: "#171216",
  grid: "#4b383b",
  zone: { fog: "#29232a", frontline: "#55412f", critical: "#651f32", secured: "#69533b" },
  allied: "#d9b978",
  enemy: "#d1415c",
  neutral: "#83757b",
  supply: "#79a8ad",
  active: "#f0d8a4",
};

const neuralRose: BattlefieldTheme = {
  background: "#080810",
  fog: "#141323",
  terrain: "#12111f",
  grid: "#373158",
  zone: { fog: "#242339", frontline: "#493d68", critical: "#70284f", secured: "#5b516f" },
  allied: "#d9bd79",
  enemy: "#d05286",
  neutral: "#77708f",
  supply: "#80b6c8",
  active: "#e8d7a7",
};

const cipherRose: BattlefieldTheme = {
  background: "#06100f",
  fog: "#0f1c1b",
  terrain: "#0d1b1a",
  grid: "#28534e",
  zone: { fog: "#1c2b2a", frontline: "#315e58", critical: "#672438", secured: "#3e665a" },
  allied: "#d7b96d",
  enemy: "#d64a60",
  neutral: "#66817e",
  supply: "#6fc9bd",
  active: "#e7d49b",
};

const commandRose: BattlefieldTheme = {
  background: "#0b0d09",
  fog: "#171a13",
  terrain: "#171a12",
  grid: "#4d5133",
  zone: { fog: "#292c24", frontline: "#5a5736", critical: "#612c2f", secured: "#626044" },
  allied: "#d5b66d",
  enemy: "#c64c50",
  neutral: "#7e816d",
  supply: "#8cab88",
  active: "#e7d39a",
};

export function getBattlefieldTheme(theme?: MaterialThemeName): BattlefieldTheme {
  if (theme === "neural-rose") return neuralRose;
  if (theme === "cipher-rose") return cipherRose;
  if (theme === "command-rose") return commandRose;
  if (theme === "black-dossier") return { ...criminalRose, background: "#050607", terrain: "#101113" };
  return criminalRose;
}
