import { NextResponse } from "next/server";

export function guardApiToken(req: Request) {
  const token = process.env.APP_TOKEN;
  if (!token) return null;
  const headerToken = req.headers.get("x-app-token");
  if (headerToken !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
