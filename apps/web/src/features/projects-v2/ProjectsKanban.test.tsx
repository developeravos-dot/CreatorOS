import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
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

import ProjectsKanban from "./ProjectsKanban";

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
    id: "project-planning",
    name: "Planning Project",
    description:
      "Planning description",
    platform: "YouTube",
    status: "planning",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-02T08:00:00.000Z",
  },
  {
    id: "project-active",
    name: "Active Project",
    description:
      "Active description",
    platform: "TikTok",
    status: "active",
    createdAt:
      "2026-08-02T08:00:00.000Z",
    updatedAt:
      "2026-08-04T08:00:00.000Z",
  },
  {
    id: "project-completed",
    name: "Completed Project",
    description:
      "Completed description",
    platform: "Both",
    status: "completed",
    createdAt:
      "2026-08-03T08:00:00.000Z",
    updatedAt:
      "2026-08-03T08:00:00.000Z",
  },
];

describe(
  "ProjectsKanban engine integration",
  () => {
    it(
      "renders configured workflow columns and counts",
      () => {
        const { container } =
          render(
            <ProjectsKanban
              projects={
                projects
              }
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                vi.fn()
              }
            />,
          );

        const planning =
          container.querySelector(
            '[data-column-id="planning"]',
          );

        const active =
          container.querySelector(
            '[data-column-id="active"]',
          );

        const paused =
          container.querySelector(
            '[data-column-id="paused"]',
          );

        const completed =
          container.querySelector(
            '[data-column-id="completed"]',
          );

        expect(
          planning,
        ).not.toBeNull();

        expect(
          active,
        ).not.toBeNull();

        expect(
          paused,
        ).not.toBeNull();

        expect(
          completed,
        ).not.toBeNull();

        expect(
          within(
            planning as HTMLElement,
          ).getByText(
            "Planning Project",
          ),
        ).toBeInTheDocument();

        expect(
          within(
            active as HTMLElement,
          ).getByText(
            "Active Project",
          ),
        ).toBeInTheDocument();

        expect(
          within(
            completed as HTMLElement,
          ).getByText(
            "Completed Project",
          ),
        ).toBeInTheDocument();

        expect(
          within(
            paused as HTMLElement,
          ).getByText(
            "No projects",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "moves a project between columns using drag and drop",
      async () => {
        const onStatus =
          vi.fn();

        const { container } =
          render(
            <ProjectsKanban
              projects={
                projects
              }
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                onStatus
              }
            />,
          );

        const card =
          container.querySelector(
            '[data-project-id="project-planning"]',
          );

        const activeColumn =
          container.querySelector(
            '[data-column-id="active"]',
          );

        expect(
          card,
        ).not.toBeNull();

        expect(
          activeColumn,
        ).not.toBeNull();

        await act(
          async () => {
            fireEvent.dragStart(
              card as HTMLElement,
              {
                dataTransfer: {
                  effectAllowed:
                    "move",
                  setData:
                    vi.fn(),
                },
              },
            );
          },
        );

        await waitFor(
          () => {
            expect(
              card,
            ).toHaveClass(
              "projects-v2-kanban__card--dragging",
            );
          },
        );

        fireEvent.dragEnter(
          activeColumn as HTMLElement,
          {
            dataTransfer: {
              dropEffect:
                "move",
            },
          },
        );

        fireEvent.dragOver(
          activeColumn as HTMLElement,
          {
            dataTransfer: {
              dropEffect:
                "move",
            },
          },
        );

        fireEvent.drop(
          activeColumn as HTMLElement,
          {
            dataTransfer: {
              getData: () =>
                "project-planning",
            },
          },
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith({
              ...projects[0],
              status: "active",
            });
          },
        );
      },
    );

    it(
      "does not update when dropped into the current column",
      () => {
        const onStatus =
          vi.fn();

        const { container } =
          render(
            <ProjectsKanban
              projects={[
                projects[0]!,
              ]}
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                onStatus
              }
            />,
          );

        const card =
          container.querySelector(
            '[data-project-id="project-planning"]',
          );

        const planningColumn =
          container.querySelector(
            '[data-column-id="planning"]',
          );

        fireEvent.dragStart(
          card as HTMLElement,
          {
            dataTransfer: {
              effectAllowed:
                "move",
              setData:
                vi.fn(),
            },
          },
        );

        fireEvent.drop(
          planningColumn as HTMLElement,
          {
            dataTransfer: {
              getData: () =>
                "project-planning",
            },
          },
        );

        expect(
          onStatus,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "optimistically moves a project after dropping",
      async () => {
        const onStatus =
          vi.fn().mockResolvedValue(
            undefined,
          );

        const { container } =
          render(
            <ProjectsKanban
              projects={[
                projects[0]!,
              ]}
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                onStatus
              }
            />,
          );

        const card =
          container.querySelector(
            '[data-project-id="project-planning"]',
          );

        const activeColumn =
          container.querySelector(
            '[data-column-id="active"]',
          );

        fireEvent.dragStart(
          card as HTMLElement,
          {
            dataTransfer: {
              effectAllowed:
                "move",
              setData:
                vi.fn(),
            },
          },
        );

        fireEvent.drop(
          activeColumn as HTMLElement,
          {
            dataTransfer: {
              getData: () =>
                "project-planning",
            },
          },
        );

        await waitFor(
          () => {
            expect(
              within(
                activeColumn as HTMLElement,
              ).getByText(
                "Planning Project",
              ),
            ).toBeInTheDocument();
          },
        );

        expect(
          onStatus,
        ).toHaveBeenCalledWith({
          ...projects[0],
          status: "active",
        });
      },
    );

    it(
      "rolls back a project when the status update fails",
      async () => {
        const onStatus =
          vi.fn().mockRejectedValue(
            new Error(
              "Status request failed",
            ),
          );

        const { container } =
          render(
            <ProjectsKanban
              projects={[
                projects[0]!,
              ]}
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                onStatus
              }
            />,
          );

        const card =
          container.querySelector(
            '[data-project-id="project-planning"]',
          );

        const activeColumn =
          container.querySelector(
            '[data-column-id="active"]',
          );

        fireEvent.dragStart(
          card as HTMLElement,
          {
            dataTransfer: {
              effectAllowed:
                "move",
              setData:
                vi.fn(),
            },
          },
        );

        fireEvent.drop(
          activeColumn as HTMLElement,
          {
            dataTransfer: {
              getData: () =>
                "project-planning",
            },
          },
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "alert",
              ),
            ).toHaveTextContent(
              "Status request failed",
            );
          },
        );

        const planningColumn =
          container.querySelector(
            '[data-column-id="planning"]',
          );

        expect(
          within(
            planningColumn as HTMLElement,
          ).getByText(
            "Planning Project",
          ),
        ).toBeInTheDocument();

        expect(
          within(
            activeColumn as HTMLElement,
          ).queryByText(
            "Planning Project",
          ),
        ).toBeNull();
      },
    );

    it(
      "dismisses the move error",
      async () => {
        const { container } =
          render(
            <ProjectsKanban
              projects={[
                projects[0]!,
              ]}
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                vi
                  .fn()
                  .mockRejectedValue(
                    new Error(
                      "Move failed",
                    ),
                  )
              }
            />,
          );

        const card =
          container.querySelector(
            '[data-project-id="project-planning"]',
          );

        const activeColumn =
          container.querySelector(
            '[data-column-id="active"]',
          );

        fireEvent.dragStart(
          card as HTMLElement,
          {
            dataTransfer: {
              effectAllowed:
                "move",
              setData:
                vi.fn(),
            },
          },
        );

        fireEvent.drop(
          activeColumn as HTMLElement,
        );

        await screen.findByRole(
          "alert",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Dismiss",
            },
          ),
        );

        expect(
          screen.queryByRole(
            "alert",
          ),
        ).toBeNull();
      },
    );

    it(
      "opens a project from its card",
      () => {
        const onSelect =
          vi.fn();

        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={
              onSelect
            }
            onStatus={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Open Active Project",
            },
          ),
        );

        expect(
          onSelect,
        ).toHaveBeenCalledWith(
          projects[1],
        );
      },
    );

    it(
      "opens a project with the keyboard",
      () => {
        const onSelect =
          vi.fn();

        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={
              onSelect
            }
            onStatus={
              vi.fn()
            }
          />,
        );

        fireEvent.keyDown(
          screen.getByRole(
            "button",
            {
              name:
                "Open Planning Project",
            },
          ),
          {
            key: "Enter",
          },
        );

        expect(
          onSelect,
        ).toHaveBeenCalledWith(
          projects[0],
        );
      },
    );

    it(
      "runs status update without opening the card",
      () => {
        const onSelect =
          vi.fn();

        const onStatus =
          vi.fn();

        render(
          <ProjectsKanban
            projects={[
              projects[0]!,
            ]}
            busy={false}
            onSelect={
              onSelect
            }
            onStatus={
              onStatus
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "projects.updateStatus",
            },
          ),
        );

        expect(
          onStatus,
        ).toHaveBeenCalledWith(
          projects[0],
        );

        expect(
          onSelect,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "sorts cards by updated date descending",
      () => {
        const planningProjects:
          EnterpriseProject[] = [
          {
            ...projects[0]!,
            id: "older",
            name: "Older Project",
            updatedAt:
              "2026-08-01T08:00:00.000Z",
          },
          {
            ...projects[0]!,
            id: "newer",
            name: "Newer Project",
            updatedAt:
              "2026-08-05T08:00:00.000Z",
          },
        ];

        const { container } =
          render(
            <ProjectsKanban
              projects={
                planningProjects
              }
              busy={false}
              onSelect={
                vi.fn()
              }
              onStatus={
                vi.fn()
              }
            />,
          );

        const planning =
          container.querySelector(
            '[data-column-id="planning"]',
          );

        const cards =
          within(
            planning as HTMLElement,
          ).getAllByRole(
            "button",
            {
              name:
                /Open .* Project/,
            },
          );

        expect(
          cards[0],
        ).toHaveAccessibleName(
          "Open Newer Project",
        );

        expect(
          cards[1],
        ).toHaveAccessibleName(
          "Open Older Project",
        );
      },
    );

    it(
      "renders an empty workspace",
      () => {
        render(
          <ProjectsKanban
            projects={[]}
            busy={false}
            onSelect={
              vi.fn()
            }
            onStatus={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByText(
            "projects.noProjects",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "projects.adjustFilters",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
