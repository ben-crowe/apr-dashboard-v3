import { createContext, useContext, useEffect, useState } from "react";

// Single source-of-truth theme system for the app.
// - Default LIGHT (Ben: light is the typical default; dark is opt-in for eye comfort).
// - Persists the choice to localStorage('theme') so it survives reload.
// - Applies the 'dark' class to <html>; the no-flash <script> in index.html applies it
//   BEFORE React paints so there's no light→dark flash on boot. This provider keeps it in sync.
// Replaces the old ad-hoc setup (main.tsx force-added 'dark' on every boot, which stomped the toggle).

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "light";

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystem(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = window.document.documentElement;
  const effective = theme === "system" ? resolveSystem() : theme;
  root.classList.toggle("dark", effective === "dark");
  root.classList.toggle("light", effective === "light");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_KEY) as Theme) || DEFAULT_THEME,
  );

  // Apply on mount + whenever theme changes, and persist.
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // If the user is on "system", track OS changes live.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  // Fallback keeps the app from crashing if a component renders outside the provider.
  if (!ctx) {
    return {
      theme: (typeof localStorage !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Theme)) || DEFAULT_THEME,
      setTheme: () => {},
    };
  }
  return ctx;
}
