import { LockKeyhole, Sparkles } from "lucide-react";
import type { CommandCenterViewModel } from "./types";
import styles from "./command-center.module.css";

type UpcomingRewardProps = {
  reward: CommandCenterViewModel["upcomingReward"];
};

export function UpcomingReward({ reward }: UpcomingRewardProps) {
  return (
    <aside className={styles.reward} aria-labelledby="upcoming-reward-title" data-testid="upcoming-reward">
      <div className={styles.rewardSeal} aria-hidden="true">
        <Sparkles size={18} />
        <LockKeyhole size={23} />
      </div>
      <div>
        <p>NEXT ACCESS</p>
        <h2 id="upcoming-reward-title">{reward.title}</h2>
        <span>{reward.category}</span>
      </div>
      <div className={styles.rewardProgress}>
        <i><b style={{ width: `${reward.progress}%` }} /></i>
        <strong>{reward.progress}%</strong>
      </div>
      <small>{reward.remainingText}</small>
    </aside>
  );
}
