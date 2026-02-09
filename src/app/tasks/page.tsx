"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/db/useStore";
import { updateTask } from "@/lib/db/repository";

export default function TasksPage() {
  const { tasks, refreshTasks } = useAppStore();

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between rounded border border-border p-2">
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-muted-foreground">{task.category} / {task.importance}</p>
          </div>
          <Button
            size="sm"
            variant={task.done ? "outline" : "default"}
            onClick={async () => {
              await updateTask(task.id, { done: !task.done, doneAt: !task.done ? new Date().toISOString() : undefined });
              await refreshTasks();
            }}
          >
            {task.done ? "Undo" : "Done"}
          </Button>
        </div>
      ))}
      {tasks.length === 0 && <p className="text-sm">No tasks yet. Add from /console.</p>}
    </Card>
  );
}
