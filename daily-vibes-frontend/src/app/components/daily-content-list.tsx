import { Diary, Vibes } from "@/types";
import styles from "./daily-content-list.module.css";
import { useMemo } from "react";

export default function DailyContentList({
  dailyData,
  handleDayClick,
  vibeObject,
}: {
  dailyData: Diary[];
  handleDayClick: (value: any) => void;
  vibeObject: Vibes;
}) {
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedDailyData = useMemo(() => {
    return [...dailyData].sort((a, b) => {
      const dateA = parseDate(a.contentDate);
      const dateB = parseDate(b.contentDate);

      return dateB.getTime() - dateA.getTime();
    });
  }, [dailyData]);

  return (
    <div className={styles.dailyContentList}>
      {sortedDailyData.length === 0 && (
        <p className={styles.noContent}>No content available</p>
      )}
      {sortedDailyData.map((entry, index) => {
        if (!entry.content && !entry.vibe) return null;

        return (
          <div
            key={index}
            className={styles.contentItem}
            onClick={() => {
              handleDayClick(new Date(entry.contentDate));
            }}
          >
            <div className={styles.contentHeader}>
              <h2 className={styles.vibe}>{`${
                vibeObject[entry.vibe as keyof Vibes]
              }-${entry.vibe}`}</h2>
              <p className={styles.contentDate}>{entry.contentDate}</p>
            </div>

            <p className={styles.contentText}>
              {entry.content.slice(0, 100)}
              {entry.content.length > 100 ? "..." : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
