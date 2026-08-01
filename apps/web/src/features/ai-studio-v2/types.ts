export type AgentStatus =
  | "ready"
  | "working"
  | "paused"
  | "offline";

export type PipelineStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface StudioAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  category: string;
  status: AgentStatus;
  capabilities: string[];
}

export interface PipelineStep {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: PipelineStepStatus;
  progress: number;
}

export interface StudioRun {
  id: string;
  title: string;
  status: "draft" | "running" | "completed" | "stopped";
  createdAt: string;
  progress: number;
}
