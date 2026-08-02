import type {
  ExecutionStatus,
} from "../../generated/prisma/client";

export interface CreateExecutionSessionInput {
  workspaceKey: string;
  projectId?: string | null;
  sessionKey?: string;
  name: string;
  objective?: string | null;
  requiresHumanApproval?: boolean;
  metadata?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface CreateExecutionJobInput {
  jobKey?: string;
  name: string;
  description?: string | null;
  assignedAgentId?: string | null;
  runtimeProviderId?: string | null;
  capability?: string | null;
  priority?: number;
  sequence: number;
  maxRetries?: number;
  requiresApproval?: boolean;
  input?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CreateExecutionStepInput {
  stepKey?: string;
  name: string;
  description?: string | null;
  sequence: number;
  runtimeProviderId?: string | null;
  operation?: string | null;
  maxRetries?: number;
  requiresApproval?: boolean;
  input?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CreateExecutionResultInput {
  resultType: string;
  success: boolean;
  output?: Record<string, unknown>;
  logs?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  artifacts?: Record<string, unknown>;
  errorCode?: string | null;
  errorMessage?: string | null;
  durationMs?: number | null;
}

export interface UpdateExecutionStatusInput {
  status: ExecutionStatus;
  progress?: number;
  errorMessage?: string | null;
  output?: Record<string, unknown>;
}

export interface ExecutionDomainHealth {
  status: "operational";
  persistence: "postgresql";
  orm: "prisma";
  runtimeIntegration: "ready";
  humanFinalAuthority: true;
}