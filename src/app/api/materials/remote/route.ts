import { NextResponse } from "next/server";
import { guardApiToken } from "@/lib/helel/auth";
import { getGitHubMaterialsConfig, loadRemoteMaterialCatalog } from "@/lib/materials/githubRemote";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const blocked = guardApiToken(request);
  if (blocked) return blocked;

  const config = getGitHubMaterialsConfig();
  if (!config.token) {
    return NextResponse.json(
      {
        configured: false,
        message: "尚未設定 GITHUB_MATERIALS_TOKEN。請在 .env.local 設定 server-only GitHub Token。",
        defaults: { repo: config.repo, branch: config.branch, path: config.path },
      },
      { status: 503 },
    );
  }

  try {
    const catalog = await loadRemoteMaterialCatalog(config);
    return NextResponse.json({
      configured: true,
      source: { repo: config.repo, branch: config.branch, path: config.path },
      ...catalog,
    });
  } catch (error) {
    return NextResponse.json(
      { configured: true, message: error instanceof Error ? error.message : "GitHub 教材收件匣同步失敗" },
      { status: 502 },
    );
  }
}
