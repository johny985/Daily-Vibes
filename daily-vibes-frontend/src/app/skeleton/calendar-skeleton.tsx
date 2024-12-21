import styles from "./calendar-skeleton.module.css";

export default function CalendarSkeleton() {
  return (
    <div className={styles.calendarSkeleton}>
      <div className={styles.navigation}>
        <div className={styles.arrow}></div>
        <div className={styles.label}></div>
        <div className={styles.arrow}></div>
      </div>
      <div className={styles.weekdays}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className={styles.weekday}></div>
        ))}
      </div>
      <div className={styles.monthView}>
        {[...Array(6)].map((_, weekIndex) => (
          <div key={weekIndex} className={styles.week}>
            {[...Array(7)].map((_, dayIndex) => (
              <div key={dayIndex} className={styles.tile}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
