"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include", // Important to send cookies with the request
      });

      if (response.ok) {
        router.push("/"); // Redirect to home page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <header>
      <span style={{ color: "white", cursor: "pointer" }} onClick={handleClick}>
        Your Vibe Today
      </span>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </header>
  );
}
