export type ZoneLayoutMode = "curved-front" | "grid" | "radial" | "custom";

export type ZonePlacement = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateZoneLayout(count: number, mode: ZoneLayoutMode, seed: string): ZonePlacement[] {
  if (count <= 0) return [];
  const random = seededRandom(`${seed}:${mode}:${count}`);

  if (mode === "radial") {
    const radius = Math.max(4.8, count * 0.9);
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
      return {
        position: [Math.cos(angle) * radius, random() * 0.18, Math.sin(angle) * radius],
        rotation: [0, -angle + (random() - 0.5) * 0.12, 0],
        scale: 0.94 + random() * 0.12,
      };
    });
  }

  const columns = mode === "grid"
    ? Math.ceil(Math.sqrt(count))
    : Math.min(4, Math.max(2, Math.ceil(Math.sqrt(count * 1.35))));
  const rows = Math.ceil(count / columns);
  const spacingX = 4.4;
  const spacingZ = 3.9;

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = (column - (columns - 1) / 2) * spacingX;
    const baseZ = (row - (rows - 1) / 2) * spacingZ;
    const curve = mode === "curved-front" || mode === "custom" ? Math.sin(column * 1.1) * 1.05 : 0;
    return {
      position: [x, random() * 0.16, baseZ + curve],
      rotation: [0, (random() - 0.5) * 0.18, 0],
      scale: 0.94 + random() * 0.12,
    };
  });
}
