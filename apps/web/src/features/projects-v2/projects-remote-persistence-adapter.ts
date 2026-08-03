import type {
  ProjectsPersistenceArea,
  ProjectsPersistenceGateway,
  ProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

export type ProjectsRemotePersistenceMethod =
  | "GET"
  | "PUT"
  | "DELETE";

export interface ProjectsRemotePersistenceRequest {
  readonly url: string;
  readonly method:
    ProjectsRemotePersistenceMethod;
  readonly headers:
    Readonly<
      Record<
        string,
        string
      >
    >;
  readonly body?: string;
  readonly signal?: AbortSignal;
}

export interface ProjectsRemotePersistenceResponse {
  readonly ok: boolean;
  readonly status: number;
  readonly statusText?: string;
  text(): Promise<string>;
}

export type ProjectsRemotePersistenceTransport = (
  request:
    ProjectsRemotePersistenceRequest,
) => Promise<
  ProjectsRemotePersistenceResponse
>;

export interface CreateProjectsRemotePersistenceAdapterOptions {
  readonly baseUrl: string;
  readonly transport:
    ProjectsRemotePersistenceTransport;
  readonly timeoutMs?: number;
  readonly headers?:
    Readonly<
      Record<
        string,
        string
      >
    >;
  readonly getHeaders?: () =>
    | Readonly<
        Record<
          string,
          string
        >
      >
    | Promise<
        Readonly<
          Record<
            string,
            string
          >
        >
      >;
}

export type ProjectsRemotePersistenceErrorCode =
  | "timeout"
  | "network"
  | "http"
  | "invalid-response"
  | "invalid-record";

export class ProjectsRemotePersistenceError
  extends Error {
  readonly code:
    ProjectsRemotePersistenceErrorCode;

  readonly status:
    number | null;

  constructor(
    code:
      ProjectsRemotePersistenceErrorCode,
    message: string,
    status:
      number | null = null,
  ) {
    super(message);

    this.name =
      "ProjectsRemotePersistenceError";

    this.code =
      code;

    this.status =
      status;
  }
}

interface ProjectsRemoteRecordEnvelope {
  readonly success: boolean;
  readonly data:
    ProjectsPersistenceRecord<
      unknown
    > | null;
}

function normalizeBaseUrl(
  value: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new Error(
      "Remote persistence base URL is required.",
    );
  }

  return normalized.replace(
    /\/+$/g,
    "",
  );
}

function encodeArea(
  area:
    ProjectsPersistenceArea,
): string {
  return encodeURIComponent(
    area,
  );
}

function createAreaUrl(
  baseUrl: string,
  area:
    ProjectsPersistenceArea,
): string {
  return [
    baseUrl,
    "projects",
    "persistence",
    encodeArea(area),
  ].join("/");
}

function isPersistenceArea(
  value: unknown,
): value is ProjectsPersistenceArea {
  return (
    value ===
      "workspace-preferences" ||
    value ===
      "project-assets" ||
    value ===
      "assistant-conversations"
  );
}

function isPersistenceRecord(
  value: unknown,
  area:
    ProjectsPersistenceArea,
): value is
  ProjectsPersistenceRecord<
    unknown
  > {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<
        ProjectsPersistenceRecord<
          unknown
        >
      >;

  return (
    candidate.area === area &&
    isPersistenceArea(
      candidate.area,
    ) &&
    typeof candidate.version ===
      "number" &&
    Number.isInteger(
      candidate.version,
    ) &&
    candidate.version >= 1 &&
    typeof candidate.updatedAt ===
      "string" &&
    "value" in candidate
  );
}

function isRecordEnvelope(
  value: unknown,
  area:
    ProjectsPersistenceArea,
): value is
  ProjectsRemoteRecordEnvelope {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<
        ProjectsRemoteRecordEnvelope
      >;

  if (
    typeof candidate.success !==
    "boolean"
  ) {
    return false;
  }

  if (
    candidate.data ===
    null
  ) {
    return true;
  }

  return isPersistenceRecord(
    candidate.data,
    area,
  );
}

async function parseResponseJson(
  response:
    ProjectsRemotePersistenceResponse,
): Promise<unknown> {
  const text =
    await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(
      text,
    ) as unknown;
  }
  catch {
    throw new ProjectsRemotePersistenceError(
      "invalid-response",
      "Remote persistence returned malformed JSON.",
      response.status,
    );
  }
}

function createTimeoutSignal(
  timeoutMs: number,
): {
  readonly signal:
    AbortSignal;
  cancel(): void;
} {
  const controller =
    new AbortController();

  const timer =
    globalThis.setTimeout(
      () => {
        controller.abort();
      },
      timeoutMs,
    );

  return {
    signal:
      controller.signal,

    cancel(): void {
      globalThis.clearTimeout(
        timer,
      );
    },
  };
}

function isAbortError(
  error: unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name ===
      "AbortError"
  );
}

async function buildHeaders(
  options:
    CreateProjectsRemotePersistenceAdapterOptions,
  includeContentType:
    boolean,
): Promise<
  Readonly<
    Record<
      string,
      string
    >
  >
> {
  const dynamicHeaders =
    await options.getHeaders?.();

  return {
    Accept:
      "application/json",
    ...(includeContentType
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),
    ...options.headers,
    ...dynamicHeaders,
  };
}

export function createProjectsRemotePersistenceAdapter(
  options:
    CreateProjectsRemotePersistenceAdapterOptions,
): ProjectsPersistenceGateway {
  const baseUrl =
    normalizeBaseUrl(
      options.baseUrl,
    );

  const timeoutMs =
    options.timeoutMs ??
    10_000;

  if (
    !Number.isFinite(
      timeoutMs,
    ) ||
    timeoutMs <= 0
  ) {
    throw new Error(
      "Remote persistence timeout must be greater than zero.",
    );
  }

  async function execute(
    area:
      ProjectsPersistenceArea,
    method:
      ProjectsRemotePersistenceMethod,
    record?:
      ProjectsPersistenceRecord<
        unknown
      >,
  ): Promise<
    ProjectsRemotePersistenceResponse
  > {
    const timeout =
      createTimeoutSignal(
        timeoutMs,
      );

    try {
      return await options.transport({
        url:
          createAreaUrl(
            baseUrl,
            area,
          ),
        method,
        headers:
          await buildHeaders(
            options,
            method === "PUT",
          ),
        body:
          record
            ? JSON.stringify({
                record,
              })
            : undefined,
        signal:
          timeout.signal,
      });
    }
    catch (error: unknown) {
      if (
        timeout.signal.aborted ||
        isAbortError(error)
      ) {
        throw new ProjectsRemotePersistenceError(
          "timeout",
          "Remote persistence request timed out.",
        );
      }

      if (
        error instanceof
        ProjectsRemotePersistenceError
      ) {
        throw error;
      }

      throw new ProjectsRemotePersistenceError(
        "network",
        error instanceof Error
          ? error.message
          : "Remote persistence request failed.",
      );
    }
    finally {
      timeout.cancel();
    }
  }

  return {
    kind: "remote",

    async read<TValue>(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceRecord<TValue> |
      null
    > {
      const response =
        await execute(
          area,
          "GET",
        );

      if (
        response.status ===
        404
      ) {
        return null;
      }

      if (!response.ok) {
        throw new ProjectsRemotePersistenceError(
          "http",
          response.statusText ||
            `Remote persistence read failed with status ${response.status}.`,
          response.status,
        );
      }

      const parsed =
        await parseResponseJson(
          response,
        );

      if (
        !isRecordEnvelope(
          parsed,
          area,
        )
      ) {
        throw new ProjectsRemotePersistenceError(
          "invalid-response",
          "Remote persistence returned an invalid record envelope.",
          response.status,
        );
      }

      if (
        !parsed.success ||
        parsed.data === null
      ) {
        return null;
      }

      return parsed.data as
        ProjectsPersistenceRecord<TValue>;
    },

    async write<TValue>(
      record:
        ProjectsPersistenceRecord<TValue>,
    ): Promise<void> {
      if (
        !isPersistenceRecord(
          record,
          record.area,
        )
      ) {
        throw new ProjectsRemotePersistenceError(
          "invalid-record",
          "Invalid projects persistence record.",
        );
      }

      const response =
        await execute(
          record.area,
          "PUT",
          record,
        );

      if (!response.ok) {
        throw new ProjectsRemotePersistenceError(
          "http",
          response.statusText ||
            `Remote persistence write failed with status ${response.status}.`,
          response.status,
        );
      }
    },

    async remove(
      area:
        ProjectsPersistenceArea,
    ): Promise<void> {
      const response =
        await execute(
          area,
          "DELETE",
        );

      if (
        !response.ok &&
        response.status !==
          404
      ) {
        throw new ProjectsRemotePersistenceError(
          "http",
          response.statusText ||
            `Remote persistence delete failed with status ${response.status}.`,
          response.status,
        );
      }
    },

    async clear(): Promise<void> {
      const areas:
        readonly ProjectsPersistenceArea[] = [
        "workspace-preferences",
        "project-assets",
        "assistant-conversations",
      ];

      for (
        const area of areas
      ) {
        await this.remove(
          area,
        );
      }
    },
  };
}

export function createFetchProjectsRemotePersistenceTransport(
  fetchImplementation:
    typeof fetch = globalThis.fetch,
): ProjectsRemotePersistenceTransport {
  return async (
    request:
      ProjectsRemotePersistenceRequest,
  ): Promise<
    ProjectsRemotePersistenceResponse
  > => {
    const response =
      await fetchImplementation(
        request.url,
        {
          method:
            request.method,
          headers:
            request.headers,
          body:
            request.body,
          signal:
            request.signal,
        },
      );

    return {
      ok:
        response.ok,
      status:
        response.status,
      statusText:
        response.statusText,

      async text():
        Promise<string> {
        return response.text();
      },
    };
  };
}
