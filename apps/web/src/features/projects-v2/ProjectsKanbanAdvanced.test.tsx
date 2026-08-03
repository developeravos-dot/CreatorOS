import {
  fireEvent,
  render,
  screen,
  waitFor,
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
      ): string => key,
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
  ];

describe(
  "ProjectsKanban advanced state integration",
  () => {
    it(
      "selects and clears projects",
      () => {
        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={vi.fn()}
            onStatus={vi.fn()}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Planning Project",
            },
          ),
        );

        expect(
          screen.getByText(
            "1 selected",
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
          screen.getByText(
            "0 selected",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "moves selected projects in bulk",
      async () => {
        const onStatus =
          vi.fn().mockResolvedValue(
            undefined,
          );

        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={vi.fn()}
            onStatus={onStatus}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Planning Project",
            },
          ),
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Bulk move status",
            },
          ),
          {
            target: {
              value: "paused",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Move selected",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                id:
                  "project-planning",
                status: "paused",
              }),
            );
          },
        );

        expect(
          screen.getByText(
            "0 selected",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name: "Undo",
            },
          ),
        ).toBeEnabled();
      },
    );

    it(
      "supports undo and redo",
      async () => {
        const onStatus =
          vi.fn().mockResolvedValue(
            undefined,
          );

        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={vi.fn()}
            onStatus={onStatus}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Planning Project",
            },
          ),
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Bulk move status",
            },
          ),
          {
            target: {
              value: "paused",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Move selected",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "button",
                {
                  name: "Undo",
                },
              ),
            ).toBeEnabled();
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Undo",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                id:
                  "project-planning",
                status:
                  "planning",
              }),
            );
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Redo",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                id:
                  "project-planning",
                status: "paused",
              }),
            );
          },
        );
      },
    );

    it(
      "supports keyboard undo and redo",
      async () => {
        const onStatus =
          vi.fn().mockResolvedValue(
            undefined,
          );

        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={vi.fn()}
            onStatus={onStatus}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Planning Project",
            },
          ),
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Bulk move status",
            },
          ),
          {
            target: {
              value: "paused",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Move selected",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "button",
                {
                  name: "Undo",
                },
              ),
            ).toBeEnabled();
          },
        );

        fireEvent.keyDown(
          window,
          {
            key: "z",
            ctrlKey: true,
          },
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                status:
                  "planning",
              }),
            );
          },
        );

        fireEvent.keyDown(
          window,
          {
            key: "y",
            ctrlKey: true,
          },
        );

        await waitFor(
          () => {
            expect(
              onStatus,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                status: "paused",
              }),
            );
          },
        );
      },
    );

    it(
      "rolls back a failed bulk move",
      async () => {
        const onStatus =
          vi.fn().mockRejectedValue(
            new Error(
              "Bulk move failed",
            ),
          );

        render(
          <ProjectsKanban
            projects={projects}
            busy={false}
            onSelect={vi.fn()}
            onStatus={onStatus}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select Planning Project",
            },
          ),
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Bulk move status",
            },
          ),
          {
            target: {
              value: "paused",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Move selected",
            },
          ),
        );

        expect(
          await screen.findByRole(
            "alert",
          ),
        ).toHaveTextContent(
          "Bulk move failed",
        );
      },
    );
  },
);
