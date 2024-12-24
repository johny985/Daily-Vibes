import "./globals.css";
import style from "./layout.module.css";
import Header from "./components/header";
import { UserProvider } from "./contexts/userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <footer>@JooHyung</footer>
          </div>
          <ToastContainer
            position="bottom-center"
            autoClose={1500}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
          />
          <div id="modal-root"></div>
        </UserProvider>
      </body>
    </html>
  );
}
