import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  EnterpriseProject,
} from "../enterprise-api";

import {
  useProjectsQuery,
} from "../features/projects-v2/useProjectsQuery";

import ProjectsPage from "./ProjectsPage";

vi.mock(
  "../hooks",
  () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }),
);

vi.mock(
  "../features/projects-v2/useProjectsQuery",
  () => ({
    useProjectsQuery: vi.fn(),
  }),
);

const mockedUseProjectsQuery =
  vi.mocked(useProjectsQuery);

const projects:
  EnterpriseProject[] =
  Array.from(
    {
      length: 11,
    },
    (_, index) => {
      const number =
        index + 1;

      return {
        id:
          `project-${number}`,
        name:
          `Project ${String(
            number,
          ).padStart(
            2,
            "0",
          )}`,
        description:
          `Project description ${number}`,
        platform: "YouTube",
        status: "active",
        createdAt:
          new Date(
            Date.UTC(
              2026,
              7,
              number,
            ),
          ).toISOString(),
        updatedAt:
          new Date(
            Date.UTC(
              2026,
              7,
              number,
            ),
          ).toISOString(),
      };
    },
  );

function renderPage(): void {
  render(
    <ProjectsPage
      projects={projects}
      busy={false}
      onCreate={
        vi.fn().mockResolvedValue(
          undefined,
        )
      }
      onStatus={
        vi.fn().mockResolvedValue(
          undefined,
        )
      }
      onDelete={
        vi.fn().mockResolvedValue(
          undefined,
        )
      }
    />,
  );
}

describe(
  "ProjectsPage workspace integration",
  () => {
    beforeEach(() => {
      window.localStorage.clear();

      mockedUseProjectsQuery
        .mockImplementation(
          (options) => ({
            projects:
              options?.initialProjects ??
              [],
            loading: false,
            refreshing: false,
            error: "",
            updatedAt:
              Date.parse(
                "2026-08-03T07:00:00.000Z",
              ),
            refresh:
              vi.fn().mockResolvedValue(
                undefined,
              ),
          }),
        );
    });

    it(
      "uses workspace pagination",
      () => {
        renderPage();

        const table =
          screen.getByRole(
            "table",
          );

        expect(
          within(
            table,
          ).getAllByRole(
            "row",
          ),
        ).toHaveLength(11);

        expect(
          screen.queryByText(
            "Project 01",
          ),
        ).toBeNull();

        expect(
          screen.getByText(
            "Project 11",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "filters through the workspace engine",
      () => {
        renderPage();

        fireEvent.change(
          screen.getByRole(
            "searchbox",
          ),
          {
            target: {
              value:
                "Project 01",
            },
          },
        );

        const table =
          screen.getByRole(
            "table",
          );

        expect(
          within(
            table,
          ).getAllByRole(
            "row",
          ),
        ).toHaveLength(2);

        expect(
          screen.getByText(
            "Project 01",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Project 11",
          ),
        ).toBeNull();
      },
    );

    it(
      "selects projects and clears the selection",
      () => {
        renderPage();

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        expect(
          screen.getByText(
            "projects selected",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "1",
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Clear selection",
            },
          ),
        );

        expect(
          screen.queryByText(
            "projects selected",
          ),
        ).toBeNull();
      },
    );

    it(
      "updates the status of selected projects",
      async () => {
        const onStatus =
          vi.fn().mockResolvedValue(
            undefined,
          );

        render(
          <ProjectsPage
            projects={projects}
            busy={false}
            onCreate={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onStatus={
              onStatus
            }
            onDelete={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Update selected status",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              projects[10],
            );
          },
        );

        await waitFor(
          () => {
            expect(
              screen.queryByText(
                "projects selected",
              ),
            ).toBeNull();
          },
        );
      },
    );

    it(
      "keeps failed status updates selected",
      async () => {
        const onStatus =
          vi.fn().mockRejectedValue(
            new Error(
              "Status update failed",
            ),
          );

        render(
          <ProjectsPage
            projects={projects}
            busy={false}
            onCreate={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onStatus={
              onStatus
            }
            onDelete={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Update selected status",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              projects[10],
            );
          },
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "checkbox",
                {
                  name:
                    "Select Project 11",
                },
              ),
            ).toBeChecked();
          },
        );

        expect(
          screen.getByText(
            "projects selected",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "updates multiple selected projects sequentially",
      async () => {
        const onStatus =
          vi.fn().mockResolvedValue(
            undefined,
          );

        render(
          <ProjectsPage
            projects={projects}
            busy={false}
            onCreate={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onStatus={
              onStatus
            }
            onDelete={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 10",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Update selected status",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledTimes(
              2,
            );
          },
        );

        expect(
          onStatus,
        ).toHaveBeenNthCalledWith(
          1,
          projects[10],
        );

        expect(
          onStatus,
        ).toHaveBeenNthCalledWith(
          2,
          projects[9],
        );
      },
    );

    it(
      "deletes selected projects after confirmation",
      async () => {
        const onDelete =
          vi.fn().mockResolvedValue(
            undefined,
          );

        const confirmSpy =
          vi.spyOn(
            window,
            "confirm",
          ).mockReturnValue(
            true,
          );

        render(
          <ProjectsPage
            projects={projects}
            busy={false}
            onCreate={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onStatus={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onDelete={
              onDelete
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete selected",
            },
          ),
        );

        expect(
          confirmSpy,
        ).toHaveBeenCalledWith(
          "Delete 1 selected projects?",
        );

        await waitFor(
          () => {
            expect(
              onDelete,
            ).toHaveBeenCalledWith(
              projects[10],
            );
          },
        );

        await waitFor(
          () => {
            expect(
              screen.queryByText(
                "projects selected",
              ),
            ).toBeNull();
          },
        );

        confirmSpy.mockRestore();
      },
    );

    it(
      "keeps selection when bulk deletion fails",
      async () => {
        const onDelete =
          vi.fn().mockRejectedValue(
            new Error(
              "Delete failed",
            ),
          );

        const confirmSpy =
          vi.spyOn(
            window,
            "confirm",
          ).mockReturnValue(
            true,
          );

        render(
          <ProjectsPage
            projects={projects}
            busy={false}
            onCreate={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onStatus={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onDelete={
              onDelete
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete selected",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onDelete,
            ).toHaveBeenCalled();
          },
        );

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "projects selected",
              ),
            ).toBeInTheDocument();
          },
        );

        expect(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        ).toBeChecked();

        confirmSpy.mockRestore();
      },
    );

    it(
      "cancels bulk deletion when confirmation is rejected",
      async () => {
        const onDelete =
          vi.fn().mockResolvedValue(
            undefined,
          );

        const confirmSpy =
          vi.spyOn(
            window,
            "confirm",
          ).mockReturnValue(
            false,
          );

        render(
          <ProjectsPage
            projects={projects}
            busy={false}
            onCreate={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onStatus={
              vi.fn().mockResolvedValue(
                undefined,
              )
            }
            onDelete={
              onDelete
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Project 11",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete selected",
            },
          ),
        );

        expect(
          onDelete,
        ).not.toHaveBeenCalled();

        expect(
          screen.getByText(
            "projects selected",
          ),
        ).toBeInTheDocument();

        confirmSpy.mockRestore();
      },
    );

    it(
      "changes the page size and persists it",
      () => {
        renderPage();

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Rows per page",
            },
          ),
          {
            target: {
              value: "20",
            },
          },
        );

        expect(
          screen.getByText(
            "Project 01",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Project 11",
          ),
        ).toBeInTheDocument();

        expect(
          window.localStorage.getItem(
            "creatoros.projects-workspace.preferences.v1",
          ),
        ).toContain(
          '"pageSize":20',
        );
      },
    );

    it(
      "persists the selected view mode",
      () => {
        renderPage();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Kanban",
            },
          ),
        );

        expect(
          window.localStorage.getItem(
            "creatoros.projects-workspace.preferences.v1",
          ),
        ).toContain(
          '"viewMode":"kanban"',
        );
      },
    );
  },
);
