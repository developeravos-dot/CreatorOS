export type KnowledgeRecordType =
  | 'fact'
  | 'decision'
  | 'idea'
  | 'document'
  | 'event'
  | 'insight';

export interface KnowledgeRecord {
  id: string;
  key: string;
  type: KnowledgeRecordType;
  title: string;
  content: string;
  tags: string[];
  source: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export type AgentStatus =
  | 'registered'
  | 'active'
  | 'paused'
  | 'failed';

export interface AiAgentDefinition {
  id: string;
  key: string;
  name: string;
  specialty: string;
  team: string;
  status: AgentStatus;
  capabilities: string[];
  memoryKeys: string[];
  createdAt: string;
}

export interface AgentTask {
  id: string;
  agentKey: string;
  objective: string;
  input: Record<string, unknown>;
  status:
    | 'queued'
    | 'running'
    | 'completed'
    | 'failed';
  result?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export interface DataAsset {
  id: string;
  key: string;
  name: string;
  domain: string;
  schemaVersion: string;
  classification:
    | 'public'
    | 'internal'
    | 'confidential'
    | 'restricted';
  records: Array<Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
}

export interface AiTeam {
  id: string;
  key: string;
  name: string;
  mission: string;
  agentKeys: string[];
  humanFinalAuthority: boolean;
  createdAt: string;
}