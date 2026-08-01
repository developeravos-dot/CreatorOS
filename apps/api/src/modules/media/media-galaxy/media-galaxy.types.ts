export type GalaxyProjectStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'operational'
  | 'paused'
  | 'archived';

export interface CreateGalaxyProjectInput {
  name: string;
  mission: string;
  audience: string;
  platforms: string[];
  languages?: string[];
  markets?: string[];
  revenueGoals?: string[];
}

export interface GalaxyDecision {
  id: string;
  projectId: string;
  council: string[];
  subject: string;
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
  requiresHumanApproval: boolean;
  approved: boolean;
  createdAt: string;
}

export interface GalaxyProject {
  id: string;
  status: GalaxyProjectStatus;
  createdAt: string;
  updatedAt: string;
  input: CreateGalaxyProjectInput;
  executiveCouncil: Record<string, unknown>;
  organization: Record<string, unknown>;
  knowledge: Record<string, unknown>;
  digitalDna: Record<string, unknown>;
  worldModel: Record<string, unknown>;
  contentFactory: Record<string, unknown>;
  revenuePlatform: Record<string, unknown>;
  globalExpansion: Record<string, unknown>;
  intelligence: Record<string, unknown>;
  security: Record<string, unknown>;
  governance: {
    humanFinalAuthority: true;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
}
