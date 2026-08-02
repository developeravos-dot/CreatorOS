import type {
  AIStudioAgent,
  AIStudioApproval,
  AIStudioLog,
  AIStudioTask,
  AIStudioWorkflowStep,
} from "./ai-studio-types";

export const defaultAIStudioAgents: AIStudioAgent[] = [
  {
    id: "orchestrator",
    name: "Orchestrator",
    role: "AI Operations Coordinator",
    icon: "◎",
    status: "active",
    model: "GPT Router",
    tasks: 7,
    successRate: 98,
    description:
      "Coordinates agents, dependencies, execution order and approvals.",
  },
  {
    id: "research",
    name: "Research Agent",
    role: "Research Intelligence",
    icon: "⌕",
    status: "active",
    model: "Gemini Research",
    tasks: 4,
    successRate: 94,
    description:
      "Finds evidence, sources, trends and audience opportunities.",
  },
  {
    id: "strategy",
    name: "Strategy Agent",
    role: "Content Strategy",
    icon: "◇",
    status: "active",
    model: "GPT Strategy",
    tasks: 3,
    successRate: 96,
    description:
      "Builds content strategies, campaigns and publishing plans.",
  },
  {
    id: "writer",
    name: "Script Agent",
    role: "Script Production",
    icon: "✎",
    status: "running",
    model: "Claude Writing",
    tasks: 5,
    successRate: 97,
    description:
      "Creates scripts, hooks, scenes and production-ready revisions.",
  },
  {
    id: "visual",
    name: "Visual Director",
    role: "Visual Intelligence",
    icon: "◈",
    status: "idle",
    model: "Visual Router",
    tasks: 2,
    successRate: 92,
    description:
      "Plans visual identity, thumbnails, shots and image generation.",
  },
  {
    id: "quality",
    name: "Quality Guardian",
    role: "Quality Assurance",
    icon: "✓",
    status: "waiting",
    model: "Quality Model",
    tasks: 2,
    successRate: 99,
    description:
      "Reviews quality, consistency, safety and publishing readiness.",
  },
];

export const defaultAIStudioTasks: AIStudioTask[] = [
  {
    id: "task-001",
    title: "Generate documentary script structure",
    agentId: "writer",
    status: "running",
    progress: 68,
    priority: "high",
    createdAt: "09:15",
  },
  {
    id: "task-002",
    title: "Analyze audience retention opportunities",
    agentId: "strategy",
    status: "queued",
    progress: 0,
    priority: "medium",
    createdAt: "09:21",
  },
  {
    id: "task-003",
    title: "Approve publishing recommendation",
    agentId: "orchestrator",
    status: "approval",
    progress: 85,
    priority: "critical",
    createdAt: "09:28",
  },
  {
    id: "task-004",
    title: "Research emerging technology topics",
    agentId: "research",
    status: "completed",
    progress: 100,
    priority: "medium",
    createdAt: "08:40",
  },
];

export const defaultWorkflowSteps: AIStudioWorkflowStep[] = [
  {
    id: "step-1",
    title: "Idea Intelligence",
    agent: "Research Agent",
    status: "completed",
    order: 1,
  },
  {
    id: "step-2",
    title: "Strategy Design",
    agent: "Strategy Agent",
    status: "completed",
    order: 2,
  },
  {
    id: "step-3",
    title: "Script Production",
    agent: "Script Agent",
    status: "running",
    order: 3,
  },
  {
    id: "step-4",
    title: "Visual Direction",
    agent: "Visual Director",
    status: "queued",
    order: 4,
  },
  {
    id: "step-5",
    title: "Quality Approval",
    agent: "Quality Guardian",
    status: "approval",
    order: 5,
  },
];

export const defaultApprovals: AIStudioApproval[] = [
  {
    id: "approval-001",
    title: "Approve final publishing strategy",
    agent: "Orchestrator",
    risk: "high",
    description:
      "The workflow is ready to schedule content across YouTube and TikTok.",
    createdAt: "09:28",
  },
  {
    id: "approval-002",
    title: "Approve visual identity direction",
    agent: "Visual Director",
    risk: "medium",
    description:
      "A new visual direction will be applied to the selected campaign.",
    createdAt: "09:05",
  },
];

export const defaultLogs: AIStudioLog[] = [
  {
    id: "log-1",
    type: "success",
    message: "Research package completed",
    source: "Research Agent",
    timestamp: "09:24:18",
  },
  {
    id: "log-2",
    type: "info",
    message: "Script generation reached 68%",
    source: "Script Agent",
    timestamp: "09:23:04",
  },
  {
    id: "log-3",
    type: "warning",
    message: "Human approval required before publishing",
    source: "Orchestrator",
    timestamp: "09:21:55",
  },
  {
    id: "log-4",
    type: "info",
    message: "Knowledge context loaded",
    source: "Memory Engine",
    timestamp: "09:18:22",
  },
];
