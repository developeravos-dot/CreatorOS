export type CommandCenterStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'degraded'
  | 'offline';

export type CommandStatus =
  | 'queued'
  | 'awaiting-human-approval'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface CommandCenterBrief {
  title: string;
  projectId: string;
  mission: string;
  objectives: string[];
  connectedSystems?: string[];
  protectedPrinciples?: string[];
  alertThresholds?: {
    warning?: number;
    critical?: number;
  };
}

export interface SystemHealthRecord {
  id: string;
  system: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  score: number;
  checkedAt: string;
  metrics: Record<string, number>;
  issues: string[];
}

export interface CommandRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  command: string;
  targetSystem: string;
  payload: Record<string, unknown>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: CommandStatus;
  requestedBy: string;
  approvedBy?: string;
  result?: Record<string, unknown>;
  error?: string;
}

export interface CommandCenterAlert {
  id: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
  source: string;
  title: string;
  details: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface DecisionRecord {
  id: string;
  createdAt: string;
  category: string;
  question: string;
  options: string[];
  recommendation: string;
  confidence: number;
  requiresHumanDecision: boolean;
  decision?: string;
  decidedBy?: string;
  decidedAt?: string;
}

export interface CommandCenterEvent {
  id: string;
  at: string;
  actor: string;
  type: string;
  subjectId?: string;
  details?: Record<string, unknown>;
}

export interface MediaCommandCenterProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CommandCenterStatus;
  brief: CommandCenterBrief;
  systemHealth: SystemHealthRecord[];
  commands: CommandRequest[];
  alerts: CommandCenterAlert[];
  decisions: DecisionRecord[];
  events: CommandCenterEvent[];
  dashboard: {
    overallHealth: number;
    healthySystems: number;
    warningSystems: number;
    criticalSystems: number;
    offlineSystems: number;
    pendingCommands: number;
    pendingApprovals: number;
    activeAlerts: number;
    unresolvedDecisions: number;
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    protectedPrinciples: string[];
    auditTrail: CommandCenterEvent[];
  };
}