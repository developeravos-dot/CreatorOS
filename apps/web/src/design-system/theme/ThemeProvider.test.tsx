import {
  describe,
  expect,
  it,
} from "vitest";

import {
  act,
  renderHook,
} from "@testing-library/react";

import type {
  ReactNode,
} from "react";

import {
  ThemeProvider,
  useTheme,
} from "./ThemeProvider";

function Wrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

describe(
  "ThemeProvider",
  () => {
    it(
      "provides a theme context",
      () => {
        const {
          result,
        } = renderHook(
          () => useTheme(),
          {
            wrapper: Wrapper,
          },
        );

        expect(
          result.current.preference,
        ).toMatch(
          /system|light|dark/,
        );

        expect(
          result.current.resolvedTheme,
        ).toMatch(
          /light|dark/,
        );
      },
    );

    it(
      "changes theme preference",
      () => {
        const {
          result,
        } = renderHook(
          () => useTheme(),
          {
            wrapper: Wrapper,
          },
        );

        act(() => {
          result.current.setPreference(
            "light",
          );
        });

        expect(
          result.current.preference,
        ).toBe("light");

        expect(
          document.documentElement
            .getAttribute(
              "data-theme",
            ),
        ).toBe("light");
      },
    );
  },
);
