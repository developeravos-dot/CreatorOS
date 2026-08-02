export type ThemePreference =
  | "system"
  | "light"
  | "dark";

export type ResolvedTheme =
  | "light"
  | "dark";

export interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;

  setPreference: (
    preference: ThemePreference,
  ) => void;

  toggleTheme: () => void;
}
