import type {
  EvaluatedIdeaDna,
  NoveltyV2Result,
} from '../../v2/models/novelty-v2.models';

export interface TrizPrincipleApplication {
  principleNumber: number;
  principleName: string;
  contradiction: string;
  application: string;
  affectedDimensions: string[];
}

export interface CrossIndustryTransfer {
  sourceIndustry: string;
  sourceMechanism: string;
  transferredMechanism: string;
  noveltyReason: string;
  implementationElements: string[];
}

export interface PriorArtReasoningItem {
  pattern: string;
  overlap: string[];
  differences: string[];
  residualRisk: number;
  designAroundSuggestions: string[];
}

export interface InventiveMechanism {
  name: string;
  technicalProblem: string;
  mechanism: string;
  inputs: string[];
  processingSteps: string[];
  outputs: string[];
  technicalEffect: string;
  defensibility: string[];
}

export interface DraftPatentClaim {
  claimNumber: number;
  type: 'independent-system' | 'independent-method' | 'dependent';
  dependsOn?: number;
  text: string;
  supportElements: string[];
}

export interface ProtectabilityOptimization {
  beforeScore: number;
  afterScore: number;
  strengthenedElements: string[];
  remainingRisks: string[];
  recommendedEvidence: string[];
}

export interface NoveltyV3Scores {
  inventiveStep: number;
  technicalSpecificity: number;
  claimSupport: number;
  designAroundResistance: number;
  crossIndustryNovelty: number;
  priorArtDistance: number;
  protectability: number;
  total: number;
}

export interface NoveltyV3Result {
  success: boolean;
  engine: string;
  version: string;
  runId: string;
  status: 'accepted' | 'best-effort';

  baseEvolution: NoveltyV2Result;
  optimizedIdeaDna: EvaluatedIdeaDna;

  trizApplications: TrizPrincipleApplication[];
  crossIndustryTransfers: CrossIndustryTransfer[];
  priorArtReasoning: PriorArtReasoningItem[];
  inventiveMechanisms: InventiveMechanism[];
  draftPatentClaims: DraftPatentClaim[];
  protectabilityOptimization: ProtectabilityOptimization;
  scores: NoveltyV3Scores;

  finalInvention: {
    title: string;
    abstract: string;
    technicalProblem: string;
    inventiveConcept: string;
    systemComponents: string[];
    methodSteps: string[];
    technicalEffects: string[];
    protectableCore: string[];
    commercialDefensibility: string[];
  };

  legalNotice: string;
}
