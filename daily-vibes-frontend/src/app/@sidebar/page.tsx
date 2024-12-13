"use client";

import styles from "./sidebar.module.css";

export default function Sidebar() {
  const handleClick = () => {
    console.log("sidebar");
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Menu</h2>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={handleClick}>
          <span>- Write Diary</span>
        </li>
        <li className={styles.menuItem} onClick={handleClick}>
          <span>- Diary Calendar</span>
        </li>
        <li className={styles.menuItem} onClick={handleClick}>
          <span>- About Daily Vibes</span>
        </li>
      </ul>
    </div>
  );
}
