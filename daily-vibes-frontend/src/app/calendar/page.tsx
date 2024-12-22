"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import DailyContent from "../components/daily-content";
import Modal from "../components/modal";
import styles from "../components/daily-content.module.css";
import calendarStyles from "./custom-calendar.module.css";
import CalendarSkeleton from "../skeleton/calendar-skeleton";
import useFetchDiary from "../hooks/useFetchDiary";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
});

export default function Home() {
  const { dailyData, setDailyData, fetchDiaryContent } = useFetchDiary();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const updateDailyData = (newMood: any) => {
    setHasEdited(false);

    setDailyData((prevMoodData: any) => [
      ...prevMoodData.filter(
        (data: any) => data.contentDate !== newMood.contentDate
      ),
      newMood,
    ]);
  };

  const handleDayClick = (value: Date) => {
    setSelectedDate(value);
    setIsModalOpen(true);
  };

  const closeModal = (isSaving = false) => {
    if (hasEdited && !isSaving) {
      setShowCloseConfirmation(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleMonthChange = async ({ action, view, activeStartDate }: any) => {
    setActiveStartDate(activeStartDate);

    if (
      (action === "drillDown" && view === "month") ||
      (action === "next" && view === "month") ||
      (action === "prev" && view === "month")
    ) {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;

      await fetchDiaryContent(year, month);
    }
  };

  const tileContent = useCallback(
    ({ date }: { date: Date }) => {
      if (dailyData?.length) {
        for (let i = 0; i < dailyData.length; i++) {
          const calendarDate = date.toLocaleDateString();
          const contentDate = dailyData[i].contentDate;

          if (calendarDate === contentDate) {
            const vibe = dailyData[i].vibe;

            if (!vibe) return;

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
    },
    [dailyData]
  );

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      return date > new Date();
    }
    return false;
  };

  const goToCurrentMonth = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    await fetchDiaryContent(year, month);

    setActiveStartDate(new Date());
  };

  return (
    <div className={calendarStyles.calendarContainer}>
      <div>
        <button
          className={calendarStyles.goToCurrentButton}
          onClick={goToCurrentMonth}
        >
          To Current Month
        </button>
      </div>
      <Calendar
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        onClickDay={handleDayClick}
        onActiveStartDateChange={handleMonthChange}
        activeStartDate={activeStartDate}
        tileContent={tileContent}
        locale="en-US"
        minDate={new Date("1980-01-01")}
        maxDate={maxDate}
        tileDisabled={tileDisabled}
      />

      {isModalOpen && (
        <DailyContent
          date={selectedDate as Date}
          onClose={closeModal}
          onSave={updateDailyData}
          setHasEdited={setHasEdited}
        />
      )}

      {showCloseConfirmation && (
        <Modal>
          <div className={styles.confirmation}>
            <p>Unsaved changes will be lost. Do you want to leave?</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  setShowCloseConfirmation(false);
                  setIsModalOpen(false);
                  setHasEdited(false);
                }}
              >
                Yes
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowCloseConfirmation(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
