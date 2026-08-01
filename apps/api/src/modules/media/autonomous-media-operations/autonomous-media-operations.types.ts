export type AutonomousProjectStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived';

export interface CreateAutonomousMediaProjectInput {
  name: string;
  brandName: string;
  contentType: string;
  audience: string;
  platforms: string[];
  languages?: string[];
  markets?: string[];
  objectives?: string[];
  publishingCadence?: string;
  budget?: number;
}

export interface MediaMemoryEntry {
  id: string;
  projectId: string;
  category: string;
  summary: string;
  createdAt: string;
  evidence: Record<string, unknown>;
}

export interface MediaExperiment {
  id: string;
  projectId: string;
  hypothesis: string;
  variants: string[];
  metric: string;
  status: 'planned' | 'running' | 'completed';
  winner?: string;
  createdAt: string;
}

export interface AutonomousMediaProject {
  id: string;
  status: AutonomousProjectStatus;
  createdAt: string;
  updatedAt: string;
  input: CreateAutonomousMediaProjectInput;
  governance: {
    humanFinalAuthority: true;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
  strategy: Record<string, unknown>;
  operations: Record<string, unknown>;
  localization: Record<string, unknown>;
  analytics: Record<string, unknown>;
  opportunities: Record<string, unknown>;
  licensing: Record<string, unknown>;
  schedule: {
    cadence: string;
    nextRunAt?: string;
    active: boolean;
  };
  metrics: {
    readiness: number;
    productionScore: number;
    distributionScore: number;
    monetizationScore: number;
    learningScore: number;
  };
}
