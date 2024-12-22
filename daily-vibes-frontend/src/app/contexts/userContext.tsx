"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type UserContextType = {
  loggedInUser: string;
  setLoggedInUser: (email: string) => void;
  loggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/status", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        setLoggedIn(data.loggedIn);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <UserContext.Provider
      value={{ loggedIn, setLoggedIn, loggedInUser, setLoggedInUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
