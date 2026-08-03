import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createProjectAssistantConversation,
  createProjectAssistantMessage,
} from "./project-ai-assistant-engine";

import {
  clearProjectAssistantConversation,
  loadProjectAssistantConversation,
  loadProjectAssistantConversations,
  PROJECT_AI_ASSISTANT_STORAGE_KEY,
  saveProjectAssistantConversation,
  saveProjectAssistantConversations,
} from "./project-ai-assistant-storage";

const message =
  createProjectAssistantMessage(
    "project-storage",
    "user",
    "Summarize the project.",
    "project-summary",
    "2026-08-03T08:00:00.000Z",
  );

const conversation =
  createProjectAssistantConversation(
    "project-storage",
    [message],
  );

describe(
  "project AI assistant storage",
  () => {
    it(
      "returns empty conversations for missing storage",
      () => {
        expect(
          loadProjectAssistantConversations({
            getItem:
              () => null,
          }),
        ).toEqual([]);
      },
    );

    it(
      "saves and loads conversations",
      () => {
        let stored:
          string | null = null;

        const storage = {
          getItem:
            () => stored,
          setItem:
            (
              key: string,
              value: string,
            ) => {
              expect(key)
                .toBe(
                  PROJECT_AI_ASSISTANT_STORAGE_KEY,
                );

              stored = value;
            },
        };

        saveProjectAssistantConversations(
          [conversation],
          storage,
        );

        expect(
          loadProjectAssistantConversations(
            storage,
          ),
        ).toEqual([
          conversation,
        ]);
      },
    );

    it(
      "loads one project conversation",
      () => {
        const storage = {
          getItem: () =>
            JSON.stringify({
              version: 1,
              conversations: [
                conversation,
              ],
            }),
        };

        expect(
          loadProjectAssistantConversation(
            "project-storage",
            storage,
          ).messages,
        ).toHaveLength(1);
      },
    );

    it(
      "saves one conversation without removing others",
      () => {
        const other =
          createProjectAssistantConversation(
            "other-project",
          );

        let stored =
          JSON.stringify({
            version: 1,
            conversations: [
              other,
            ],
          });

        const storage = {
          getItem:
            () => stored,
          setItem:
            vi.fn(
              (
                _key: string,
                value: string,
              ) => {
                stored = value;
              },
            ),
        };

        saveProjectAssistantConversation(
          conversation,
          storage,
        );

        expect(
          loadProjectAssistantConversations(
            storage,
          ).map(
            (item) =>
              item.projectId,
          ),
        ).toEqual([
          "other-project",
          "project-storage",
        ]);
      },
    );

    it(
      "clears one project conversation",
      () => {
        let stored =
          JSON.stringify({
            version: 1,
            conversations: [
              conversation,
            ],
          });

        const storage = {
          getItem:
            () => stored,
          setItem:
            (
              _key: string,
              value: string,
            ) => {
              stored = value;
            },
        };

        clearProjectAssistantConversation(
          "project-storage",
          storage,
        );

        expect(
          loadProjectAssistantConversations(
            storage,
          ),
        ).toEqual([]);
      },
    );

    it(
      "handles malformed JSON",
      () => {
        expect(
          loadProjectAssistantConversations({
            getItem:
              () => "{broken",
          }),
        ).toEqual([]);
      },
    );
  },
);
