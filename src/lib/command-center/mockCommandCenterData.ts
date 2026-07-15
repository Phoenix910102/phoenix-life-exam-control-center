import type { CommandCenterViewModel } from "@/components/command-center/types";

export const mockCommandCenterData: CommandCenterViewModel = {
  user: {
    displayName: "Phoenix",
  },
  currency: {
    studyPoints: 1020,
    bondPoints: 460,
    bondLevel: 3,
    bondProgress: 64,
  },
  mission: {
    id: "hold-gradient-line",
    title: "穩住梯度、反向傳播與最佳化器的角色分類",
    description: "完成一組比較題。今天不擴張戰線，只把這個區域守穩。",
    progress: 68,
    rewardSP: 80,
    rewardBP: 15,
  },
  upcomingReward: {
    id: "night-commander",
    title: "Night Commander",
    category: "Rékaí · 指揮服",
    progress: 85,
    remainingText: "距離購買尚差 180 SP",
  },
  characterState: "mission-focus",
  care: {
    hydrationDue: false,
    resting: false,
  },
  stats: {
    securedChapters: 2,
    activeMaterialTitle: "梯度下降：梯度指上坡，模型走下坡",
  },
};
