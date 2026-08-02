import {
  useTheme,
} from "./ThemeProvider";

export default function ThemeToggle() {
  const {
    preference,
    resolvedTheme,
    setPreference,
    toggleTheme,
  } = useTheme();

  return (
    <div className="cos-theme-control">
      <button
        type="button"
        className="cos-theme-toggle"
        aria-label="Toggle color theme"
        title={`Current theme: ${resolvedTheme}`}
        onClick={toggleTheme}
      >
        {resolvedTheme === "dark"
          ? "☀"
          : "☾"}
      </button>

      <select
        aria-label="Theme preference"
        value={preference}
        onChange={(event) =>
          setPreference(
            event.target.value as
              | "system"
              | "light"
              | "dark",
          )
        }
      >
        <option value="system">
          System
        </option>

        <option value="dark">
          Dark
        </option>

        <option value="light">
          Light
        </option>
      </select>
    </div>
  );
}
