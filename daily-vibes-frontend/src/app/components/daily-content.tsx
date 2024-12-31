import Modal from "./modal";
import styles from "./daily-content.module.css";

import { useState, useEffect } from "react";
import {
  deleteLocalDiaryEntry,
  fetchLocalDiaryOnDate,
  saveLocalDiaryEntry,
} from "../common/common.helper";
import { toast } from "react-toastify";

export default function DailyContent({
  date,
  onClose,
  onSave,
  setHasEdited,
}: {
  date: string;
  onClose: (isSaving?: boolean) => void;
  onSave: (newMood: any) => void;
  setHasEdited?: (hasEdited: boolean) => void;
}) {
  const [isLoading, setLoading] = useState(false);
  const [editable, setEditable] = useState(true);
  const [diary, setDiary] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasInitialContent, setHasInitialContent] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchDiaryContent = async () => {
      if (document.cookie.includes("tempUser")) {
        const diaryEntry = fetchLocalDiaryOnDate(date);

        if (diaryEntry) {
          setDiary(diaryEntry.content);
          setEditable(false);
          setHasInitialContent(true);
        } else {
          setDiary("");
          setHasInitialContent(false);
        }
        return;
      }

      try {
        //TODO: Apply appropriate cache
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diary?date=${date}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, [date]);

  const handleDiaryUpdate = async () => {
    if (!diary) {
      onClose();
      return;
    }

    if (!editable) {
      setEditable(true);
      return;
    }

    setLoading(true);

    if (document.cookie.includes("tempUser")) {
      const newMood = {
        content: diary,
        contentDate: date,
      };

      const vibe = await saveLocalDiaryEntry({
        ...newMood,
      });

      onSave({ ...newMood, vibe });
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              content: diary,
              contentDate: date,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          const newMood = {
            content: diary,
            contentDate: date,
            vibe: data.vibe,
          };

          onSave(newMood);
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
    onClose(true);
    toast.success(`Diary content saved successfully in ${date}!`);
  };

  const handleDeleteClick = () => {
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    if (document.cookie.includes("tempUser")) {
      deleteLocalDiaryEntry(date);
      onSave({ contentDate: date, content: "", vibe: "" });
      onClose();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/diary?date=${date}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onSave({ contentDate: date, content: "", vibe: "" });
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
      <Modal onClose={onClose}>
        <div className={styles.diary}>
          <button className={styles.closeButton} onClick={() => onClose(false)}>
            ×
          </button>
          <h1 className={styles.title}>Daily Vibes</h1>
          <p className={styles.date}>{`Date: ${date || "No date selected"}`}</p>
          <textarea
            className={`${styles.content} ${!editable ? styles.disabled : ""}`}
            placeholder="Write your thoughts or vibes for today..."
            value={diary}
            onChange={(e) => {
              setDiary(e.target.value);
              if (setHasEdited) setHasEdited(true);
            }}
            disabled={!editable}
          />
          <div className={styles.buttonGroup}>
            <button
              className={styles.saveButton}
              onClick={handleDiaryUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : editable ? "Save" : "Edit"}
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
        <Modal onClose={onClose}>
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
