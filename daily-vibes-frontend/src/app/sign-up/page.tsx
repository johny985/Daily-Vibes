import styles from "./sign-up.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>
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
              placeholder="Create a password"
              required
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
            />
          </div>
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
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
