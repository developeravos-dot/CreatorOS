export type AIOrganizationProjectType =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "campaign"
  | "research"
  | "general";

export type AIOrganizationTaskStatus =
  | "backlog"
  | "assigned"
  | "running"
  | "review"
  | "completed"
  | "blocked";

export type AIOrganizationApprovalStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface AIOrganizationAgent {
  id: string;
  runtimeProviderId: string;
  technicalName: string;
  displayName: string;
  module: string;
  capability: string;
  available: boolean;
  icon: string;
  tags: string[];
}

export interface AIOrganizationMember {
  agentId: string;
  role: string;
  isLeader: boolean;
  workload: number;
}

export interface AIOrganizationTask {
  id: string;
  title: string;
  description: string;
  assignedAgentId: string | null;
  status: AIOrganizationTaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

export interface AIOrganizationMessage {
  id: string;
  agentId: string | null;
  content: string;
  createdAt: string;
}

export interface AIOrganizationMemoryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AIOrganizationApproval {
  id: string;
  title: string;
  description: string;
  requestedByAgentId: string | null;
  status: AIOrganizationApprovalStatus;
  createdAt: string;
  decidedAt: string | null;
}

export interface AIOrganizationTimelineEvent {
  id: string;
  type:
    | "team-created"
    | "member-added"
    | "task-created"
    | "task-updated"
    | "message"
    | "memory"
    | "approval"
    | "system";
  title: string;
  description: string;
  createdAt: string;
}

export interface AIOrganizationTeam {
  id: string;
  name: string;
  projectType: AIOrganizationProjectType;
  objective: string;
  members: AIOrganizationMember[];
  tasks: AIOrganizationTask[];
  messages: AIOrganizationMessage[];
  memory: AIOrganizationMemoryEntry[];
  approvals: AIOrganizationApproval[];
  timeline: AIOrganizationTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface AIOrganizationState {
  teams: AIOrganizationTeam[];
  selectedTeamId: string | null;
}
