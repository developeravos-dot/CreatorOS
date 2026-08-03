import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ProjectsWorkspaceProvider,
  useProjectsWorkspace,
} from "./projects-workspace-context";

function ContextProbe() {
  const {
    state,
    actions,
  } = useProjectsWorkspace();

  return (
    <div>
      <output
        data-testid="search"
      >
        {state.filters.search}
      </output>

      <output
        data-testid="platform"
      >
        {state.filters.platform}
      </output>

      <output
        data-testid="status"
      >
        {state.filters.status}
      </output>

      <output
        data-testid="page"
      >
        {state.page}
      </output>

      <output
        data-testid="page-size"
      >
        {state.pageSize}
      </output>

      <output
        data-testid="sort"
      >
        {state.sortField}:
        {state.sortDirection}
      </output>

      <output
        data-testid="view"
      >
        {state.viewMode}
      </output>

      <output
        data-testid="selected"
      >
        {
          [
            ...state.selectedIds,
          ].join(",")
        }
      </output>

      <button
        type="button"
        onClick={() =>
          actions.setPage(4)
        }
      >
        Set page
      </button>

      <button
        type="button"
        onClick={() =>
          actions.setSearch(
            "alpha",
          )
        }
      >
        Search
      </button>

      <button
        type="button"
        onClick={() =>
          actions.setPlatform(
            "YouTube",
          )
        }
      >
        Platform
      </button>

      <button
        type="button"
        onClick={() =>
          actions.setStatus(
            "active",
          )
        }
      >
        Status
      </button>

      <button
        type="button"
        onClick={() =>
          actions.toggleSort(
            "name",
          )
        }
      >
        Sort name
      </button>

      <button
        type="button"
        onClick={() =>
          actions.setPageSize(
            20,
          )
        }
      >
        Page size
      </button>

      <button
        type="button"
        onClick={() =>
          actions.setViewMode(
            "kanban",
          )
        }
      >
        Kanban
      </button>

      <button
        type="button"
        onClick={() =>
          actions.toggleSelectedId(
            "project-1",
          )
        }
      >
        Toggle selection
      </button>

      <button
        type="button"
        onClick={() =>
          actions.clearSelection()
        }
      >
        Clear
      </button>
    </div>
  );
}

describe(
  "ProjectsWorkspaceProvider",
  () => {
    it(
      "provides normalized initial state",
      () => {
        render(
          <ProjectsWorkspaceProvider
            initialState={{
              page: -5,
              pageSize: 999,
            }}
          >
            <ContextProbe />
          </ProjectsWorkspaceProvider>,
        );

        expect(
          screen.getByTestId(
            "page",
          ),
        ).toHaveTextContent(
          "1",
        );

        expect(
          screen.getByTestId(
            "page-size",
          ),
        ).toHaveTextContent(
          "10",
        );

        expect(
          screen.getByTestId(
            "sort",
          ),
        ).toHaveTextContent(
          "updatedAt:desc",
        );
      },
    );

    it(
      "updates filters and resets the page",
      () => {
        render(
          <ProjectsWorkspaceProvider>
            <ContextProbe />
          </ProjectsWorkspaceProvider>,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Set page",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "page",
          ),
        ).toHaveTextContent(
          "4",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Search",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Platform",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Status",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "search",
          ),
        ).toHaveTextContent(
          "alpha",
        );

        expect(
          screen.getByTestId(
            "platform",
          ),
        ).toHaveTextContent(
          "YouTube",
        );

        expect(
          screen.getByTestId(
            "status",
          ),
        ).toHaveTextContent(
          "active",
        );

        expect(
          screen.getByTestId(
            "page",
          ),
        ).toHaveTextContent(
          "1",
        );
      },
    );

    it(
      "manages sort page size and view mode",
      () => {
        render(
          <ProjectsWorkspaceProvider>
            <ContextProbe />
          </ProjectsWorkspaceProvider>,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Sort name",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "sort",
          ),
        ).toHaveTextContent(
          "name:asc",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Sort name",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "sort",
          ),
        ).toHaveTextContent(
          "name:desc",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Page size",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Kanban",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "page-size",
          ),
        ).toHaveTextContent(
          "20",
        );

        expect(
          screen.getByTestId(
            "view",
          ),
        ).toHaveTextContent(
          "kanban",
        );
      },
    );

    it(
      "manages project selection",
      () => {
        render(
          <ProjectsWorkspaceProvider>
            <ContextProbe />
          </ProjectsWorkspaceProvider>,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Toggle selection",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "selected",
          ),
        ).toHaveTextContent(
          "project-1",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Clear",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "selected",
          ),
        ).toBeEmptyDOMElement();
      },
    );

    it(
      "requires the provider",
      () => {
        expect(
          () =>
            render(
              <ContextProbe />,
            ),
        ).toThrow(
          "ProjectsWorkspaceProvider is missing.",
        );
      },
    );
  },
);
