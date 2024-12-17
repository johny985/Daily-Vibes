"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/userContext";

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn } = useUser();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async (endpoint: "login" | "setTempUser") => {
    try {
      const response = await fetch(`http://localhost:3001/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      router.push("/");
      setLoggedIn(true);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button onClick={() => handleAuth("login")} className={styles.button}>
          Login
        </button>
        &nbsp;
        <button
          onClick={() => handleAuth("setTempUser")}
          className={styles.button}
        >
          Temp User
        </button>
        <p className={styles.footer}>
          Don’t have an account?{" "}
          <Link href="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
