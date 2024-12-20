// useFetchDiary.ts
import { useEffect, useState } from "react";

export default function useFetchDiary() {
  const [dailyData, setDailyData] = useState<any>([]);

  const fetchDiaryContent = async (year: number, month: number) => {
    if (document.cookie.includes("tempUser")) {
      if (!localStorage.diaryEntries) return;

      const diaries = JSON.parse(localStorage.diaryEntries);
      setDailyData(diaries);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/diary?year=${year}&month=${month}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setDailyData(data);
        }
      } else {
        console.error("Failed to fetch diary content");
      }
    } catch (error) {
      console.error("Error fetching diary content:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    fetchDiaryContent(currentYear, currentMonth);
  }, []);

  return { dailyData, setDailyData, fetchDiaryContent };
}