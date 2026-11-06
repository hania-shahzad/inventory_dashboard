import { useTheme } from "../../context/ThemeContext.jsx";

/**
 * ThemeToggle reads the theme straight from context (useContext inside useTheme).
 * It receives NO props, so nothing is drilled down through Header.
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* JS expression inside JSX */}
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;
