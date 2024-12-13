"use client";

import styles from "./sidebar.module.css";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleClick = (to: string) => {
    router.push(`/${to}`);
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Menu</h2>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={() => handleClick("/")}>
          <span>- Write Diary</span>
        </li>
        <li className={styles.menuItem} onClick={() => handleClick("calendar")}>
          <span>- Diary Calendar</span>
        </li>
        <li className={styles.menuItem} onClick={() => handleClick("/")}>
          <span>- About Daily Vibes</span>
        </li>
      </ul>
    </div>
  );
}
