import {
  enterpriseClient,
} from "../../../api/core/client";

import type {
  AIRuntimeCollection,
  AIRuntimeCommandRequest,
  AIRuntimeExecution,
  AIRuntimeExecutionCollection,
  AIRuntimeOverview,
  AIStudioRuntimeSnapshot,
} from "./ai-runtime-types";

const RUNTIME_PREFIX =
  "/ai-studio/runtime";

function readJson<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  return enterpriseClient.get<T>(
    `${RUNTIME_PREFIX}/${path.replace(/^\/+/, "")}`,
    {
      signal,
    },
  );
}

function postJson<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  return enterpriseClient.post<T>(
    `${RUNTIME_PREFIX}/${path.replace(/^\/+/, "")}`,
    body,
  );
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
    readJson<AIRuntimeOverview>(
      "overview",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "agents",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "tasks",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "workflows",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "approvals",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "memory",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "models",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "executions",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "tools",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "queues",
      signal,
    ),
    readJson<AIRuntimeCollection>(
      "logs",
      signal,
    ),
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
