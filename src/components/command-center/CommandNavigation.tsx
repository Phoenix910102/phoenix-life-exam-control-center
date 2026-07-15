import Link from "next/link";
import { BookOpen, Home, Settings, Trophy } from "lucide-react";
import styles from "./command-center.module.css";

const navigation = [
  ["/command-center", "中控台", Home],
  ["/materials", "教材戰役", BookOpen],
  ["/achievements", "成就館", Trophy],
  ["/settings", "設定", Settings],
] as const;

export function CommandNavigation() {
  return (
    <nav className={styles.navigation} aria-label="全域導航">
      {navigation.map(([href, label, Icon], index) => (
        <Link
          aria-current={index === 0 ? "page" : undefined}
          aria-label={label}
          data-active={index === 0}
          href={href}
          key={href}
          title={label}
        >
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
