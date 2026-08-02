import {
  useEffect,
  type RefObject,
} from "react";

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useDashboardFocusTrap(
  containerRef:
    RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(
    () => {
      if (!active) {
        return;
      }

      const container =
        containerRef.current;

      if (!container) {
        return;
      }

      const previous =
        document.activeElement as
          HTMLElement | null;

      const getFocusable =
        (): HTMLElement[] =>
          Array.from(
            container.querySelectorAll<HTMLElement>(
              focusableSelector,
            ),
          );

      const focusable =
        getFocusable();

      focusable[0]?.focus();

      const handleKeyDown = (
        event: KeyboardEvent,
      ): void => {
        if (
          event.key !== "Tab"
        ) {
          return;
        }

        const elements =
          getFocusable();

        const first =
          elements[0];

        const last =
          elements.at(-1);

        if (!first || !last) {
          return;
        }

        if (
          event.shiftKey &&
          document.activeElement ===
            first
        ) {
          event.preventDefault();
          last.focus();
          return;
        }

        if (
          !event.shiftKey &&
          document.activeElement ===
            last
        ) {
          event.preventDefault();
          first.focus();
        }
      };

      container.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        container.removeEventListener(
          "keydown",
          handleKeyDown,
        );

        previous?.focus();
      };
    },
    [
      active,
      containerRef,
    ],
  );
}
