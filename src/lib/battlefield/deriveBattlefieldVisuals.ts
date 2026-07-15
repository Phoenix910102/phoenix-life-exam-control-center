import { deriveBattlefield, type BattlefieldState, type BattlefieldZone } from "@/lib/battlefield/deriveBattlefield";
import { generateZoneLayout, type ZoneLayoutMode } from "@/lib/battlefield/layoutSeed";
import type { MaterialDefinition, MaterialProgress } from "@/types/materialRecord";

export type BattlefieldBiome =
  | "black-stone"
  | "rose-earth"
  | "neural-grid"
  | "cipher-metal"
  | "command-sand";

export type BattlefieldVisualZone = BattlefieldZone & {
  worldPosition: [number, number, number];
  worldRotation: [number, number, number];
  worldScale: number;
  biome: BattlefieldBiome;
  alliedUnits: number;
  enemyUnits: number;
  heavyEnemyUnits: number;
  baseLevel: 0 | 1 | 2 | 3;
  defenseTowerCount: number;
  supplyOutpostCount: number;
  fogDensity: number;
  alertLevel: number;
  securedIntensity: number;
};

export type BattlefieldVisualState = Omit<BattlefieldState, "zones"> & {
  seed: string;
  mapBounds: { width: number; depth: number };
  zones: BattlefieldVisualZone[];
};

function mapRange(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number) {
  const ratio = Math.max(0, Math.min(1, (value - inputMin) / (inputMax - inputMin)));
  return outputMin + ratio * (outputMax - outputMin);
}

type MaterialThemeName = NonNullable<MaterialDefinition["presentation"]>["theme"];

function biomeForTheme(theme?: MaterialThemeName): BattlefieldBiome {
  if (theme === "neural-rose") return "neural-grid";
  if (theme === "cipher-rose") return "cipher-metal";
  if (theme === "command-rose") return "command-sand";
  if (theme === "criminal-rose" || theme === "jurist-rose") return "rose-earth";
  return "black-stone";
}

export function deriveBattlefieldVisuals(
  definition: MaterialDefinition,
  progress: MaterialProgress,
): BattlefieldVisualState {
  const battlefield = deriveBattlefield(definition, progress);
  const config = definition.presentation?.battlefield3d;
  const seed = config?.seed ?? `${definition.slug}:${definition.version}`;
  const layout = (config?.layout ?? "curved-front") as ZoneLayoutMode;
  const placements = generateZoneLayout(battlefield.zones.length, layout, seed);
  const biome = biomeForTheme(definition.presentation?.theme);

  const zones = battlefield.zones.map((zone, index): BattlefieldVisualZone => {
    const placement = placements[index];
    const hasIntel = zone.status !== "fog";
    return {
      ...zone,
      worldPosition: placement.position,
      worldRotation: placement.rotation,
      worldScale: placement.scale,
      biome,
      alliedUnits: hasIntel ? Math.round(mapRange(zone.defense, 0, 100, 2, 24)) : 0,
      enemyUnits: hasIntel ? Math.round(mapRange(zone.enemyStrength, 0, 100, 0, 28)) : 0,
      heavyEnemyUnits: zone.enemyStrength >= 70 ? 2 : zone.enemyStrength >= 45 ? 1 : 0,
      baseLevel: zone.progress >= 100 ? 3 : zone.progress >= 60 ? 2 : zone.progress > 0 ? 1 : 0,
      defenseTowerCount: hasIntel ? Math.min(3, Math.floor(zone.defense / 30)) : 0,
      supplyOutpostCount: Math.min(3, zone.supplyCount),
      fogDensity: zone.status === "fog" ? 1 : zone.status === "critical" ? 0.35 : 0.08,
      alertLevel: zone.status === "critical" ? zone.enemyStrength / 100 : 0,
      securedIntensity: zone.status === "secured" ? Math.max(0.4, zone.defense / 100) : 0,
    };
  });

  const maxX = Math.max(4, ...zones.map((zone) => Math.abs(zone.worldPosition[0]) + 2.2));
  const maxZ = Math.max(4, ...zones.map((zone) => Math.abs(zone.worldPosition[2]) + 2.2));

  return {
    ...battlefield,
    seed,
    mapBounds: { width: maxX * 2, depth: maxZ * 2 },
    zones,
  };
}
