import { Diary } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/diary?year=${year}&month=${month}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred");

      return;
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
