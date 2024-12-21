// useFetchDiary.ts
import { useEffect, useState } from "react";

interface Diary {
  content: string;
  contentDate: string;
  vibe: string;
}

export default function useFetchDiary() {
  const [dailyData, setDailyData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchDiaryContent = async (year: number, month: number) => {
    setLoading(true);

    if (document.cookie.includes("tempUser")) {
      if (!localStorage.diaryEntries) return;

      const diaries: Diary[] = JSON.parse(localStorage.diaryEntries);

      const filteredDiares = diaries.filter((diary: Diary) => {
        const diaryDate = new Date(diary.contentDate);
        return (
          diaryDate.getFullYear() === year && diaryDate.getMonth() + 1 === month
        );
      });

      setDailyData(filteredDiares);
      setLoading(false);
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
        const data: Diary[] = await response.json();
        if (data) {
          setDailyData(data);
        }
      } else {
        console.error("Failed to fetch diary content");
      }
    } catch (error) {
      console.error("Error fetching diary content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    fetchDiaryContent(currentYear, currentMonth);
  }, []);

  return { dailyData, setDailyData, fetchDiaryContent, isLoading };
}
