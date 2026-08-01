export type ProductionStyle = 'realistic' | 'cinematic' | 'animation' | 'anime' | 'hybrid';
export type ProjectStatus = 'draft' | 'awaiting-human-approval' | 'approved' | 'active' | 'paused';

export interface CreateMediaEmpireProjectInput {
  name: string;
  contentType: string;
  audience: string;
  ageGroup?: string;
  platforms: string[];
  languages?: string[];
  cultures?: string[];
  objectives?: string[];
  preferredStyle?: ProductionStyle;
}

export interface BrandBlueprint {
  name: string;
  promise: string;
  personality: string[];
  voice: string[];
  colors: string[];
  typography: string[];
  logoDirection: string;
  thumbnailSystem: string;
  brandBookSections: string[];
}

export interface ProductionBlueprint {
  style: ProductionStyle;
  council: string[];
  modelRouting: Record<string, string>;
  cinematography: string[];
  lighting: string[];
  audio: string[];
  editing: string[];
  qualityGates: string[];
}

export interface EcosystemBlueprint {
  teams: string[];
  lifecycle: string[];
  growthLoops: string[];
  ipExpansion: string[];
  learningSignals: string[];
}

export interface MediaEmpireProject {
  id: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  input: CreateMediaEmpireProjectInput;
  brand: BrandBlueprint;
  production: ProductionBlueprint;
  ecosystem: EcosystemBlueprint;
  humanApproval: {
    required: true;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
}
