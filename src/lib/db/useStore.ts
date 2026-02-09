"use client";

import { create } from "zustand";
import type { Task } from "@/types/task";
import type { Question } from "@/types/question";
import type { AppSettings } from "@/types/settings";
import { addTask, bulkUpsertQuestions, getSettings, listQuestions, listTasks, upsertSettings } from "./repository";

type AppState = {
  tasks: Task[];
  questions: Question[];
  settings: AppSettings | null;
  refreshTasks: () => Promise<void>;
  addTaskLocal: (task: Task) => Promise<void>;
  refreshQuestions: () => Promise<void>;
  addQuestionsLocal: (q: Question[]) => Promise<void>;
  loadSettings: () => Promise<void>;
  saveSettings: (patch: Partial<AppSettings>) => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  tasks: [],
  questions: [],
  settings: null,
  refreshTasks: async () => {
    const tasks = await listTasks();
    set({ tasks });
  },
  addTaskLocal: async (task) => {
    await addTask(task);
    const tasks = await listTasks();
    set({ tasks });
  },
  refreshQuestions: async () => {
    set({ questions: await listQuestions() });
  },
  addQuestionsLocal: async (q) => {
    await bulkUpsertQuestions(q);
    set({ questions: await listQuestions() });
  },
  loadSettings: async () => {
    set({ settings: await getSettings() });
  },
  saveSettings: async (patch) => {
    const settings = await upsertSettings(patch);
    set({ settings });
  },
}));
