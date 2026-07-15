export type CommandCharacterState =
  | "idle"
  | "mission-focus"
  | "reward-near"
  | "care-warning"
  | "resting";

export type CommandCenterViewModel = {
  user: {
    displayName: string;
  };
  currency: {
    studyPoints: number;
    bondPoints: number;
    bondLevel: number;
    bondProgress: number;
  };
  mission: {
    id: string;
    title: string;
    description: string;
    materialSlug?: string;
    chapterKey?: string;
    progress: number;
    rewardSP?: number;
    rewardBP?: number;
  };
  upcomingReward: {
    id: string;
    title: string;
    category: string;
    progress: number;
    remainingText: string;
  };
  characterState: CommandCharacterState;
  care: {
    hydrationDue: boolean;
    resting: boolean;
  };
  stats: {
    securedChapters: number;
    activeMaterialTitle: string;
  };
};

export type CommandSceneMode = "layered-art" | "three-dimensional";
