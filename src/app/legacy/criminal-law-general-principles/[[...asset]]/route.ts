import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const LEGACY_ROOT = path.resolve(process.cwd(), "materials", "legacy");

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ asset?: string[] }> },
) {
  const { asset = [] } = await context.params;
  const relativePath = asset.length > 0 ? asset.join("/") : "criminal-law-general-principles.html";
  const filePath = path.resolve(LEGACY_ROOT, relativePath);
  if (filePath !== LEGACY_ROOT && !filePath.startsWith(`${LEGACY_ROOT}${path.sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const extension = path.extname(filePath).toLowerCase();
    let body: BodyInit = await readFile(filePath);
    if (extension === ".html") {
      const html = body.toString().replace(
        "<head>",
        '<head><base href="/legacy/criminal-law-general-principles/">',
      );
      body = html;
    }
    return new NextResponse(body, {
      headers: {
        "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=86400",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline';",
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
