//vibe/page.tsx
"use client";

import { useState } from "react";
import useFetchDiary from "../hooks/useFetchDiary";

export default function Page() {
  const { dailyData, fetchDiaryContent } = useFetchDiary();
  const [date, setDate] = useState<string>(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return `${currentYear}-${currentMonth}`;
  });

  return (
    <div>
      <h1>Diary Entries</h1>
      <p>
        <label>
          Date:
          <input
            type="month"
            value={date}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              fetchDiaryContent(parseInt(year), parseInt(month));
              setDate(e.target.value);
            }}
          />
        </label>
      </p>
      <ul>
        {dailyData.map((entry: any, index: number) => (
          <li key={index}>{entry.vibe}</li>
        ))}
      </ul>
    </div>
  );
}
