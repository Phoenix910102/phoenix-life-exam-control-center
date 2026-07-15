import { NextResponse } from "next/server";
import { z } from "zod";
import { guardApiToken } from "@/lib/helel/auth";
import { getGitHubMaterialsConfig, loadRemoteMaterialCatalog } from "@/lib/materials/githubRemote";
import { getMaterialImportStatus } from "@/lib/materials/packageImporter";

export const runtime = "nodejs";

const syncRequestSchema = z.object({
  paths: z.array(z.string().min(1)).min(1),
  localMaterials: z.array(z.object({ slug: z.string().min(1), version: z.string().min(1) })).default([]),
});

export async function POST(request: Request) {
  const blocked = guardApiToken(request);
  if (blocked) return blocked;

  const config = getGitHubMaterialsConfig();
  if (!config.token) {
    return NextResponse.json(
      { configured: false, message: "尚未設定 GITHUB_MATERIALS_TOKEN，遠端教材不會寫入本機。" },
      { status: 503 },
    );
  }

  const body = syncRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ message: "同步參數不合法", issues: body.error.issues }, { status: 400 });
  }

  try {
    const catalog = await loadRemoteMaterialCatalog(config);
    const requested = new Set(body.data.paths);
    const localBySlug = new Map(body.data.localMaterials.map((item) => [item.slug, item]));
    const items = catalog.items
      .filter((item) => requested.has(item.path))
      .map((item) => ({
        ...item,
        status: getMaterialImportStatus(item.package, localBySlug.get(item.package.slug)),
      }));
    const missingPaths = body.data.paths.filter((path) => !items.some((item) => item.path === path));
    if (missingPaths.length > 0) {
      return NextResponse.json(
        { message: "部分教材不存在或未通過 schema 驗證", missingPaths, invalidItems: catalog.invalidItems },
        { status: 422 },
      );
    }
    return NextResponse.json({ configured: true, items, invalidItems: catalog.invalidItems });
  } catch (error) {
    return NextResponse.json(
      { configured: true, message: error instanceof Error ? error.message : "GitHub 教材同步失敗" },
      { status: 502 },
    );
  }
}
