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

import ProjectDetailsPanel from "./ProjectDetailsPanel";

const project: EnterpriseProject = {
  id: "project-1",
  name: "CreatorOS Media Project",
  description:
    "Build an intelligent content production workspace.",
  platform: "YouTube",
  status: "planning",
  createdAt:
    "2026-08-01T08:00:00.000Z",
  updatedAt:
    "2026-08-02T09:30:00.000Z",
};

describe(
  "ProjectDetailsPanel",
  () => {
    it(
      "does not render without a project",
      () => {
        const { container } =
          render(
            <ProjectDetailsPanel
              project={null}
              busy={false}
              onClose={vi.fn()}
              onStatus={vi.fn()}
              onDelete={vi.fn()}
            />,
          );

        expect(
          container,
        ).toBeEmptyDOMElement();
      },
    );

    it(
      "renders the complete project workspace",
      () => {
        render(
          <ProjectDetailsPanel
            project={project}
            busy={false}
            onClose={vi.fn()}
            onStatus={vi.fn()}
            onDelete={vi.fn()}
          />,
        );

        expect(
          screen.getByRole(
            "dialog",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "CreatorOS Media Project",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            project.description,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Project health",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "AI readiness",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "closes from the close button",
      () => {
        const onClose =
          vi.fn();

        render(
          <ProjectDetailsPanel
            project={project}
            busy={false}
            onClose={onClose}
            onStatus={vi.fn()}
            onDelete={vi.fn()}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Close project details",
            },
          ),
        );

        expect(
          onClose,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "moves the project to the next status",
      () => {
        const onStatus =
          vi.fn();

        render(
          <ProjectDetailsPanel
            project={project}
            busy={false}
            onClose={vi.fn()}
            onStatus={onStatus}
            onDelete={vi.fn()}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Move to active",
            },
          ),
        );

        expect(
          onStatus,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onStatus,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            id: project.id,
            status: "active",
          }),
        );
      },
    );

    it(
      "runs project deletion",
      () => {
        const onDelete =
          vi.fn();

        render(
          <ProjectDetailsPanel
            project={project}
            busy={false}
            onClose={vi.fn()}
            onStatus={vi.fn()}
            onDelete={onDelete}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete project",
            },
          ),
        );

        expect(
          onDelete,
        ).toHaveBeenCalledWith(
          project,
        );
      },
    );

    it(
      "disables destructive actions while busy",
      () => {
        render(
          <ProjectDetailsPanel
            project={project}
            busy
            onClose={vi.fn()}
            onStatus={vi.fn()}
            onDelete={vi.fn()}
          />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Updating...",
            },
          ),
        ).toBeDisabled();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Delete project",
            },
          ),
        ).toBeDisabled();
      },
    );
  },
);
