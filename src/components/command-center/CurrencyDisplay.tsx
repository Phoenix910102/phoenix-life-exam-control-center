import { Gem, Shield } from "lucide-react";
import type { CommandCenterViewModel } from "./types";
import styles from "./command-center.module.css";

type CurrencyDisplayProps = {
  currency: CommandCenterViewModel["currency"];
};

export function CurrencyDisplay({ currency }: CurrencyDisplayProps) {
  return (
    <div className={styles.currencyBar} aria-label="點數與羈絆等級" data-testid="currency-bar">
      <div className={styles.currencyItem} tabIndex={0} title="Study Points：由學習與收復戰區獲得">
        <span className={styles.currencyIcon}><Shield size={14} /></span>
        <span>SP</span>
        <strong>{currency.studyPoints.toLocaleString("zh-TW")}</strong>
      </div>
      <div className={styles.currencyItem} tabIndex={0} title="Bond Points：由主線、成就與照護紀律獲得">
        <span className={styles.currencyIcon}><Gem size={14} /></span>
        <span>BP</span>
        <strong>{currency.bondPoints.toLocaleString("zh-TW")}</strong>
      </div>
      <div className={styles.bondItem} tabIndex={0} title="羈絆等級">
        <span>BOND</span>
        <strong>{String(currency.bondLevel).padStart(2, "0")}</strong>
        <i aria-hidden="true"><b style={{ width: `${currency.bondProgress}%` }} /></i>
      </div>
    </div>
  );
}
