import {
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  createProjectNoteActivity,
  createProjectStatusActivity,
} from "./project-activity-engine";

import ProjectActivityTimeline from "./ProjectActivityTimeline";

const project:
  EnterpriseProject = {
    id: "project-timeline",
    name: "Timeline Project",
    description:
      "Timeline project description.",
    platform: "YouTube",
    status: "active",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-03T09:30:00.000Z",
  };

describe(
  "ProjectActivityTimeline",
  () => {
    it(
      "renders generated project activity",
      () => {
        render(
          <ProjectActivityTimeline
            project={project}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Project timeline",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Project created",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Project updated",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "2 events",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders status changes and notes",
      () => {
        const statusActivity =
          createProjectStatusActivity(
            project,
            "planning",
            "active",
            "2026-08-02T10:00:00.000Z",
            "Project Manager",
          );

        const noteActivity =
          createProjectNoteActivity(
            project,
            "Ready for production.",
            "2026-08-04T11:00:00.000Z",
            "Creative Lead",
          );

        render(
          <ProjectActivityTimeline
            project={project}
            activities={[
              statusActivity,
              noteActivity,
            ]}
          />,
        );

        expect(
          screen.getByText(
            "Project status changed",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Ready for production.",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "4 events",
          ),
        ).toBeInTheDocument();

        const statusSummary =
          screen
            .getByText(
              "Status changes",
            )
            .closest("article");

        expect(statusSummary)
          .not.toBeNull();

        expect(
          within(
            statusSummary!,
          ).getByText("1"),
        ).toBeInTheDocument();

        const notesSummary =
          screen
            .getByText("Notes")
            .closest("article");

        expect(notesSummary)
          .not.toBeNull();

        expect(
          within(
            notesSummary!,
          ).getByText("1"),
        ).toBeInTheDocument();
      },
    );

    it(
      "groups events by date",
      () => {
        render(
          <ProjectActivityTimeline
            project={project}
            activities={[
              createProjectNoteActivity(
                project,
                "First note",
                "2026-08-04T08:00:00.000Z",
              ),
              createProjectNoteActivity(
                project,
                "Second note",
                "2026-08-04T10:00:00.000Z",
              ),
            ]}
          />,
        );

        const group =
          screen.getByRole(
            "region",
            {
              name:
                "Aug 4, 2026",
            },
          );

        expect(
          within(group).getByText(
            "First note",
          ),
        ).toBeInTheDocument();

        expect(
          within(group).getByText(
            "Second note",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
