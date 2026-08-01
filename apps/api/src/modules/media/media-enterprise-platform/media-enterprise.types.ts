export type EnterpriseProjectStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'in-production'
  | 'ready-to-publish'
  | 'published'
  | 'paused'
  | 'archived';

export interface CreateEnterpriseMediaProjectInput {
  name: string;
  brandName: string;
  contentType: string;
  audience: string;
  platforms: string[];
  languages?: string[];
  markets?: string[];
  objectives?: string[];
  budget?: number;
}

export interface EnterpriseMediaEvent {
  id: string;
  projectId: string;
  type: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export interface EnterpriseMediaProject {
  id: string;
  status: EnterpriseProjectStatus;
  createdAt: string;
  updatedAt: string;
  input: CreateEnterpriseMediaProjectInput;
  brand: Record<string, unknown>;
  production: Record<string, unknown>;
  publishing: Record<string, unknown>;
  growth: Record<string, unknown>;
  intellectualProperty: Record<string, unknown>;
  revenue: Record<string, unknown>;
  governance: {
    humanFinalAuthority: true;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
  metrics: {
    productionProgress: number;
    publishingReadiness: number;
    growthReadiness: number;
    revenueReadiness: number;
  };
}
