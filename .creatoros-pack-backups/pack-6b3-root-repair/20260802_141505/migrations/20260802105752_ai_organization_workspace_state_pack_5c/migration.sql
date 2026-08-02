CREATE TABLE "AiOrganizationWorkspaceState" (
    "id" TEXT NOT NULL,
    "workspaceKey" TEXT NOT NULL,
    "projectId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiOrganizationWorkspaceState_pkey"
        PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX
    "AiOrganizationWorkspaceState_workspaceKey_key"
ON
    "AiOrganizationWorkspaceState"("workspaceKey");

CREATE INDEX
    "AiOrganizationWorkspaceState_projectId_idx"
ON
    "AiOrganizationWorkspaceState"("projectId");

CREATE INDEX
    "AiOrganizationWorkspaceState_updatedAt_idx"
ON
    "AiOrganizationWorkspaceState"("updatedAt");