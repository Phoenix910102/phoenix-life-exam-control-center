import { Crosshair, TimerReset } from "lucide-react";
import type { CommandCenterViewModel } from "./types";
import styles from "./command-center.module.css";

type CurrentMissionProps = {
  mission: CommandCenterViewModel["mission"];
  activeMaterialTitle: string;
};

export function CurrentMission({ mission, activeMaterialTitle }: CurrentMissionProps) {
  return (
    <section className={styles.mission} aria-labelledby="current-mission-title" data-testid="current-mission">
      <div className={styles.sectionKicker}>
        <Crosshair size={14} />
        <span>今日主線</span>
        <b>PRIMARY ORDER</b>
      </div>
      <p className={styles.materialName}>{activeMaterialTitle}</p>
      <h1 id="current-mission-title">{mission.title}</h1>
      <p className={styles.missionDescription}>{mission.description}</p>
      <div className={styles.missionProgressRow}>
        <div className={styles.missionTrack} aria-label={`任務進度 ${mission.progress}%`}>
          <i style={{ width: `${mission.progress}%` }} />
        </div>
        <strong>{Math.round(mission.progress)}%</strong>
      </div>
      <div className={styles.missionMeta}>
        <span><TimerReset size={13} /> 25 MIN</span>
        <span>+{mission.rewardSP ?? 0} SP</span>
        <span>+{mission.rewardBP ?? 0} BP</span>
      </div>
    </section>
  );
}
