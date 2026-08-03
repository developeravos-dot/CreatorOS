import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

import {
  createProjectsOfflineSyncQueue,
  createProjectsSyncQueueStorage,
  PROJECTS_SYNC_QUEUE_STORAGE_KEY,
} from "./projects-offline-sync-queue";

describe(
  "projects offline sync queue",
  () => {
    it(
      "loads an empty queue",
      () => {
        const queue =
          createProjectsOfflineSyncQueue(
            {
              load: () => ({
                version: 1,
                items: [],
              }),
              save:
                vi.fn(),
              clear:
                vi.fn(),
            },
          );

        expect(
          queue.getSnapshot()
            .items,
        ).toEqual([]);
      },
    );

    it(
      "enqueues a write operation",
      () => {
        const save =
          vi.fn();

        const queue =
          createProjectsOfflineSyncQueue(
            {
              load: () => ({
                version: 1,
                items: [],
              }),
              save,
              clear:
                vi.fn(),
            },
            () =>
              "2026-08-03T10:20:00.000Z",
          );

        const record =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [],
            },
          );

        const item =
          queue.enqueueWrite(
            record,
          );

        expect(item.operation)
          .toBe("write");

        expect(item.record)
          .toEqual(record);

        expect(save)
          .toHaveBeenCalledTimes(1);
      },
    );

    it(
      "keeps only the newest operation per area",
      () => {
        const queue =
          createProjectsOfflineSyncQueue(
            {
              load: () => ({
                version: 1,
                items: [],
              }),
              save:
                vi.fn(),
              clear:
                vi.fn(),
            },
          );

        queue.enqueueWrite(
          createProjectsPersistenceRecord(
            "project-assets",
            {
              value: 1,
            },
          ),
        );

        queue.enqueueRemove(
          "project-assets",
        );

        expect(
          queue.getSnapshot()
            .items,
        ).toHaveLength(1);

        expect(
          queue.getSnapshot()
            .items[0]
            ?.operation,
        ).toBe("remove");
      },
    );

    it(
      "processes successful operations",
      async () => {
        const queue =
          createProjectsOfflineSyncQueue(
            {
              load: () => ({
                version: 1,
                items: [],
              }),
              save:
                vi.fn(),
              clear:
                vi.fn(),
            },
          );

        const record =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "kanban",
            },
          );

        queue.enqueueWrite(
          record,
        );

        queue.enqueueRemove(
          "project-assets",
        );

        const write =
          vi.fn(
            async () =>
              undefined,
          );

        const remove =
          vi.fn(
            async () =>
              undefined,
          );

        const result =
          await queue.process({
            write,
            remove,
          });

        expect(result)
          .toEqual({
            processed: 2,
            succeeded: 2,
            failed: 0,
            remaining: 0,
          });

        expect(write)
          .toHaveBeenCalledWith(
            record,
          );

        expect(remove)
          .toHaveBeenCalledWith(
            "project-assets",
          );
      },
    );

    it(
      "retains failed operations",
      async () => {
        const queue =
          createProjectsOfflineSyncQueue(
            {
              load: () => ({
                version: 1,
                items: [],
              }),
              save:
                vi.fn(),
              clear:
                vi.fn(),
            },
          );

        queue.enqueueRemove(
          "assistant-conversations",
        );

        const result =
          await queue.process({
            write:
              async () =>
                undefined,
            remove:
              async () => {
                throw new Error(
                  "Offline",
                );
              },
          });

        expect(result.failed)
          .toBe(1);

        expect(
          queue.getSnapshot()
            .items[0],
        ).toEqual(
          expect.objectContaining({
            attempts: 1,
            status: "failed",
            lastError:
              "Offline",
          }),
        );
      },
    );

    it(
      "persists queue snapshots",
      () => {
        let stored:
          string | null = null;

        const storage =
          createProjectsSyncQueueStorage({
            getItem:
              () => stored,
            setItem:
              (
                key,
                value,
              ) => {
                expect(key)
                  .toBe(
                    PROJECTS_SYNC_QUEUE_STORAGE_KEY,
                  );

                stored = value;
              },
            removeItem:
              () => {
                stored = null;
              },
          });

        const queue =
          createProjectsOfflineSyncQueue(
            storage,
          );

        queue.enqueueRemove(
          "project-assets",
        );

        const restored =
          createProjectsOfflineSyncQueue(
            storage,
          );

        expect(
          restored
            .getSnapshot()
            .items,
        ).toHaveLength(1);

        restored.clear();

        expect(stored)
          .toBeNull();
      },
    );

    it(
      "handles malformed stored data",
      () => {
        const storage =
          createProjectsSyncQueueStorage({
            getItem:
              () => "{broken",
            setItem:
              vi.fn(),
            removeItem:
              vi.fn(),
          });

        expect(
          storage.load(),
        ).toEqual({
          version: 1,
          items: [],
        });
      },
    );
  },
);
