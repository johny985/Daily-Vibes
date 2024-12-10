import Modal from "./modal";
import styles from "./dailyContent.module.css";
import { useState, useEffect } from "react";

export default function DailyContent({
  date,
  onClose,
  onSave,
}: {
  date: Date;
  onClose: () => void;
  onSave: (newMood: any) => void;
}) {
  const stringDate = date.toLocaleDateString();
  const [editable, setEdiable] = useState(true);
  const [diary, setDiary] = useState("");

  // Fetch diary content from the server based on the date when modal opens
  useEffect(() => {
    const fetchDiaryContent = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/diary?date=${stringDate}`,
          { cache: "force-cache" }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.content) {
            setDiary(data.content);
            setEdiable(false);
          } else {
            setDiary("");
          }
        } else {
          console.error("Failed to fetch diary content");
        }
      } catch (error) {
        console.error("Error fetching diary content:", error);
      }
    };

    fetchDiaryContent();
  }, [stringDate]);

  const handleDiaryUpdate = async () => {
    if (!editable) {
      setEdiable(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: diary,
          contentDate: stringDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const newMood = {
          content: diary,
          contentDate: stringDate,
          vibe: data.vibe,
        };

        onSave(newMood);

        onClose();
      } else {
        throw new Error("Failed to save diary content");
      }
    } catch (error) {
      console.error("Failed to save diary content:", error);
    }
  };

  return (
    <Modal>
      <div className={styles.diary}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h1 className={styles.title}>Daily Vibes</h1>
        <p className={styles.date}>
          {`Date: ${date?.toLocaleDateString() || "No date selected"}`}
        </p>
        <textarea
          className={`${styles.content} ${!editable ? styles.disabled : ""}`}
          placeholder="Write your thoughts or vibes for today..."
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          disabled={!editable}
        />
        <button className={styles.saveButton} onClick={handleDiaryUpdate}>
          {editable ? "Save" : "Edit"}
        </button>
      </div>
    </Modal>
  );
}
