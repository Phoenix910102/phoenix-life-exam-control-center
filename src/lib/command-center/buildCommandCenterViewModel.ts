import type { CommandCenterViewModel } from "@/components/command-center/types";
import { db } from "@/lib/db/client";
import { mockCommandCenterData } from "./mockCommandCenterData";

export async function buildCommandCenterViewModel(): Promise<CommandCenterViewModel> {
  if (typeof window === "undefined") return mockCommandCenterData;

  const [progressRows, unlockedAchievements, care] = await Promise.all([
    db.materialProgress.toArray(),
    db.achievements.toArray(),
    db.careState.get("singleton"),
  ]);

  const activeProgress = [...progressRows].sort((left, right) => {
    if (left.isActive !== right.isActive) return left.isActive ? -1 : 1;
    return (right.lastOpenedAt ?? "").localeCompare(left.lastOpenedAt ?? "");
  })[0];
  const definition = activeProgress
    ? await db.materialDefinitions.get(activeProgress.materialSlug)
    : undefined;
  const activeChapter = definition?.chapters.find(
    (chapter) => chapter.key === activeProgress?.activeChapterKey,
  ) ?? definition?.chapters.find(
    (chapter) => (activeProgress?.chapterProgress[chapter.key] ?? 0) < 100,
  ) ?? definition?.chapters[0];

  const completedChapters = progressRows.reduce(
    (total, progress) => total + progress.completedChapterKeys.length,
    0,
  );
  const quizAttempts = progressRows.reduce(
    (total, progress) => total + progress.quizAttempts.length,
    0,
  );
  const studyPoints = Math.max(
    mockCommandCenterData.currency.studyPoints,
    760 + completedChapters * 80 + quizAttempts * 8,
  );
  const bondPoints = Math.max(
    mockCommandCenterData.currency.bondPoints,
    280 + unlockedAchievements.length * 30 + (care?.hydration.countToday ?? 0) * 5,
  );
  const bondLevel = Math.min(5, Math.max(1, Math.floor(bondPoints / 300) + 1));
  const bondProgress = Math.round(((bondPoints % 300) / 300) * 100);
  const missionProgress = activeChapter
    ? activeProgress?.chapterProgress[activeChapter.key] ?? 0
    : mockCommandCenterData.mission.progress;
  const rewardTarget = 1200;
  const rewardRemaining = Math.max(0, rewardTarget - studyPoints);
  const now = Date.now();
  const resting = Boolean(care?.rest.restUntil && new Date(care.rest.restUntil).getTime() > now);
  const hydrationDue = Boolean(
    care?.hydration.nextReminderAt && new Date(care.hydration.nextReminderAt).getTime() <= now,
  );

  return {
    user: mockCommandCenterData.user,
    currency: {
      studyPoints,
      bondPoints,
      bondLevel,
      bondProgress,
    },
    mission: activeChapter
      ? {
          id: `${definition?.slug ?? "material"}:${activeChapter.key}`,
          title: `穩住「${activeChapter.title}」的核心防線`,
          description: activeChapter.summary || "完成目前章節的最小學習任務，不必開啟新戰線。",
          materialSlug: definition?.slug,
          chapterKey: activeChapter.key,
          progress: missionProgress,
          rewardSP: 80,
          rewardBP: 15,
        }
      : mockCommandCenterData.mission,
    upcomingReward: {
      ...mockCommandCenterData.upcomingReward,
      progress: Math.min(100, Math.round((studyPoints / rewardTarget) * 100)),
      remainingText: rewardRemaining === 0 ? "已取得軍需庫購買資格" : `距離購買尚差 ${rewardRemaining} SP`,
    },
    characterState: resting
      ? "resting"
      : hydrationDue
        ? "care-warning"
        : missionProgress >= 80
          ? "reward-near"
          : "mission-focus",
    care: {
      hydrationDue,
      resting,
    },
    stats: {
      securedChapters: completedChapters,
      activeMaterialTitle: definition?.title ?? mockCommandCenterData.stats.activeMaterialTitle,
    },
  };
}
