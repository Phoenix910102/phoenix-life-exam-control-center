import { NextResponse } from "next/server";
import { taskSchema } from "@/types/task";
import { newId } from "@/lib/utils/id";
import { guardApiToken } from "@/lib/helel/auth";
import { ingestTaskSchema } from "@/lib/helel/ingestSchemas";

export async function POST(req: Request) {
  const blocked = guardApiToken(req);
  if (blocked) return blocked;

  try {
    const body = ingestTaskSchema.parse(await req.json());
    const dueTime = body.dueTime ? new Date(body.dueTime).toISOString() : null;

    const task = taskSchema.parse({
      id: newId("task"),
      title: body.title,
      category: body.category,
      dueTime: dueTime && !Number.isNaN(Date.parse(dueTime)) ? dueTime : null,
      importance: body.importance,
      escalationProfile: body.escalationProfile,
      intensity: body.intensity,
      done: false,
    });

    let helel: unknown = null;
    if (body.withHelelLine) {
      const url = new URL("/api/helel", req.url);
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-token": req.headers.get("x-app-token") ?? "",
        },
        body: JSON.stringify({
          trigger: "task_publish",
          intensity: task.intensity,
          model: body.model ?? null,
          userStateSummary: `新任務：${task.title}`,
        }),
      });
      if (resp.ok) helel = await resp.json();
    }

    return NextResponse.json({ task, helel });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 },
    );
  }
}
