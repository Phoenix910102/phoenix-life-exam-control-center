import { parseMaterialPackage, type MaterialValidationIssue } from "./packageImporter";
import type { MaterialPackage } from "@/types/materialPackage";

export type GitHubMaterialsConfig = {
  repo: string;
  branch: string;
  path: string;
  token: string;
};

export type RemoteMaterialItem = {
  name: string;
  path: string;
  sha: string;
  size: number;
  package: MaterialPackage;
};

export type InvalidRemoteMaterial = {
  name: string;
  path: string;
  errors: MaterialValidationIssue[];
};

type GitHubContentEntry = {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
};

type GitHubFileResponse = GitHubContentEntry & {
  content?: string;
  encoding?: string;
};

function githubHeaders(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "phoenix-life-exam-control-center",
  };
}

function contentsUrl(repo: string, path: string, branch: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
}

async function responseMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export function getGitHubMaterialsConfig(): GitHubMaterialsConfig {
  return {
    repo: process.env.GITHUB_MATERIALS_REPO || "Phoenix910102/phoenix-life-exam-control-center",
    branch: process.env.GITHUB_MATERIALS_BRANCH || "codex-progress",
    path: process.env.GITHUB_MATERIALS_PATH || "materials/generated",
    token: process.env.GITHUB_MATERIALS_TOKEN || "",
  };
}

export async function loadRemoteMaterialCatalog(
  config: GitHubMaterialsConfig,
  fetcher: typeof fetch = fetch,
): Promise<{ items: RemoteMaterialItem[]; invalidItems: InvalidRemoteMaterial[] }> {
  const directoryResponse = await fetcher(contentsUrl(config.repo, config.path, config.branch), {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });
  if (!directoryResponse.ok) {
    throw new Error(`GitHub 教材目錄讀取失敗：${await responseMessage(directoryResponse)}`);
  }
  const directory = (await directoryResponse.json()) as GitHubContentEntry[] | GitHubFileResponse;
  if (!Array.isArray(directory)) throw new Error("GITHUB_MATERIALS_PATH 必須指向 GitHub 目錄");

  const candidates = directory.filter(
    (entry) => entry.type === "file" && entry.name.toLowerCase().endsWith(".phoenix-material.json"),
  );
  const items: RemoteMaterialItem[] = [];
  const invalidItems: InvalidRemoteMaterial[] = [];

  for (const entry of candidates) {
    const fileResponse = await fetcher(contentsUrl(config.repo, entry.path, config.branch), {
      headers: githubHeaders(config.token),
      cache: "no-store",
    });
    if (!fileResponse.ok) {
      invalidItems.push({
        name: entry.name,
        path: entry.path,
        errors: [{ path: "remote", message: `檔案讀取失敗：${await responseMessage(fileResponse)}` }],
      });
      continue;
    }
    const file = (await fileResponse.json()) as GitHubFileResponse;
    if (file.encoding !== "base64" || !file.content) {
      invalidItems.push({
        name: entry.name,
        path: entry.path,
        errors: [{ path: "remote.content", message: "GitHub Contents API 未回傳 base64 內容" }],
      });
      continue;
    }
    const text = Buffer.from(file.content.replace(/\s/g, ""), "base64").toString("utf8");
    const parsed = parseMaterialPackage(text);
    if (!parsed.success) {
      invalidItems.push({ name: entry.name, path: entry.path, errors: parsed.errors });
      continue;
    }
    items.push({
      name: entry.name,
      path: entry.path,
      sha: entry.sha,
      size: entry.size,
      package: parsed.package,
    });
  }

  return { items, invalidItems };
}
