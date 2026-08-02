export type AgentStatus =
  | "active"
  | "idle"
  | "waiting"
  | "error";

export type TaskStatus =
  | "queued"
  | "running"
  | "approval"
  | "completed"
  | "failed";

export interface AIStudioAgent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: AgentStatus;
  model: string;
  tasks: number;
  successRate: number;
  description: string;
}

export interface AIStudioTask {
  id: string;
  title: string;
  agentId: string;
  status: TaskStatus;
  progress: number;
  priority: "critical" | "high" | "medium" | "low";
  createdAt: string;
}

export interface AIStudioWorkflowStep {
  id: string;
  title: string;
  agent: string;
  status: TaskStatus;
  order: number;
}

export interface AIStudioApproval {
  id: string;
  title: string;
  agent: string;
  risk: "high" | "medium" | "low";
  description: string;
  createdAt: string;
}

export interface AIStudioLog {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  source: string;
  timestamp: string;
}
