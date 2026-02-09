import { NextResponse } from "next/server";
import { guardApiToken } from "@/lib/helel/auth";
import { listAvailableModels } from "@/lib/helel/models";

export async function GET(req: Request) {
  const blocked = guardApiToken(req);
  if (blocked) return blocked;

  const models = await listAvailableModels();
  return NextResponse.json({ models });
}
