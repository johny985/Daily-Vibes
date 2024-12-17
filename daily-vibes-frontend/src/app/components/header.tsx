"use client";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/userContext";
import styles from "./header.module.css";

export default function Header() {
  const router = useRouter();
  const { loggedIn, setLoggedIn } = useUser();

  const handleClick = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setLoggedIn(false);
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <header className={styles.header}>
      <span className={styles.title} onClick={handleClick}>
        Your Vibe Today
      </span>
      <div className={styles.buttonContainer}>
        {!loggedIn ? (
          <button
            onClick={() => router.push("/login")}
            className={`${styles.button} ${styles.loginButton}`}
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className={`${styles.button} ${styles.logoutButton}`}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
