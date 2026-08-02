import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  ResolvedTheme,
  ThemeContextValue,
  ThemePreference,
} from "./theme-types";

const STORAGE_KEY =
  "creatoros.theme.preference";

const ThemeContext =
  createContext<
    ThemeContextValue | undefined
  >(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

function isThemePreference(
  value: unknown,
): value is ThemePreference {
  return (
    value === "system" ||
    value === "light" ||
    value === "dark"
  );
}

function readStoredPreference():
  ThemePreference {
  try {
    const value =
      localStorage.getItem(
        STORAGE_KEY,
      );

    return isThemePreference(value)
      ? value
      : "system";
  } catch {
    return "system";
  }
}

function getSystemTheme():
  ResolvedTheme {
  return window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches
    ? "light"
    : "dark";
}

function resolveTheme(
  preference: ThemePreference,
): ResolvedTheme {
  return preference === "system"
    ? getSystemTheme()
    : preference;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    preference,
    setPreferenceState,
  ] = useState<ThemePreference>(
    readStoredPreference,
  );

  const [
    resolvedTheme,
    setResolvedTheme,
  ] = useState<ResolvedTheme>(
    () =>
      resolveTheme(
        readStoredPreference(),
      ),
  );

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: light)",
      );

    const applyTheme = () => {
      const nextTheme =
        preference === "system"
          ? mediaQuery.matches
            ? "light"
            : "dark"
          : preference;

      setResolvedTheme(nextTheme);

      document.documentElement.setAttribute(
        "data-theme",
        nextTheme,
      );

      document.documentElement.setAttribute(
        "data-theme-preference",
        preference,
      );
    };

    applyTheme();

    mediaQuery.addEventListener(
      "change",
      applyTheme,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        applyTheme,
      );
    };
  }, [preference]);

  const setPreference =
    useCallback(
      (
        nextPreference:
          ThemePreference,
      ): void => {
        setPreferenceState(
          nextPreference,
        );

        try {
          localStorage.setItem(
            STORAGE_KEY,
            nextPreference,
          );
        } catch {
          // Theme remains available in memory.
        }
      },
      [],
    );

  const toggleTheme =
    useCallback((): void => {
      setPreference(
        resolvedTheme === "dark"
          ? "light"
          : "dark",
      );
    }, [
      resolvedTheme,
      setPreference,
    ]);

  const value =
    useMemo<ThemeContextValue>(
      () => ({
        preference,
        resolvedTheme,
        setPreference,
        toggleTheme,
      }),
      [
        preference,
        resolvedTheme,
        setPreference,
        toggleTheme,
      ],
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme():
  ThemeContextValue {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
}
