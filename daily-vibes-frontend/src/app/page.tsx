"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import {
  fetchLocalDiaryOnDate,
  saveLocalDiaryEntry,
} from "./common/common.helper";
import { toast } from "react-toastify";

export default function Diary() {
  const [isLoading, setLoading] = useState(false);
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

      if (document.cookie.includes("tempUser")) {
        const diary = fetchLocalDiaryOnDate(formattedDate);

        if (diary?.content) {
          setDiary(diary.content);
          setEditable(false);
        } else {
          setDiary("");
          setEditable(true);
        }

        return;
      }

      try {
        //TODO: Apply appropriate cache
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diary?date=${formattedDate}`,
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
    const [year, month, day] = date.split("-");
    const formattedDate = `${month}/${day}/${year}`;

    if (!editable) {
      setEditable(true);
      return;
    }
    debugger;
    setLoading(true);

    if (document.cookie.includes("tempUser")) {
      await saveLocalDiaryEntry({
        content: diary,
        contentDate: formattedDate,
      });

      setEditable(false);
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              content: diary,
              contentDate: formattedDate,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Diary content saved:", data);
          setEditable(false);
        } else {
          throw new Error("Failed to save diary content");
        }
      } catch (error) {
        toast.error("Failed to save diary content. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    setLoading(false);
    toast.success(`Diary content saved successfully in ${formattedDate}!`);
  };

  return (
    <div>
      <h1 className={styles.title}>Diary</h1>
      <div className={styles.header}>
        <p>
          <label htmlFor="date" className={styles.label}>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
            />
          </label>
        </p>
        <button
          className={styles.saveButton}
          onClick={handleDiaryUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : editable ? "Save" : "Edit"}
        </button>
      </div>
      <textarea
        className={`${styles.content} ${!editable ? styles.disabled : ""}`}
        placeholder="Write your thoughts or vibes for today..."
        onChange={(e) => {
          setDiary(e.target.value);
        }}
        value={diary}
        disabled={!editable}
      />
    </div>
  );
}
