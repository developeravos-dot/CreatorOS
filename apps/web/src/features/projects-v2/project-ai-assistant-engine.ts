import type {
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

export type ProjectAssistantMode =
  | "project-summary"
  | "next-actions"
  | "risk-review"
  | "content-brief"
  | "custom";

export type ProjectAssistantMessageRole =
  | "user"
  | "assistant"
  | "system";

export type ProjectAssistantPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ProjectAssistantMessage {
  readonly id: string;
  readonly projectId: string;
  readonly role:
    ProjectAssistantMessageRole;
  readonly content: string;
  readonly createdAt: string;
  readonly mode:
    ProjectAssistantMode;
}

export interface ProjectAssistantAction {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority:
    ProjectAssistantPriority;
  readonly category:
    | "planning"
    | "production"
    | "publishing"
    | "quality"
    | "growth"
    | "risk";
}

export interface ProjectAssistantInsight {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly severity:
    ProjectAssistantPriority;
  readonly type:
    | "strength"
    | "opportunity"
    | "risk"
    | "warning";
}

export interface ProjectAssistantProjectContext {
  readonly project:
    EnterpriseProject;
  readonly assetCount?: number;
  readonly activityCount?: number;
  readonly selectedProjectCount?: number;
  readonly additionalContext?: string;
}

export interface ProjectAssistantRequest {
  readonly id: string;
  readonly mode:
    ProjectAssistantMode;
  readonly prompt: string;
  readonly context:
    ProjectAssistantProjectContext;
  readonly createdAt: string;
}

export interface ProjectAssistantResponse {
  readonly id: string;
  readonly requestId: string;
  readonly projectId: string;
  readonly mode:
    ProjectAssistantMode;
  readonly summary: string;
  readonly answer: string;
  readonly actions:
    readonly ProjectAssistantAction[];
  readonly insights:
    readonly ProjectAssistantInsight[];
  readonly generatedAt: string;
  readonly provider:
    "local-intelligence"
    | "external-ai";
}

export interface ProjectAssistantConversation {
  readonly projectId: string;
  readonly messages:
    readonly ProjectAssistantMessage[];
  readonly updatedAt: string;
}

const STATUS_NEXT_ACTIONS:
  Readonly<
    Record<
      ProjectStatus,
      readonly ProjectAssistantAction[]
    >
  > = {
  planning: [
    {
      id: "define-outcome",
      title:
        "Define the project outcome",
      description:
        "Write one measurable result that determines whether this project succeeds.",
      priority: "high",
      category: "planning",
    },
    {
      id: "prepare-production",
      title:
        "Prepare the production plan",
      description:
        "Confirm the content format, required assets, owner, and production deadline.",
      priority: "high",
      category: "production",
    },
  ],
  active: [
    {
      id: "review-progress",
      title:
        "Review active progress",
      description:
        "Compare completed work with the intended outcome and identify the next blocking task.",
      priority: "high",
      category: "production",
    },
    {
      id: "quality-check",
      title:
        "Run a quality checkpoint",
      description:
        "Review consistency, platform fit, copyright safety, and audience clarity before publishing.",
      priority: "medium",
      category: "quality",
    },
  ],
  paused: [
    {
      id: "resolve-blocker",
      title:
        "Resolve the primary blocker",
      description:
        "Document why the project is paused and assign one concrete action to restart it.",
      priority: "critical",
      category: "risk",
    },
    {
      id: "reassess-priority",
      title:
        "Reassess project priority",
      description:
        "Decide whether to resume, rescope, archive, or replace the project.",
      priority: "high",
      category: "planning",
    },
  ],
  completed: [
    {
      id: "review-performance",
      title:
        "Review project performance",
      description:
        "Capture outcomes, lessons, reusable assets, and improvements for the next project.",
      priority: "medium",
      category: "growth",
    },
    {
      id: "repurpose-content",
      title:
        "Plan content repurposing",
      description:
        "Identify clips, translations, follow-up content, and derivative formats.",
      priority: "medium",
      category: "publishing",
    },
  ],
};

function normalizeTimestamp(
  value:
    string | undefined,
): string {
  if (!value) {
    return new Date()
      .toISOString();
  }

  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return value;
  }

  return new Date(
    parsed,
  ).toISOString();
}

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}

function createStableId(
  ...parts:
    readonly string[]
): string {
  return parts
    .map(
      (part) =>
        normalizeText(part)
          .toLocaleLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-",
          )
          .replace(
            /^-+|-+$/g,
            "",
          ),
    )
    .filter(Boolean)
    .join("-");
}

function cloneAction(
  action:
    ProjectAssistantAction,
): ProjectAssistantAction {
  return {
    ...action,
  };
}

function createProjectSummary(
  context:
    ProjectAssistantProjectContext,
): string {
  const {
    project,
    assetCount = 0,
    activityCount = 0,
  } = context;

  const description =
    project.description.trim() ||
    "No project description is currently available.";

  return [
    `${project.name} is a ${project.status} project for ${project.platform}.`,
    description,
    `The workspace currently contains ${assetCount} assets and ${activityCount} recorded activities.`,
  ].join(" ");
}

function createStatusInsight(
  project:
    EnterpriseProject,
): ProjectAssistantInsight {
  switch (
    project.status
  ) {
    case "planning":
      return {
        id: "planning-clarity",
        title:
          "Planning clarity required",
        description:
          "The project should have a measurable outcome, production scope, and clear next milestone before execution expands.",
        severity: "medium",
        type: "opportunity",
      };

    case "active":
      return {
        id: "active-delivery",
        title:
          "Active delivery window",
        description:
          "The project is currently active, so progress visibility and quality checkpoints are the main priorities.",
        severity: "medium",
        type: "strength",
      };

    case "paused":
      return {
        id: "paused-project-risk",
        title:
          "Paused project risk",
        description:
          "A paused project can lose momentum unless the blocker, owner, and restart decision are documented.",
        severity: "high",
        type: "risk",
      };

    case "completed":
      return {
        id: "completed-reuse",
        title:
          "Reuse completed work",
        description:
          "Completed projects can generate additional value through analysis, repurposing, localization, and reusable assets.",
        severity: "low",
        type: "opportunity",
      };
  }
}

function createContextInsights(
  context:
    ProjectAssistantProjectContext,
): ProjectAssistantInsight[] {
  const insights: ProjectAssistantInsight[] = [
    createStatusInsight(
      context.project,
    ),
  ];

  if (
    !context.project.description
      .trim()
  ) {
    insights.push({
      id:
        "missing-description",
      title:
        "Project description missing",
      description:
        "The assistant has limited context because the project description is empty.",
      severity: "high",
      type: "warning",
    });
  }

  if (
    (context.assetCount ?? 0) ===
    0
  ) {
    insights.push({
      id:
        "no-project-assets",
      title:
        "No project assets",
      description:
        "The project currently has no recorded files or assets in its workspace.",
      severity: "medium",
      type: "warning",
    });
  }

  if (
    (context.activityCount ?? 0) ===
    0
  ) {
    insights.push({
      id:
        "limited-activity-history",
      title:
        "Limited activity history",
      description:
        "No additional activity history was supplied, so progress analysis is limited.",
      severity: "low",
      type: "warning",
    });
  }

  return insights;
}

function buildModeAnswer(
  request:
    ProjectAssistantRequest,
): string {
  const {
    project,
    additionalContext,
  } = request.context;

  switch (request.mode) {
    case "project-summary":
      return createProjectSummary(
        request.context,
      );

    case "next-actions":
      return [
        `The next work for ${project.name} should focus on the highest-priority action for its ${project.status} stage.`,
        "Complete one action at a time, record the result, and reassess the project state after each milestone.",
      ].join(" ");

    case "risk-review":
      return [
        `The current risk review for ${project.name} is based on its ${project.status} status, available assets, and activity history.`,
        "Resolve high-severity warnings before increasing production effort or publishing.",
      ].join(" ");

    case "content-brief":
      return [
        `Create a ${project.platform}-appropriate content brief for ${project.name}.`,
        `The brief should define the audience, hook, core promise, structure, visual direction, call to action, and quality criteria.`,
      ].join(" ");

    case "custom":
      return [
        `Assistant response for ${project.name}:`,
        normalizeText(
          request.prompt,
        ) ||
          "No custom question was supplied.",
        additionalContext
          ? `Additional context: ${normalizeText(additionalContext)}`
          : "",
      ]
        .filter(Boolean)
        .join(" ");
  }
}

export function createProjectAssistantRequest(
  context:
    ProjectAssistantProjectContext,
  mode:
    ProjectAssistantMode,
  prompt = "",
  createdAt?:
    string,
): ProjectAssistantRequest {
  const timestamp =
    normalizeTimestamp(
      createdAt,
    );

  return {
    id:
      createStableId(
        context.project.id,
        mode,
        timestamp,
      ),
    mode,
    prompt:
      normalizeText(prompt),
    context: {
      ...context,
      additionalContext:
        context.additionalContext
          ? normalizeText(
              context.additionalContext,
            )
          : undefined,
    },
    createdAt:
      timestamp,
  };
}

export function generateLocalProjectAssistantResponse(
  request:
    ProjectAssistantRequest,
  generatedAt?:
    string,
): ProjectAssistantResponse {
  const timestamp =
    normalizeTimestamp(
      generatedAt,
    );

  const baseActions =
    STATUS_NEXT_ACTIONS[
      request.context.project.status
    ].map(
      cloneAction,
    );

  const actions =
    request.mode ===
    "project-summary"
      ? baseActions.slice(
          0,
          1,
        )
      : baseActions;

  return {
    id:
      createStableId(
        request.id,
        "response",
        timestamp,
      ),
    requestId:
      request.id,
    projectId:
      request.context.project.id,
    mode:
      request.mode,
    summary:
      createProjectSummary(
        request.context,
      ),
    answer:
      buildModeAnswer(
        request,
      ),
    actions,
    insights:
      createContextInsights(
        request.context,
      ),
    generatedAt:
      timestamp,
    provider:
      "local-intelligence",
  };
}

export function createProjectAssistantMessage(
  projectId: string,
  role:
    ProjectAssistantMessageRole,
  content: string,
  mode:
    ProjectAssistantMode,
  createdAt?:
    string,
): ProjectAssistantMessage {
  const timestamp =
    normalizeTimestamp(
      createdAt,
    );

  const normalizedContent =
    normalizeText(content);

  return {
    id:
      createStableId(
        projectId,
        role,
        mode,
        timestamp,
        normalizedContent,
      ),
    projectId,
    role,
    content:
      normalizedContent,
    createdAt:
      timestamp,
    mode,
  };
}

export function appendProjectAssistantMessage(
  conversation:
    ProjectAssistantConversation,
  message:
    ProjectAssistantMessage,
): ProjectAssistantConversation {
  if (
    message.projectId !==
    conversation.projectId
  ) {
    return conversation;
  }

  const messagesById =
    new Map(
      conversation.messages.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  messagesById.set(
    message.id,
    message,
  );

  const messages = [
    ...messagesById.values(),
  ].sort(
    (
      left,
      right,
    ) =>
      Date.parse(
        left.createdAt,
      ) -
      Date.parse(
        right.createdAt,
      ),
  );

  return {
    projectId:
      conversation.projectId,
    messages,
    updatedAt:
      message.createdAt,
  };
}

export function createProjectAssistantConversation(
  projectId: string,
  messages:
    readonly ProjectAssistantMessage[] = [],
): ProjectAssistantConversation {
  const filteredMessages =
    messages.filter(
      (message) =>
        message.projectId ===
        projectId,
    );

  const sortedMessages = [
    ...filteredMessages,
  ].sort(
    (
      left,
      right,
    ) =>
      Date.parse(
        left.createdAt,
      ) -
      Date.parse(
        right.createdAt,
      ),
  );

  return {
    projectId,
    messages:
      sortedMessages,
    updatedAt:
      sortedMessages.at(-1)
        ?.createdAt ??
      new Date(0)
        .toISOString(),
  };
}

export function buildProjectAssistantPrompt(
  request:
    ProjectAssistantRequest,
): string {
  const {
    project,
    assetCount = 0,
    activityCount = 0,
    selectedProjectCount = 0,
    additionalContext = "",
  } = request.context;

  return [
    "You are the CreatorOS AI Project Assistant.",
    `Mode: ${request.mode}`,
    `Project ID: ${project.id}`,
    `Project name: ${project.name}`,
    `Platform: ${project.platform}`,
    `Status: ${project.status}`,
    `Description: ${project.description || "Not provided"}`,
    `Assets: ${assetCount}`,
    `Activities: ${activityCount}`,
    `Selected projects: ${selectedProjectCount}`,
    additionalContext
      ? `Additional context: ${additionalContext}`
      : "",
    request.prompt
      ? `User request: ${request.prompt}`
      : "",
    "Return a concise answer, prioritized actions, risks, and assumptions.",
  ]
    .filter(Boolean)
    .join("\n");
}
