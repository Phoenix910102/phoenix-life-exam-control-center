import { getMaterialBundle, importPhoenixMaterialPackage, openMaterialCampaign } from "@/lib/db/repository";
import { getMaterialImportStatus, parseMaterialPackage } from "@/lib/materials/packageImporter";
import { apiHeaders } from "@/lib/utils/api";

type BundledMaterialSource = {
  endpoint: string;
  fileName: string;
};

const bundledMaterialSources: Record<string, BundledMaterialSource> = {
  "aiap-intermediate-complete-guide": {
    endpoint: "/api/materials/aiap",
    fileName: "aiap-intermediate-complete-guide.phoenix-material.json",
  },
};

const pendingCampaignInstalls = new Map<string, ReturnType<typeof openMaterialCampaign>>();

export function hasBundledMaterialSource(slug: string) {
  return slug in bundledMaterialSources;
}

async function installAndOpenBundledCampaign(slug: string) {
  const source = bundledMaterialSources[slug];
  if (!source) return undefined;

  const response = await fetch(source.endpoint, { headers: apiHeaders() });
  const body = await response.json() as { fileName?: string; package?: unknown; message?: string };
  if (!response.ok) throw new Error(body.message ?? "內建教材來源讀取失敗");

  const parsed = parseMaterialPackage(body.package);
  if (!parsed.success) throw new Error("內建教材沒有通過 Phoenix 教材協議驗證");

  const existing = await getMaterialBundle(slug);
  const status = getMaterialImportStatus(parsed.package, existing?.definition);
  if (status === "new" || status === "upgrade") {
    await importPhoenixMaterialPackage(parsed.package, body.fileName ?? source.fileName);
  }
  return openMaterialCampaign(slug);
}

export async function openCampaignWithBundledSource(slug: string) {
  if (!hasBundledMaterialSource(slug)) return openMaterialCampaign(slug);

  const pending = pendingCampaignInstalls.get(slug);
  if (pending) return pending;

  const installation = installAndOpenBundledCampaign(slug).finally(() => {
    pendingCampaignInstalls.delete(slug);
  });
  pendingCampaignInstalls.set(slug, installation);
  return installation;
}
