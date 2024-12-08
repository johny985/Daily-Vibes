import style from "./layout.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header>Your Vibe Today</header>
          <main>{children}</main>
          <footer>RORORO</footer>
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
