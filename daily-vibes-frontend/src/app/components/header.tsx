"use client";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/userContext";
import styles from "./header.module.css";

export default function Header() {
  const router = useRouter();
  const { loggedIn, setLoggedIn, loggedInUser, setLoggedInUser } = useUser();

  const handleClick = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    if (document.cookie.includes("tempUser")) {
      document.cookie =
        "tempUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setLoggedInUser("");
      setLoggedIn(false);
      router.push("/");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setLoggedInUser("");
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
        Daily Vibes
      </span>

      <div className={styles.rightContainer}>
        {loggedIn !== null && (
          <>
            {loggedIn && <p className={styles.username}>{loggedInUser}</p>}
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
          </>
        )}
      </div>
    </header>
  );
}
