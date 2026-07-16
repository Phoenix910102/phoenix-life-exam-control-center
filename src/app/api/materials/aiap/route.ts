import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { parseMaterialPackage } from "@/lib/materials/packageImporter";

export async function GET() {
  const fileName = "aiap-intermediate-complete-guide.phoenix-material.json";
  const filePath = path.join(process.cwd(), "materials", "generated", fileName);
  try {
    const parsed = parseMaterialPackage(await readFile(filePath, "utf8"));
    if (!parsed.success) {
      return NextResponse.json({ message: "AIAP 教材未通過教材協議驗證", errors: parsed.errors }, { status: 500 });
    }
    return NextResponse.json({ fileName, package: parsed.package });
  } catch {
    return NextResponse.json({ message: "AIAP 內建教材讀取失敗" }, { status: 500 });
  }
}
