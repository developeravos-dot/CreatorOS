export type IntelligenceCoreStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed';

export interface IntelligenceCoreBrief {
  title: string;
  projectId: string;
  domain: string;
  objectives: string[];
  dataSources?: string[];
  metrics?: string[];
  learningGoals?: string[];
  protectedPrinciples?: string[];
  riskTolerance?: number;
}

export interface AnalyticsSnapshot {
  id: string;
  createdAt: string;
  metrics: Record<string, number>;
  healthScore: number;
  anomalies: string[];
  insights: string[];
  recommendations: string[];
}

export interface LearningRecord {
  id: string;
  createdAt: string;
  source: string;
  observation: string;
  interpretation: string;
  confidence: number;
  reusableRule: string;
  validationStatus: string;
}

export interface ImprovementProposal {
  id: string;
  createdAt: string;
  title: string;
  problem: string;
  proposedChange: string;
  expectedImpact: string;
  riskScore: number;
  reversible: boolean;
  status: string;
}

export interface KnowledgeNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface KnowledgeEdge {
  id: string;
  from: string;
  to: string;
  relation: string;
  weight: number;
  evidence: string[];
}

export interface MemoryRecord {
  id: string;
  createdAt: string;
  category: string;
  summary: string;
  source: string;
  tags: string[];
  importance: number;
  version: number;
}

export interface DigitalDnaProfile {
  identity: {
    projectId: string;
    title: string;
    domain: string;
  };
  principles: string[];
  creativePatterns: string[];
  audiencePatterns: string[];
  businessPatterns: string[];
  qualityPatterns: string[];
  decisionPatterns: string[];
  forbiddenMutations: string[];
  version: string;
}

export interface IntelligenceCoreProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: IntelligenceCoreStatus;
  brief: IntelligenceCoreBrief;
  analytics: AnalyticsSnapshot[];
  learnings: LearningRecord[];
  improvements: ImprovementProposal[];
  knowledgeGraph: {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
  };
  memory: MemoryRecord[];
  digitalDna: DigitalDnaProfile;
  quality: {
    scores: Record<string, number>;
    failures: string[];
    approved: boolean;
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditTrail: Array<{
      at: string;
      actor: string;
      action: string;
      details?: Record<string, unknown>;
    }>;
  };
}