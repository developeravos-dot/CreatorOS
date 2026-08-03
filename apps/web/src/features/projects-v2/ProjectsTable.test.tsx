import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import ProjectsTable from "./ProjectsTable";

vi.mock(
  "../../hooks",
  () => ({
    useTranslation: () => ({
      t: (
        key: string,
      ) => key,
    }),
  }),
);

const projects:
  EnterpriseProject[] = [
  {
    id: "project-1",
    name: "Alpha",
    description:
      "Alpha project",
    platform: "YouTube",
    status: "active",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-02T08:00:00.000Z",
  },
];

describe(
  "ProjectsTable sorting",
  () => {
    it(
      "runs sort callbacks from headers",
      () => {
        const onSort =
          vi.fn();

        render(
          <ProjectsTable
            projects={projects}
            selectedIds={
              new Set()
            }
            busy={false}
            sortField="name"
            sortDirection="asc"
            onSort={onSort}
            onToggleSelection={
              vi.fn()
            }
            onTogglePageSelection={
              vi.fn()
            }
            onSelect={
              vi.fn()
            }
            onStatus={
              vi.fn()
            }
            onDelete={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sort by projects.project",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sort by projects.platform",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sort by projects.status",
            },
          ),
        );

        expect(
          onSort,
        ).toHaveBeenNthCalledWith(
          1,
          "name",
        );

        expect(
          onSort,
        ).toHaveBeenNthCalledWith(
          2,
          "platform",
        );

        expect(
          onSort,
        ).toHaveBeenNthCalledWith(
          3,
          "status",
        );
      },
    );

    it(
      "toggles project selection",
      () => {
        const onToggleSelection =
          vi.fn();

        render(
          <ProjectsTable
            projects={projects}
            selectedIds={
              new Set()
            }
            busy={false}
            sortField="name"
            sortDirection="asc"
            onSort={
              vi.fn()
            }
            onToggleSelection={
              onToggleSelection
            }
            onTogglePageSelection={
              vi.fn()
            }
            onSelect={
              vi.fn()
            }
            onStatus={
              vi.fn()
            }
            onDelete={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Alpha",
            },
          ),
        );

        expect(
          onToggleSelection,
        ).toHaveBeenCalledWith(
          "project-1",
        );
      },
    );

    it(
      "selects all projects on the page",
      () => {
        const onTogglePageSelection =
          vi.fn();

        render(
          <ProjectsTable
            projects={projects}
            selectedIds={
              new Set()
            }
            busy={false}
            sortField="name"
            sortDirection="asc"
            onSort={
              vi.fn()
            }
            onToggleSelection={
              vi.fn()
            }
            onTogglePageSelection={
              onTogglePageSelection
            }
            onSelect={
              vi.fn()
            }
            onStatus={
              vi.fn()
            }
            onDelete={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select all projects on page",
            },
          ),
        );

        expect(
          onTogglePageSelection,
        ).toHaveBeenCalledWith(
          ["project-1"],
          true,
        );
      },
    );

    it(
      "shows the active sort direction",
      () => {
        render(
          <ProjectsTable
            projects={projects}
            selectedIds={
              new Set()
            }
            busy={false}
            sortField="name"
            sortDirection="desc"
            onSort={
              vi.fn()
            }
            onToggleSelection={
              vi.fn()
            }
            onTogglePageSelection={
              vi.fn()
            }
            onSelect={
              vi.fn()
            }
            onStatus={
              vi.fn()
            }
            onDelete={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Sort by projects.project",
            },
          ),
        ).toHaveTextContent(
          "\u2193",
        );
      },
    );
  },
);
