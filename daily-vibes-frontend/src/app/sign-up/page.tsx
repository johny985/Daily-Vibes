"use client";
import { useState } from "react";
import styles from "./sign-up.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const checkEmailDuplication = async () => {
    if (!email) return;

    try {
      const response = await fetch(
        `http://localhost:3001/user/findUser?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.email) {
          setEmailError("Email already exists!");
        } else {
          setEmailError("");
        }
      }
    } catch (error) {
      console.error("Error checking email duplication:", error);
    }
  };

  const signUp = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error checking email duplication:", error);
    }
  };

  const handleSignUp = () => {
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long!");
      return;
    }

    if (emailError) return;

    toast.success("Sign up successful!");
    signUp();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <div className={styles.form}>
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
              required
              onBlur={checkEmailDuplication}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className={styles.error}>{emailError}</p>}
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
              placeholder="Create a password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirm-password" className={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className={styles.input}
              placeholder="Confirm your password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>

          <button
            type="button"
            className={styles.button}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/login" className={styles.link}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
