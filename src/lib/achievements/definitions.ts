import type { AchievementCategory, AchievementTier } from "@/types/achievement";

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: "spark" | "sword" | "shield" | "crown" | "rose" | "water" | "task" | "exam" | "game";
  target: number;
  unit: string;
  hidden?: boolean;
};

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "first_material_step",
    title: "前線點火",
    description: "第一次推進 Phoenix 教材章節。",
    category: "conquest",
    tier: "bronze",
    icon: "spark",
    target: 1,
    unit: "次",
  },
  {
    id: "chapter_conqueror",
    title: "據點收復",
    description: "完整掌握一個章節區域。",
    category: "conquest",
    tier: "silver",
    icon: "sword",
    target: 1,
    unit: "章",
  },
  {
    id: "frontline_commander",
    title: "前線指揮官",
    description: "完成三個章節，建立可持續推進的主線。",
    category: "conquest",
    tier: "gold",
    icon: "crown",
    target: 3,
    unit: "章",
  },
  {
    id: "steady_defense",
    title: "防線成形",
    description: "任一教材整體控制率達到 60%。",
    category: "stability",
    tier: "silver",
    icon: "shield",
    target: 60,
    unit: "%",
  },
  {
    id: "zero_waver",
    title: "零動搖",
    description: "教材測驗連續答對五題。",
    category: "stability",
    tier: "gold",
    icon: "shield",
    target: 5,
    unit: "題",
  },
  {
    id: "rose_recovery",
    title: "失地收復",
    description: "同一章曾經答錯，之後再以正確答案奪回。",
    category: "recovery",
    tier: "gold",
    icon: "rose",
    target: 1,
    unit: "區",
  },
  {
    id: "material_mastered",
    title: "主線歸檔",
    description: "完整完成一份教材的所有章節。",
    category: "style",
    tier: "obsidian",
    icon: "crown",
    target: 100,
    unit: "%",
  },
  {
    id: "supply_discipline",
    title: "補給紀律",
    description: "同一天喝水兩次並完成一次吃飯紀錄。",
    category: "care",
    tier: "silver",
    icon: "water",
    target: 1,
    unit: "組",
  },
  {
    id: "first_task_done",
    title: "第一道命令",
    description: "完成第一個生活任務。",
    category: "foundation",
    tier: "bronze",
    icon: "task",
    target: 1,
    unit: "項",
  },
  {
    id: "first_exam_attempt",
    title: "首次迎戰",
    description: "完成第一場考試作答。",
    category: "foundation",
    tier: "bronze",
    icon: "exam",
    target: 1,
    unit: "場",
  },
  {
    id: "first_game_session",
    title: "訓練場啟用",
    description: "完成第一場訓練遊戲。",
    category: "foundation",
    tier: "bronze",
    icon: "game",
    target: 1,
    unit: "場",
  },
];
