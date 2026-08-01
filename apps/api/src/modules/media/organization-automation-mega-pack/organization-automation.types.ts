export type OrganizationStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed';

export type AgentStatus =
  | 'idle'
  | 'assigned'
  | 'working'
  | 'blocked'
  | 'completed'
  | 'disabled';

export type WorkflowStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface OrganizationBrief {
  title: string;
  projectId: string;
  mission: string;
  objectives: string[];
  departments?: string[];
  agentRoles?: string[];
  automationGoals?: string[];
  protectedPrinciples?: string[];
  maxConcurrentWorkflows?: number;
}

export interface SpecialistAgent {
  id: string;
  name: string;
  role: string;
  department: string;
  capabilities: string[];
  status: AgentStatus;
  authorityLevel: 'advisory' | 'operational' | 'supervisory';
  currentTaskId?: string;
}

export interface DigitalTeam {
  id: string;
  name: string;
  department: string;
  mission: string;
  agentIds: string[];
  coordinatorAgentId: string;
  escalationRules: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  ownerRole: string;
  dependsOn: string[];
  requiresHumanApproval: boolean;
  status: 'pending' | 'ready' | 'running' | 'blocked' | 'completed' | 'failed';
  output?: Record<string, unknown>;
}

export interface OperationalWorkflow {
  id: string;
  name: string;
  objective: string;
  status: WorkflowStatus;
  priority: number;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStep[];
  assignedTeamId?: string;
  blockedReason?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresHumanApproval: boolean;
  enabled: boolean;
}

export interface ApprovalRequest {
  id: string;
  createdAt: string;
  category: string;
  targetId: string;
  requestedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedBy?: string;
  decidedAt?: string;
}

export interface OperationalEvent {
  id: string;
  at: string;
  actor: string;
  type: string;
  subjectId?: string;
  details?: Record<string, unknown>;
}

export interface OrganizationAutomationProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrganizationStatus;
  brief: OrganizationBrief;
  agents: SpecialistAgent[];
  teams: DigitalTeam[];
  workflows: OperationalWorkflow[];
  automationRules: AutomationRule[];
  approvals: ApprovalRequest[];
  events: OperationalEvent[];
  quality: {
    scores: Record<string, number>;
    failures: string[];
    approved: boolean;
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditTrail: OperationalEvent[];
  };
}