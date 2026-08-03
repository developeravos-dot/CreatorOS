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
  createFetchProjectsRemotePersistenceTransport,
  createProjectsRemotePersistenceAdapter,
  ProjectsRemotePersistenceError,
  type ProjectsRemotePersistenceRequest,
  type ProjectsRemotePersistenceResponse,
  type ProjectsRemotePersistenceTransport,
} from "./projects-remote-persistence-adapter";

function createResponse(
  status: number,
  body = "",
  statusText = "",
): ProjectsRemotePersistenceResponse {
  return {
    ok:
      status >= 200 &&
      status < 300,
    status,
    statusText,

    async text():
      Promise<string> {
      return body;
    },
  };
}

describe(
  "projects remote persistence adapter",
  () => {
    it(
      "reads remote records",
      async () => {
        const record =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "kanban",
            },
            1,
            "2026-08-03T10:00:00.000Z",
          );

        const transport =
          vi.fn<
            ProjectsRemotePersistenceTransport
          >(
            async () =>
              createResponse(
                200,
                JSON.stringify({
                  success: true,
                  data:
                    record,
                }),
              ),
          );

        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000/api/v1",
            transport,
          });

        await expect(
          adapter.read(
            "workspace-preferences",
          ),
        ).resolves.toEqual(
          record,
        );

        expect(
          transport,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "GET",
            url:
              "http://localhost:3000/api/v1/projects/persistence/workspace-preferences",
          }),
        );
      },
    );

    it(
      "returns null for missing records",
      async () => {
        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport:
              async () =>
                createResponse(
                  404,
                ),
          });

        await expect(
          adapter.read(
            "project-assets",
          ),
        ).resolves.toBeNull();
      },
    );

    it(
      "writes records with JSON content",
      async () => {
        let captured:
          ProjectsRemotePersistenceRequest |
          null = null;

        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000/",
            headers: {
              Authorization:
                "Bearer token",
            },
            transport:
              async (
                request,
              ) => {
                captured =
                  request;

                return createResponse(
                  204,
                );
              },
          });

        const record =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              version: 1,
              assets: [],
            },
          );

        await adapter.write(
          record,
        );

        expect(captured)
          .toEqual(
            expect.objectContaining({
              method: "PUT",
              url:
                "http://localhost:3000/projects/persistence/project-assets",
              headers:
                expect.objectContaining({
                  Authorization:
                    "Bearer token",
                  "Content-Type":
                    "application/json",
                }),
            }),
          );

        expect(
          JSON.parse(
            captured!.body!,
          ),
        ).toEqual({
          record,
        });
      },
    );

    it(
      "uses dynamic request headers",
      async () => {
        const transport =
          vi.fn<
            ProjectsRemotePersistenceTransport
          >(
            async () =>
              createResponse(
                404,
              ),
          );

        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport,
            getHeaders:
              async () => ({
                Authorization:
                  "Bearer dynamic",
              }),
          });

        await adapter.read(
          "assistant-conversations",
        );

        expect(
          transport,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            headers:
              expect.objectContaining({
                Authorization:
                  "Bearer dynamic",
              }),
          }),
        );
      },
    );

    it(
      "deletes records and ignores missing values",
      async () => {
        const transport =
          vi.fn<
            ProjectsRemotePersistenceTransport
          >(
            async () =>
              createResponse(
                404,
              ),
          );

        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport,
          });

        await expect(
          adapter.remove(
            "project-assets",
          ),
        ).resolves.toBeUndefined();

        expect(
          transport,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            method:
              "DELETE",
          }),
        );
      },
    );

    it(
      "clears every persistence area",
      async () => {
        const transport =
          vi.fn<
            ProjectsRemotePersistenceTransport
          >(
            async () =>
              createResponse(
                204,
              ),
          );

        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport,
          });

        await adapter.clear();

        expect(
          transport,
        ).toHaveBeenCalledTimes(
          3,
        );
      },
    );

    it(
      "rejects malformed JSON responses",
      async () => {
        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport:
              async () =>
                createResponse(
                  200,
                  "{broken",
                ),
          });

        await expect(
          adapter.read(
            "project-assets",
          ),
        ).rejects.toMatchObject({
          code:
            "invalid-response",
        });
      },
    );

    it(
      "rejects invalid response envelopes",
      async () => {
        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport:
              async () =>
                createResponse(
                  200,
                  JSON.stringify({
                    success: true,
                    data: {
                      invalid:
                        true,
                    },
                  }),
                ),
          });

        await expect(
          adapter.read(
            "project-assets",
          ),
        ).rejects.toBeInstanceOf(
          ProjectsRemotePersistenceError,
        );
      },
    );

    it(
      "exposes HTTP errors",
      async () => {
        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport:
              async () =>
                createResponse(
                  503,
                  "",
                  "Unavailable",
                ),
          });

        await expect(
          adapter.read(
            "project-assets",
          ),
        ).rejects.toMatchObject({
          code: "http",
          status: 503,
        });
      },
    );

    it(
      "wraps network failures",
      async () => {
        const adapter =
          createProjectsRemotePersistenceAdapter({
            baseUrl:
              "http://localhost:3000",
            transport:
              async () => {
                throw new Error(
                  "Network offline",
                );
              },
          });

        await expect(
          adapter.read(
            "project-assets",
          ),
        ).rejects.toMatchObject({
          code: "network",
          message:
            "Network offline",
        });
      },
    );

    it(
      "creates a fetch transport",
      async () => {
        const fetchMock =
          vi.fn(
            async () =>
              new Response(
                JSON.stringify({
                  success: true,
                  data: null,
                }),
                {
                  status: 200,
                },
              ),
          );

        const transport =
          createFetchProjectsRemotePersistenceTransport(
            fetchMock as
              typeof fetch,
          );

        const response =
          await transport({
            url:
              "http://localhost/test",
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
          });

        expect(response.ok)
          .toBe(true);

        expect(
          await response.text(),
        ).toContain(
          '"success":true',
        );
      },
    );

    it(
      "requires a valid base URL and timeout",
      () => {
        const transport:
          ProjectsRemotePersistenceTransport =
          async () =>
            createResponse(
              200,
            );

        expect(
          () =>
            createProjectsRemotePersistenceAdapter({
              baseUrl: " ",
              transport,
            }),
        ).toThrow(
          "Remote persistence base URL is required.",
        );

        expect(
          () =>
            createProjectsRemotePersistenceAdapter({
              baseUrl:
                "http://localhost",
              transport,
              timeoutMs: 0,
            }),
        ).toThrow(
          "Remote persistence timeout must be greater than zero.",
        );
      },
    );
  },
);
