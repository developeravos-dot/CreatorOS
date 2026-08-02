import type {
  AIRuntimeCollection,
  AIRuntimeCommandRequest,
  AIRuntimeExecution,
  AIRuntimeExecutionCollection,
  AIRuntimeOverview,
  AIStudioRuntimeSnapshot,
} from "./ai-runtime-types";

const RUNTIME_BASE =
  "/api/v1/enterprise/ai-studio/runtime";

async function readJson<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${RUNTIME_BASE}/${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  return parseResponse<T>(response);
}

async function postJson<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${RUNTIME_BASE}/${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    let message =
      `Runtime request failed with status ${response.status}.`;

    try {
      const payload = (await response.json()) as {
        message?: string;
      };

      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // Keep the HTTP fallback message.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function loadAIStudioRuntime(
  signal?: AbortSignal,
): Promise<AIStudioRuntimeSnapshot> {
  const [
    overview,
    agents,
    tasks,
    workflows,
    approvals,
    memory,
    models,
    executions,
    tools,
    queues,
    logs,
  ] = await Promise.all([
    readJson<AIRuntimeOverview>("overview", signal),
    readJson<AIRuntimeCollection>("agents", signal),
    readJson<AIRuntimeCollection>("tasks", signal),
    readJson<AIRuntimeCollection>("workflows", signal),
    readJson<AIRuntimeCollection>("approvals", signal),
    readJson<AIRuntimeCollection>("memory", signal),
    readJson<AIRuntimeCollection>("models", signal),
    readJson<AIRuntimeCollection>("executions", signal),
    readJson<AIRuntimeCollection>("tools", signal),
    readJson<AIRuntimeCollection>("queues", signal),
    readJson<AIRuntimeCollection>("logs", signal),
  ]);

  return {
    overview,
    agents,
    tasks,
    workflows,
    approvals,
    memory,
    models,
    executions,
    tools,
    queues,
    logs,
  };
}

export function loadAIRuntimeExecutionHistory(
  signal?: AbortSignal,
): Promise<AIRuntimeExecutionCollection> {
  return readJson<AIRuntimeExecutionCollection>(
    "execution-history",
    signal,
  );
}

export function executeAIRuntimeCommand(
  request: AIRuntimeCommandRequest,
): Promise<AIRuntimeExecution> {
  return postJson<AIRuntimeExecution>(
    "commands",
    request,
  );
}

export function approveAIRuntimeExecution(
  executionId: string,
): Promise<AIRuntimeExecution> {
  return postJson<AIRuntimeExecution>(
    `execution-history/${encodeURIComponent(
      executionId,
    )}/approve`,
  );
}

export function rejectAIRuntimeExecution(
  executionId: string,
): Promise<AIRuntimeExecution> {
  return postJson<AIRuntimeExecution>(
    `execution-history/${encodeURIComponent(
      executionId,
    )}/reject`,
  );
}
