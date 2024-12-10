"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import "./calandar.css";
import DailyContent from "./components/dailyContent";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyData, setDailyData] = useState<any>([]);

  const updateDailyData = (newMood: any) => {
    setDailyData((prevMoodData: any) => [
      ...prevMoodData.filter(
        (data: any) => data.contentDate !== newMood.contentDate
      ),
      newMood,
    ]);
  };

  // Fetching diary content for the selected year and month
  const fetchDiaryContent = async (year: number, month: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/diary?year=${year}&month=${month}`
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

  const handleDayClick = (value: Date) => {
    setSelectedDate(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMonthChange = async ({ action, view, activeStartDate }: any) => {
    if (
      (action === "drillDown" && view === "month") ||
      (action === "next" && view === "month") ||
      (action === "prev" && view === "month")
    ) {
      console.log("Month changed");

      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;

      await fetchDiaryContent(year, month);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Calendar
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        onClickDay={handleDayClick}
        onActiveStartDateChange={handleMonthChange}
        tileContent={({ date }) => {
          if (dailyData?.length) {
            for (let i = 0; i < dailyData.length; i++) {
              const calendarDate = date.toLocaleDateString();
              const contentDate = dailyData[i].contentDate;

              if (calendarDate === contentDate) {
                const vibe = dailyData[i].vibe;

                let emoji = "";
                if (vibe === "Happy") emoji = "😊";
                else if (vibe === "Sad") emoji = "😢";
                else if (vibe === "Exhausted") emoji = "😩";
                else if (vibe === "Angry") emoji = "😡";

                return (
                  <p style={{ fontSize: "3rem", marginTop: "0px" }}>{emoji}</p>
                );
              }
            }
          }
        }}
      />
      {isModalOpen && (
        <DailyContent
          date={selectedDate as Date}
          onClose={closeModal}
          onSave={updateDailyData}
        />
      )}
    </div>
  );
}
