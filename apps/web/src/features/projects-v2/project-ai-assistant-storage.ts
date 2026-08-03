import {
  createProjectAssistantConversation,
  type ProjectAssistantConversation,
} from "./project-ai-assistant-engine";

export const PROJECT_AI_ASSISTANT_STORAGE_KEY =
  "creatoros.projects.ai-assistant.v1";

interface ProjectAssistantStorageShape {
  readonly version: 1;
  readonly conversations:
    readonly ProjectAssistantConversation[];
}

function isConversation(
  value: unknown,
): value is ProjectAssistantConversation {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<ProjectAssistantConversation>;

  return (
    typeof candidate.projectId ===
      "string" &&
    typeof candidate.updatedAt ===
      "string" &&
    Array.isArray(
      candidate.messages,
    )
  );
}

export function loadProjectAssistantConversations(
  storage:
    Pick<
      Storage,
      "getItem"
    > = window.localStorage,
): ProjectAssistantConversation[] {
  try {
    const raw =
      storage.getItem(
        PROJECT_AI_ASSISTANT_STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(
        raw,
      ) as
        Partial<
          ProjectAssistantStorageShape
        >;

    if (
      parsed.version !== 1 ||
      !Array.isArray(
        parsed.conversations,
      )
    ) {
      return [];
    }

    return parsed.conversations
      .filter(
        isConversation,
      )
      .map(
        (conversation) =>
          createProjectAssistantConversation(
            conversation.projectId,
            conversation.messages,
          ),
      );
  }
  catch {
    return [];
  }
}

export function saveProjectAssistantConversations(
  conversations:
    readonly ProjectAssistantConversation[],
  storage:
    Pick<
      Storage,
      "setItem"
    > = window.localStorage,
): void {
  const payload:
    ProjectAssistantStorageShape = {
    version: 1,
    conversations,
  };

  storage.setItem(
    PROJECT_AI_ASSISTANT_STORAGE_KEY,
    JSON.stringify(
      payload,
    ),
  );
}

export function loadProjectAssistantConversation(
  projectId: string,
  storage?:
    Pick<
      Storage,
      "getItem"
    >,
): ProjectAssistantConversation {
  return (
    loadProjectAssistantConversations(
      storage,
    ).find(
      (conversation) =>
        conversation.projectId ===
        projectId,
    ) ??
    createProjectAssistantConversation(
      projectId,
    )
  );
}

export function saveProjectAssistantConversation(
  conversation:
    ProjectAssistantConversation,
  storage:
    Pick<
      Storage,
      "getItem" |
      "setItem"
    > = window.localStorage,
): void {
  const current =
    loadProjectAssistantConversations(
      storage,
    );

  const otherConversations =
    current.filter(
      (item) =>
        item.projectId !==
        conversation.projectId,
    );

  saveProjectAssistantConversations(
    [
      ...otherConversations,
      conversation,
    ],
    storage,
  );
}

export function clearProjectAssistantConversation(
  projectId: string,
  storage:
    Pick<
      Storage,
      "getItem" |
      "setItem"
    > = window.localStorage,
): void {
  const remaining =
    loadProjectAssistantConversations(
      storage,
    ).filter(
      (conversation) =>
        conversation.projectId !==
        projectId,
    );

  saveProjectAssistantConversations(
    remaining,
    storage,
  );
}
