import style from "./layout.module.css";

export default function RootLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header style={{ color: "white" }}>Your Vibe Today</header>
          <main>
            <div className={style.sidebar}>{sidebar}</div>
            <div className={style.content}>{children}</div>
          </main>
          <footer>RORORO</footer>
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
