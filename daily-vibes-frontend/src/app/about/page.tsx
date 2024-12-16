import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Daily Vibes</h1>
      <p className={styles.description}>
        Daily Vibes is a diary app that helps you track your emotions and
        thoughts. It uses AI to analyze your entries and provide corresponding
        vibes of the day.
      </p>
      <h2 className={styles.subtitle}>Features</h2>
      <ul className={styles.list}>
        <li>Record your daily emotions and thoughts</li>
        <li>Get personalized vibes based on your entries</li>
        <li>Track your mood patterns over time</li>
      </ul>
      <h2 className={styles.subtitle}>How it works</h2>
      <p className={styles.description}>
        Daily Vibes uses GPT-powered natural language processing to interpret
        your diary entries and uncover the emotional tone of each day.
      </p>
    </div>
  );
}
