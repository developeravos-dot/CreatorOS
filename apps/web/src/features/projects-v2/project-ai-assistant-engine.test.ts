import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  appendProjectAssistantMessage,
  buildProjectAssistantPrompt,
  createProjectAssistantConversation,
  createProjectAssistantMessage,
  createProjectAssistantRequest,
  generateLocalProjectAssistantResponse,
} from "./project-ai-assistant-engine";

const project:
  EnterpriseProject = {
    id:
      "project-ai-assistant",
    name:
      "AI Assistant Project",
    description:
      "Produce an original YouTube content series.",
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
  "project AI assistant engine",
  () => {
    it(
      "creates normalized requests",
      () => {
        const request =
          createProjectAssistantRequest(
            {
              project,
              assetCount: 3,
              activityCount: 4,
              additionalContext:
                "  Audience is global.  ",
            },
            "custom",
            "  What should we do next?  ",
            "2026-08-03T08:00:00.000Z",
          );

        expect(request.mode)
          .toBe("custom");

        expect(request.prompt)
          .toBe(
            "What should we do next?",
          );

        expect(
          request.context
            .additionalContext,
        ).toBe(
          "Audience is global.",
        );
      },
    );

    it(
      "generates local project summaries",
      () => {
        const request =
          createProjectAssistantRequest(
            {
              project,
              assetCount: 2,
              activityCount: 5,
            },
            "project-summary",
            "",
            "2026-08-03T08:00:00.000Z",
          );

        const response =
          generateLocalProjectAssistantResponse(
            request,
            "2026-08-03T08:01:00.000Z",
          );

        expect(response.provider)
          .toBe(
            "local-intelligence",
          );

        expect(response.summary)
          .toContain(
            "AI Assistant Project",
          );

        expect(response.summary)
          .toContain(
            "2 assets",
          );

        expect(response.actions)
          .toHaveLength(1);
      },
    );

    it(
      "generates next actions from project status",
      () => {
        const request =
          createProjectAssistantRequest(
            {
              project,
            },
            "next-actions",
          );

        const response =
          generateLocalProjectAssistantResponse(
            request,
          );

        expect(
          response.actions.map(
            (action) =>
              action.id,
          ),
        ).toEqual([
          "define-outcome",
          "prepare-production",
        ]);
      },
    );

    it(
      "generates risk insights",
      () => {
        const emptyProject = {
          ...project,
          description: "",
          status:
            "paused" as const,
        };

        const request =
          createProjectAssistantRequest(
            {
              project:
                emptyProject,
              assetCount: 0,
              activityCount: 0,
            },
            "risk-review",
          );

        const response =
          generateLocalProjectAssistantResponse(
            request,
          );

        expect(
          response.insights.some(
            (insight) =>
              insight.id ===
              "paused-project-risk",
          ),
        ).toBe(true);

        expect(
          response.insights.some(
            (insight) =>
              insight.id ===
              "missing-description",
          ),
        ).toBe(true);

        expect(
          response.insights.some(
            (insight) =>
              insight.id ===
              "no-project-assets",
          ),
        ).toBe(true);
      },
    );

    it(
      "creates and appends conversation messages",
      () => {
        const first =
          createProjectAssistantMessage(
            project.id,
            "user",
            "Summarize this project.",
            "project-summary",
            "2026-08-03T08:00:00.000Z",
          );

        const second =
          createProjectAssistantMessage(
            project.id,
            "assistant",
            "Project summary.",
            "project-summary",
            "2026-08-03T08:01:00.000Z",
          );

        let conversation =
          createProjectAssistantConversation(
            project.id,
            [first],
          );

        conversation =
          appendProjectAssistantMessage(
            conversation,
            second,
          );

        expect(
          conversation.messages,
        ).toHaveLength(2);

        expect(
          conversation.messages[1]
            ?.role,
        ).toBe("assistant");
      },
    );

    it(
      "ignores messages for another project",
      () => {
        const conversation =
          createProjectAssistantConversation(
            project.id,
          );

        const foreignMessage =
          createProjectAssistantMessage(
            "foreign-project",
            "user",
            "Foreign message",
            "custom",
          );

        expect(
          appendProjectAssistantMessage(
            conversation,
            foreignMessage,
          ),
        ).toBe(
          conversation,
        );
      },
    );

    it(
      "builds an external provider prompt",
      () => {
        const request =
          createProjectAssistantRequest(
            {
              project,
              assetCount: 5,
              activityCount: 8,
              selectedProjectCount: 2,
              additionalContext:
                "Use a cinematic tone.",
            },
            "content-brief",
            "Create a production brief.",
          );

        const prompt =
          buildProjectAssistantPrompt(
            request,
          );

        expect(prompt)
          .toContain(
            "CreatorOS AI Project Assistant",
          );

        expect(prompt)
          .toContain(
            "Assets: 5",
          );

        expect(prompt)
          .toContain(
            "Activities: 8",
          );

        expect(prompt)
          .toContain(
            "Use a cinematic tone.",
          );
      },
    );
  },
);
