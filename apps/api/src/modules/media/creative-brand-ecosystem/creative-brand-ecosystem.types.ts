export type ProductionStyle = 'realistic' | 'cinematic' | 'animation' | 'anime' | 'hybrid';
export type ProjectStatus = 'draft' | 'awaiting-human-approval' | 'approved' | 'operational' | 'paused';

export interface CreativeProjectInput {
  name: string;
  contentType: string;
  audience: string;
  ageGroup: string;
  platform: string;
  languages?: string[];
  cultures?: string[];
  goals?: string[];
}

export interface ProductionBlueprint {
  style: ProductionStyle;
  aiModelRouting: Record<string, string>;
  colors: string[];
  characters: string[];
  voices: string[];
  music: string;
  camera: string[];
  lighting: string;
  editing: string[];
  productionCouncil: string[];
  qualityGates: string[];
  localizationRules: string[];
}

export interface BrandIdentity {
  brandName: string;
  positioning: string;
  personality: string[];
  toneOfVoice: string[];
  logoDirection: string;
  bannerDirection: string;
  profileImageDirection: string;
  colorPalette: string[];
  typography: string[];
  iconography: string;
  thumbnailSystem: string[];
  brandBookSections: string[];
  seasonalVariants: string[];
}

export interface EcosystemPlan {
  departments: string[];
  agentTeams: string[];
  lifecycle: string[];
  networkEffects: string[];
  growthLoops: string[];
  intellectualPropertyPaths: string[];
  monetizationPaths: string[];
  humanFinalAuthority: true;
}

export interface CreativeBrandProject {
  id: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  input: CreativeProjectInput;
  production: ProductionBlueprint;
  brand: BrandIdentity;
  ecosystem: EcosystemPlan;
  approvals: { approved: boolean; approvedBy?: string; approvedAt?: string };
  learning: Array<{ at: string; signal: string; value: number; action: string }>;
}