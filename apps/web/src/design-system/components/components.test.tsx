import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";
import StatusBadge from "./StatusBadge";

describe(
  "design system components",
  () => {
    it(
      "renders a status badge",
      () => {
        render(
          <StatusBadge tone="success">
            Operational
          </StatusBadge>,
        );

        expect(
          screen.getByText(
            "Operational",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders an empty state",
      () => {
        render(
          <EmptyState
            title="No projects"
            description="Create the first project."
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "No projects",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Create the first project.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders a skeleton",
      () => {
        const {
          container,
        } = render(
          <Skeleton
            width={120}
            height={20}
          />,
        );

        expect(
          container.querySelector(
            ".cos-skeleton",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
