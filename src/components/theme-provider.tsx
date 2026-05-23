"use client"
import { createContext, useContext, useEffect } from "react";

type Theme = "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  // kept for backwards-compatibility — ignored, always dark
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: string) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  // no-op — theme is locked to dark
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    // Always enforce dark — clear any stale localStorage preference
    root.classList.remove("light");
    root.classList.add("dark");
    try {
      // Clear any previously saved light/system preference so returning
      // visitors are no longer served the wrong theme.
      localStorage.removeItem("vite-ui-theme");
    } catch {
      // localStorage may be unavailable in some environments — safe to ignore
    }
  }, []);

  return (
    <ThemeProviderContext.Provider {...props} value={initialState}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};