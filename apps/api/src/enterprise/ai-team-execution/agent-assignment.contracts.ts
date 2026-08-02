export interface AssignExecutionJobInput {
  capability?: string;
  preferredProviderId?: string;
  preferredAgentId?: string;
  scope?: string;
  minimumHealth?: number;
  maximumWorkload?: number;
  humanOverride?: boolean;
}

export interface ExecutionJobAssignment {
  jobId: string;
  sessionId: string;
  assignedAgentId: string;
  runtimeProviderId: string;
  capability: string;
  score: number;
  reasons: string[];
  alternatives: Array<{
    providerId: string;
    providerName: string;
    score: number;
  }>;
  humanOverride: boolean;
  assignedAt: string;
}