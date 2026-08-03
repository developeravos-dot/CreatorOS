import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  QueryClient,
} from "./QueryClient";

describe(
  "QueryClient",
  () => {
    it(
      "caches successful query results",
      async () => {
        const client =
          new QueryClient();

        const loader = vi
          .fn()
          .mockResolvedValue({
            value: 42,
          });

        const first =
          await client.fetch(
            "example",
            loader,
            30_000,
          );

        const second =
          await client.fetch(
            "example",
            loader,
            30_000,
          );

        expect(first).toEqual({
          value: 42,
        });

        expect(second).toEqual({
          value: 42,
        });

        expect(loader).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "deduplicates concurrent requests",
      async () => {
        const client =
          new QueryClient();

        let resolveLoader:
          | ((value: string) => void)
          | undefined;

        const loader = vi.fn(
          () =>
            new Promise<string>(
              (resolve) => {
                resolveLoader =
                  resolve;
              },
            ),
        );

        const first =
          client.fetch(
            "shared",
            loader,
          );

        const second =
          client.fetch(
            "shared",
            loader,
          );

        expect(loader).toHaveBeenCalledTimes(
          1,
        );

        resolveLoader?.("ready");

        await expect(first).resolves.toBe(
          "ready",
        );

        await expect(second).resolves.toBe(
          "ready",
        );
      },
    );

    it(
      "invalidates cached data",
      async () => {
        const client =
          new QueryClient();

        const loader = vi
          .fn()
          .mockResolvedValueOnce(1)
          .mockResolvedValueOnce(2);

        await client.fetch(
          "counter",
          loader,
        );

        client.invalidate(
          "counter",
        );

        const result =
          await client.fetch(
            "counter",
            loader,
          );

        expect(result).toBe(2);

        expect(loader).toHaveBeenCalledTimes(
          2,
        );
      },
    );

    it(
      "supports direct cache updates",
      () => {
        const client =
          new QueryClient();

        client.setQueryData(
          "items",
          ["a"],
        );

        client.setQueryData<
          string[]
        >(
          "items",
          (current) => [
            ...(current ?? []),
            "b",
          ],
        );

        expect(
          client.getQueryData(
            "items",
          ),
        ).toEqual([
          "a",
          "b",
        ]);
      },
    );

    it(
      "notifies subscribers",
      () => {
        const client =
          new QueryClient();

        const listener =
          vi.fn();

        const unsubscribe =
          client.subscribe(
            "status",
            listener,
          );

        client.setQueryData(
          "status",
          "operational",
        );

        expect(listener).toHaveBeenCalled();

        const latest =
          listener.mock.calls.at(
            -1,
          )?.[0];

        expect(latest).toMatchObject({
          key: "status",
          data: "operational",
          status: "success",
        });

        unsubscribe();
      },
    );

    it(
      "stores query errors",
      async () => {
        const client =
          new QueryClient();

        await expect(
          client.fetch(
            "failure",
            async () => {
              throw new Error(
                "network failure",
              );
            },
          ),
        ).rejects.toThrow(
          "network failure",
        );

        expect(
          client.getSnapshot(
            "failure",
          ),
        ).toMatchObject({
          status: "error",
          isFetching: false,
        });
      },
    );

    it(
      "keeps snapshot references stable until data changes",
      () => {
        const client =
          new QueryClient();

        const first =
          client.getSnapshot(
            "stable",
          );

        const second =
          client.getSnapshot(
            "stable",
          );

        expect(
          second,
        ).toBe(first);

        client.setQueryData(
          "stable",
          {
            value: 42,
          },
        );

        const third =
          client.getSnapshot<{
            value: number;
          }>(
            "stable",
          );

        expect(
          third,
        ).not.toBe(first);

        expect(
          client.getSnapshot(
            "stable",
          ),
        ).toBe(third);

        expect(
          third.data,
        ).toEqual({
          value: 42,
        });
      },
    );
    it(
      "invalidates query groups by prefix",
      async () => {
        const client =
          new QueryClient();

        const projectLoader =
          vi
            .fn()
            .mockResolvedValue(
              "projects",
            );

        const scriptLoader =
          vi
            .fn()
            .mockResolvedValue(
              "scripts",
            );

        await client.fetch(
          "enterprise.projects",
          projectLoader,
        );

        await client.fetch(
          "enterprise.scripts",
          scriptLoader,
        );

        client.invalidateQueries(
          "enterprise.",
        );

        expect(
          client.getSnapshot(
            "enterprise.projects",
          ).isInvalidated,
        ).toBe(true);

        expect(
          client.getSnapshot(
            "enterprise.scripts",
          ).isInvalidated,
        ).toBe(true);
      },
    );
  },
);
