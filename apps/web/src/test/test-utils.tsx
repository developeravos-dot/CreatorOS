import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";

import type {
  ReactElement,
  ReactNode,
} from "react";

import {
  LocalizationProvider,
} from "../localization/LocalizationProvider";

interface TestProvidersProps {
  children: ReactNode;
}

function TestProviders({
  children,
}: TestProvidersProps) {
  return (
    <LocalizationProvider>
      {children}
    </LocalizationProvider>
  );
}

export function renderWithProviders(
  element: ReactElement,
  options?: Omit<
    RenderOptions,
    "wrapper"
  >,
): RenderResult {
  return render(element, {
    wrapper: TestProviders,
    ...options,
  });
}

export * from "@testing-library/react";

export {
  default as userEvent,
} from "@testing-library/user-event";
