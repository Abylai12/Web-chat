"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface ThemeContextProps {
  setTheme: Dispatch<SetStateAction<string>>;
  theme: string;
  changeTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  setTheme: () => {},
  theme: "light",
  changeTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storeTheme = localStorage.getItem("chat-theme") || "light";
    setTheme(storeTheme);
  }, []);

  const changeTheme = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("chat-theme", theme);
  };
  return (
    <ThemeContext.Provider
      value={{
        changeTheme,
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
