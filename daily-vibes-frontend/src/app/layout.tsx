import style from "./layout.module.css";
import Header from "./components/header";
import { UserProvider } from "./contexts/userContext";

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
        <UserProvider>
          <div className={style.container}>
            <Header />
            <main>
              <div className={style.sidebar}>{sidebar}</div>
              <div className={style.content}>{children}</div>
            </main>
            <footer>RORORO</footer>
          </div>
          <div id="modal-root"></div>
        </UserProvider>
      </body>
    </html>
  );
}
