export interface AiOrganizationWorkspaceStateInput {
  workspaceKey: string;
  projectId?: string | null;
  expectedVersion?: number;
  state: Record<string, unknown>;
}

export interface AiOrganizationWorkspaceStateRecord {
  id: string;
  workspaceKey: string;
  projectId: string | null;
  version: number;
  state: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AiOrganizationPersistenceHealth {
  status: "operational";
  storage: "postgresql";
  orm: "prisma";
  humanFinalAuthority: true;
  persistent: true;
}
