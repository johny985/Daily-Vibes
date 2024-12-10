import Modal from "./modal";
import styles from "./dailyContent.module.css";
import { useState, useEffect, useRef } from "react";

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
  const [editable, setEditable] = useState(true);
  const [diary, setDiary] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasInitialContent, setHasInitialContent] = useState(false);

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
            setEditable(false);
            setHasInitialContent(true);
          } else {
            setDiary("");
            setHasInitialContent(false);
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
      setEditable(true);
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

  const handleDeleteClick = () => {
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/diary?date=${stringDate}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onSave({ contentDate: stringDate, content: "", vibe: "" });
        onClose();
      } else {
        throw new Error("Failed to delete diary content");
      }
    } catch (error) {
      console.error("Error deleting diary content:", error);
    }
  };

  return (
    <>
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
          <div className={styles.buttonGroup}>
            <button className={styles.saveButton} onClick={handleDiaryUpdate}>
              {editable ? "Save" : "Edit"}
            </button>
            {hasInitialContent && (
              <button
                className={styles.deleteButton}
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </Modal>

      {isConfirmationModalOpen && (
        <Modal>
          <div className={styles.confirmation}>
            <p>Are you sure to delete this diary content?</p>
            <div className={styles.buttonGroup}>
              <button className={styles.confirmButton} onClick={confirmDelete}>
                Yes
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
