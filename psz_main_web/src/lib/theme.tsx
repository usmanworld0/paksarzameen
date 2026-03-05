"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

type Theme = "light";

interface ThemeContextValue {
  theme: Theme;
  // noop toggle kept so consumers don't break
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always use light theme. Keep provider for compatibility.
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", "light");
    } catch (e) {}
  }, []);

  const toggle = () => {
    // noop - theme is light-only
  };

  return (
    <ThemeContext.Provider value={{ theme: "light", toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
