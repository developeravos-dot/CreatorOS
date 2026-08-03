import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  PROJECT_AI_ASSISTANT_STORAGE_KEY,
} from "./project-ai-assistant-storage";

import ProjectAIAssistantWorkspace from "./ProjectAIAssistantWorkspace";

const project:
  EnterpriseProject = {
    id:
      "project-ai-ui",
    name:
      "AI Assistant UI Project",
    description:
      "Build an original content production workflow.",
    platform:
      "YouTube",
    status:
      "planning",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-02T08:00:00.000Z",
  };

describe(
  "ProjectAIAssistantWorkspace",
  () => {
    beforeEach(
      () => {
        window.localStorage
          .clear();
      },
    );

    it(
      "renders project context",
      () => {
        render(
          <ProjectAIAssistantWorkspace
            project={project}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Project AI assistant",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "planning",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "No assistant conversation has been created.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "generates a project summary",
      () => {
        render(
          <ProjectAIAssistantWorkspace
            project={project}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Generate insight",
            },
          ),
        );

        expect(
          screen.getByText(
            "Generated response",
          ),
        ).toBeInTheDocument();

        const generatedResponse =
          screen
            .getByText(
              "Generated response",
            )
            .closest<HTMLElement>(
              ".projects-v2-ai-assistant__response",
            );

        expect(generatedResponse)
          .not.toBeNull();

        expect(
          within(
            generatedResponse!,
          ).getByText(
            /AI Assistant UI Project is a planning project/,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "2 messages",
          ),
        ).toBeInTheDocument();

        expect(
          window.localStorage
            .getItem(
              PROJECT_AI_ASSISTANT_STORAGE_KEY,
            ),
        ).toContain(
          "AI Assistant UI Project",
        );
      },
    );

    it(
      "changes assistant modes",
      () => {
        render(
          <ProjectAIAssistantWorkspace
            project={project}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Next actions/,
            },
          ),
        );

        expect(
          screen.getByLabelText(
            "Assistant request",
          ),
        ).toHaveValue(
          "What should be done next?",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Generate insight",
            },
          ),
        );

        expect(
          screen.getByText(
            "Recommended actions",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Define the project outcome",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "requires a custom request",
      () => {
        render(
          <ProjectAIAssistantWorkspace
            project={project}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Custom request/,
            },
          ),
        );

        const submit =
          screen.getByRole(
            "button",
            {
              name:
                "Generate insight",
            },
          );

        expect(submit)
          .toBeDisabled();

        fireEvent.change(
          screen.getByLabelText(
            "Assistant request",
          ),
          {
            target: {
              value:
                "How can this project improve?",
            },
          },
        );

        expect(submit)
          .toBeEnabled();
      },
    );

    it(
      "clears the conversation",
      () => {
        render(
          <ProjectAIAssistantWorkspace
            project={project}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Generate insight",
            },
          ),
        );

        const history =
          screen
            .getByRole(
              "heading",
              {
                name:
                  "Conversation history",
              },
            )
            .parentElement
            ?.parentElement;

        expect(history)
          .not.toBeNull();

        expect(
          within(
            history!,
          ).getByText(
            "2 messages",
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Clear conversation",
            },
          ),
        );

        expect(
          screen.getByText(
            "No assistant conversation has been created.",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
