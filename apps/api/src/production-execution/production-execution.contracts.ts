export type WorkflowStatus =
  | 'draft'
  | 'planned'
  | 'queued'
  | 'running'
  | 'waiting-manual'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type WorkflowStepStatus =
  | 'pending'
  | 'ready'
  | 'running'
  | 'manual-required'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled';

export interface CreateProductionWorkflowRequest {
  title: string;
  brief?: string;
  allowPaid?: boolean;
  minimumQuality?: number;
  budgetLimit?: number;
  preferredTools?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface WorkflowAsset {
  id: string;
  workflowId: string;
  stepId?: string;
  kind:
    | 'idea'
    | 'research'
    | 'script'
    | 'video'
    | 'thumbnail'
    | 'voice'
    | 'music'
    | 'project'
    | 'publication'
    | 'analytics'
    | 'other';
  name: string;
  location?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  capability: string;
  toolId?: string;
  toolName?: string;
  toolMode?: string;
  status: WorkflowStepStatus;
  order: number;
  estimatedCost: number;
  actualCost: number;
  qualityScore?: number;
  attempts: number;
  maxAttempts: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  outputAssetIds: string[];
}

export interface ProductionWorkflow {
  id: string;
  title: string;
  brief?: string;
  status: WorkflowStatus;
  strategy: 'cost-first';
  allowPaid: boolean;
  minimumQuality: number;
  budgetLimit?: number;
  estimatedCost: number;
  actualCost: number;
  currentStepId?: string;
  steps: WorkflowStep[];
  assetIds: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  failureReason?: string;
}

export interface WorkflowExecutionResult {
  success: boolean;
  workflow: ProductionWorkflow;
  message: string;
}