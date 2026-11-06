import { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

/**
 * ThemeContext (useContext + Context API)
 * ---------------------------------------
 * Without context, "theme" would have to be passed as a prop through
 * App -> Header -> ThemeToggle (prop drilling). With context, any component
 * can read it directly with useTheme().
 */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Remember the user's choice between visits
  const [theme, setTheme] = useLocalStorage("inventory-theme", "light");

  // Side effect: apply the theme to <html data-theme="..."> so CSS variables switch
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // useCallback: stable function reference between renders
  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    [setTheme]
  );

  // useMemo: the context value object is only re-created when `theme` changes,
  // so consumers do not re-render needlessly.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Custom hook that consumes the context (useContext) with a helpful error. */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
