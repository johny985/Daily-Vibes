"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Diary() {
  const [date, setDate] = useState(() => {
    const todayString = new Date().toLocaleDateString();

    const [month, day, year] = todayString.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  });
  const [diary, setDiary] = useState("");
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchDiaryContent = async () => {
      const [year, month, day] = date.split("-");
      const formattedDate = `${month}/${day}/${year}`;

      try {
        //TODO: Apply appropriate cache
        const response = await fetch(
          `http://localhost:3001/diary?date=${formattedDate}`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.content) {
            setDiary(data.content);
            setEditable(false);
          } else {
            setDiary("");
            setEditable(true);
          }
        } else {
          console.error("Failed to fetch diary content");
        }
      } catch (error) {
        console.error("Error fetching diary content:", error);
      }
    };

    fetchDiaryContent();
  }, [date]);

  const handleDiaryUpdate = async () => {
    if (!editable) {
      setEditable(true);
      return;
    }

    const [year, month, day] = date.split("-");
    const formattedDate = `${month}/${day}/${year}`;

    try {
      const response = await fetch("http://localhost:3001/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: diary,
          contentDate: formattedDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Diary content saved:", data);
        setEditable(false);
      } else {
        throw new Error("Failed to save diary content");
      }
    } catch (error) {
      console.error("Failed to save diary content:", error);
    }
  };

  return (
    <div className={styles.diary}>
      <h1 className={styles.title}>Daily Diary</h1>
      <div className={styles.header}>
        <p className={styles.date}>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.datePicker}
            />
          </label>
        </p>
        <button className={styles.saveButton} onClick={handleDiaryUpdate}>
          {editable ? "Save" : "Edit"}
        </button>
      </div>
      <textarea
        className={`${styles.content} ${!editable ? styles.disabled : ""}`}
        placeholder="Write your thoughts here..."
        onChange={(e) => {
          setDiary(e.target.value);
        }}
        value={diary}
        disabled={!editable}
      />
    </div>
  );
}
