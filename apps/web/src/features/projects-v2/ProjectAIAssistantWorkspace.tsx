import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  appendProjectAssistantMessage,
  createProjectAssistantMessage,
  createProjectAssistantRequest,
  generateLocalProjectAssistantResponse,
  type ProjectAssistantConversation,
  type ProjectAssistantMode,
  type ProjectAssistantResponse,
} from "./project-ai-assistant-engine";

import {
  clearProjectAssistantConversation,
  loadProjectAssistantConversation,
  saveProjectAssistantConversation,
} from "./project-ai-assistant-storage";

import {
  loadAssetsForProject,
} from "./project-assets-storage";

import {
  buildProjectActivities,
} from "./project-activity-engine";

interface ProjectAIAssistantWorkspaceProps {
  project: EnterpriseProject;
}

const MODES:
  readonly {
    readonly value:
      ProjectAssistantMode;
    readonly label: string;
    readonly description: string;
  }[] = [
    {
      value:
        "project-summary",
      label:
        "Project summary",
      description:
        "Summarize the current project state.",
    },
    {
      value:
        "next-actions",
      label:
        "Next actions",
      description:
        "Generate prioritized execution steps.",
    },
    {
      value:
        "risk-review",
      label:
        "Risk review",
      description:
        "Identify blockers, warnings, and risks.",
    },
    {
      value:
        "content-brief",
      label:
        "Content brief",
      description:
        "Generate a platform-focused production brief.",
    },
    {
      value:
        "custom",
      label:
        "Custom request",
      description:
        "Ask a project-specific question.",
    },
  ];

function modeDefaultPrompt(
  mode:
    ProjectAssistantMode,
): string {
  switch (mode) {
    case "project-summary":
      return "Summarize this project.";

    case "next-actions":
      return "What should be done next?";

    case "risk-review":
      return "Review the project risks.";

    case "content-brief":
      return "Create a production-ready content brief.";

    case "custom":
      return "";
  }
}

export default function ProjectAIAssistantWorkspace({
  project,
}: ProjectAIAssistantWorkspaceProps) {
  const [
    mode,
    setMode,
  ] = useState<ProjectAssistantMode>(
    "project-summary",
  );

  const [
    prompt,
    setPrompt,
  ] = useState(
    modeDefaultPrompt(
      "project-summary",
    ),
  );

  const [
    conversation,
    setConversation,
  ] = useState<ProjectAssistantConversation>(
    () =>
      loadProjectAssistantConversation(
        project.id,
      ),
  );

  const [
    latestResponse,
    setLatestResponse,
  ] = useState<
    ProjectAssistantResponse | null
  >(null);

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const assetCount =
    useMemo(
      () =>
        loadAssetsForProject(
          project.id,
        ).length,
      [project.id],
    );

  const activityCount =
    useMemo(
      () =>
        buildProjectActivities(
          project,
        ).length,
      [project],
    );

  const persistConversation = (
    nextConversation:
      ProjectAssistantConversation,
  ): void => {
    setConversation(
      nextConversation,
    );

    saveProjectAssistantConversation(
      nextConversation,
    );
  };

  const handleModeChange = (
    nextMode:
      ProjectAssistantMode,
  ): void => {
    setMode(nextMode);

    setPrompt(
      modeDefaultPrompt(
        nextMode,
      ),
    );
  };

  const runAssistant = (
    event:
      FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (
      generating ||
      (
        mode === "custom" &&
        !prompt.trim()
      )
    ) {
      return;
    }

    setGenerating(true);

    const request =
      createProjectAssistantRequest(
        {
          project,
          assetCount,
          activityCount,
        },
        mode,
        prompt,
      );

    const response =
      generateLocalProjectAssistantResponse(
        request,
      );

    const userMessage =
      createProjectAssistantMessage(
        project.id,
        "user",
        prompt ||
          modeDefaultPrompt(
            mode,
          ),
        mode,
        request.createdAt,
      );

    const assistantMessage =
      createProjectAssistantMessage(
        project.id,
        "assistant",
        response.answer,
        mode,
        response.generatedAt,
      );

    const nextConversation =
      appendProjectAssistantMessage(
        appendProjectAssistantMessage(
          conversation,
          userMessage,
        ),
        assistantMessage,
      );

    persistConversation(
      nextConversation,
    );

    setLatestResponse(
      response,
    );

    setGenerating(false);
  };

  const clearConversation =
    (): void => {
      clearProjectAssistantConversation(
        project.id,
      );

      const emptyConversation =
        loadProjectAssistantConversation(
          project.id,
        );

      setConversation(
        emptyConversation,
      );

      setLatestResponse(
        null,
      );
    };

  return (
    <section
      className="projects-v2-ai-assistant"
      aria-labelledby="project-ai-assistant-title"
    >
      <header className="projects-v2-ai-assistant__header">
        <div>
          <span>
            AI intelligence
          </span>

          <h3 id="project-ai-assistant-title">
            Project AI assistant
          </h3>
        </div>

        <strong>
          Local intelligence
        </strong>
      </header>

      <div className="projects-v2-ai-assistant__context">
        <article>
          <strong>
            {project.status}
          </strong>

          <span>
            Project status
          </span>
        </article>

        <article>
          <strong>
            {assetCount}
          </strong>

          <span>
            Assets
          </span>
        </article>

        <article>
          <strong>
            {activityCount}
          </strong>

          <span>
            Activities
          </span>
        </article>

        <article>
          <strong>
            {conversation.messages.length}
          </strong>

          <span>
            Messages
          </span>
        </article>
      </div>

      <div className="projects-v2-ai-assistant__modes">
        {MODES.map(
          (item) => (
            <button
              type="button"
              key={item.value}
              className={
                mode ===
                item.value
                  ? "projects-v2-ai-assistant__mode--active"
                  : ""
              }
              aria-pressed={
                mode ===
                item.value
              }
              onClick={() =>
                handleModeChange(
                  item.value,
                )
              }
            >
              <strong>
                {item.label}
              </strong>

              <span>
                {item.description}
              </span>
            </button>
          ),
        )}
      </div>

      <form
        className="projects-v2-ai-assistant__form"
        onSubmit={
          runAssistant
        }
      >
        <label>
          <span>
            Assistant request
          </span>

          <textarea
            aria-label="Assistant request"
            value={prompt}
            rows={4}
            placeholder="Ask the assistant about this project"
            onChange={(event) =>
              setPrompt(
                event.target.value,
              )
            }
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={
              generating ||
              (
                mode ===
                  "custom" &&
                !prompt.trim()
              )
            }
          >
            {generating
              ? "Generating..."
              : "Generate insight"}
          </button>

          <button
            type="button"
            disabled={
              conversation
                .messages.length ===
              0
            }
            onClick={
              clearConversation
            }
          >
            Clear conversation
          </button>
        </div>
      </form>

      {latestResponse ? (
        <div className="projects-v2-ai-assistant__response">
          <header>
            <div>
              <span>
                Generated response
              </span>

              <h4>
                {
                  MODES.find(
                    (item) =>
                      item.value ===
                      latestResponse.mode,
                  )?.label
                }
              </h4>
            </div>

            <small>
              {
                latestResponse.provider
              }
            </small>
          </header>

          <p>
            {latestResponse.answer}
          </p>

          <div className="projects-v2-ai-assistant__response-grid">
            <section>
              <h5>
                Recommended actions
              </h5>

              <ol>
                {latestResponse.actions.map(
                  (action) => (
                    <li
                      key={action.id}
                      data-priority={
                        action.priority
                      }
                    >
                      <strong>
                        {action.title}
                      </strong>

                      <p>
                        {action.description}
                      </p>

                      <small>
                        {action.priority}
                        {" · "}
                        {action.category}
                      </small>
                    </li>
                  ),
                )}
              </ol>
            </section>

            <section>
              <h5>
                Insights and risks
              </h5>

              <ol>
                {latestResponse.insights.map(
                  (insight) => (
                    <li
                      key={insight.id}
                      data-severity={
                        insight.severity
                      }
                    >
                      <strong>
                        {insight.title}
                      </strong>

                      <p>
                        {insight.description}
                      </p>

                      <small>
                        {insight.type}
                        {" · "}
                        {insight.severity}
                      </small>
                    </li>
                  ),
                )}
              </ol>
            </section>
          </div>
        </div>
      ) : null}

      <div className="projects-v2-ai-assistant__conversation">
        <header>
          <h4>
            Conversation history
          </h4>

          <span>
            {
              conversation.messages
                .length
            }
            {" messages"}
          </span>
        </header>

        {conversation.messages.length ===
        0 ? (
          <p>
            No assistant conversation has been created.
          </p>
        ) : (
          <ol>
            {conversation.messages.map(
              (message) => (
                <li
                  key={message.id}
                  data-role={
                    message.role
                  }
                >
                  <strong>
                    {message.role ===
                    "assistant"
                      ? "CreatorOS Assistant"
                      : "You"}
                  </strong>

                  <p>
                    {message.content}
                  </p>

                  <small>
                    {message.mode}
                  </small>
                </li>
              ),
            )}
          </ol>
        )}
      </div>
    </section>
  );
}
