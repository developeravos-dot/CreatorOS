import type {
  DraftPatentClaim,
  InventiveMechanism,
} from '../../v3/models/novelty-v3.models';

import type {
  NormalizedPatentDocument,
  ClaimSimilarityResult,
} from '../../v3-2/models/novelty-v3-2.models';

export type KnowledgeNodeType =
  | 'idea'
  | 'claim'
  | 'claim-element'
  | 'mechanism'
  | 'technical-effect'
  | 'technology'
  | 'industry'
  | 'patent-document'
  | 'classification'
  | 'risk';

export type KnowledgeEdgeType =
  | 'contains'
  | 'implements'
  | 'produces'
  | 'supports'
  | 'overlaps'
  | 'differs-from'
  | 'belongs-to'
  | 'transferred-from'
  | 'contradicts'
  | 'depends-on'
  | 'reduces-risk';

export interface PatentKnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  label: string;
  description: string;
  sourceId?: string;
  metadata: Record<string, string | number | boolean | string[]>;
}

export interface PatentKnowledgeEdge {
  id: string;
  from: string;
  to: string;
  type: KnowledgeEdgeType;
  weight: number;
  explanation: string;
}

export interface PatentKnowledgeGraph {
  nodes: PatentKnowledgeNode[];
  edges: PatentKnowledgeEdge[];
  metrics: {
    nodeCount: number;
    edgeCount: number;
    claimNodes: number;
    mechanismNodes: number;
    patentNodes: number;
    connectedComponents: number;
    graphDensity: number;
  };
}

export interface ExtractedClaimElement {
  id: string;
  claimNumber: number;
  claimType: DraftPatentClaim['type'];
  category:
    | 'system-component'
    | 'input'
    | 'processing-step'
    | 'output'
    | 'constraint'
    | 'technical-effect'
    | 'relationship'
    | 'unknown';

  text: string;
  normalizedText: string;
  essential: boolean;
  supportReferences: string[];
}

export interface MechanismSignature {
  mechanismId: string;
  name: string;
  problem: string;
  inputs: string[];
  operations: string[];
  outputs: string[];
  technicalEffects: string[];
  constraints: string[];
  signatureTokens: string[];
}

export interface MechanismSimilarityResult {
  sourceMechanismId: string;
  sourceMechanismName: string;
  targetDocumentId: string;
  targetDocumentTitle: string;
  publicationNumber?: string;

  inputSimilarity: number;
  operationSimilarity: number;
  outputSimilarity: number;
  technicalEffectSimilarity: number;
  structuralSimilarity: number;
  totalSimilarity: number;

  sharedElements: string[];
  distinguishingElements: string[];

  risk: 'low' | 'moderate' | 'high' | 'critical';
  verified: boolean;
}

export interface InventiveStepReasoning {
  mechanismId: string;
  mechanismName: string;

  closestDocuments: Array<{
    documentId: string;
    title: string;
    publicationNumber?: string;
    similarity: number;
    verified: boolean;
  }>;

  differences: string[];
  technicalEffects: string[];
  objectiveTechnicalProblem: string;

  obviousCombinationRisk: number;
  inventiveStepScore: number;

  conclusion:
    | 'weak'
    | 'uncertain'
    | 'plausible'
    | 'strong';

  explanation: string[];
}

export interface ClaimCoverageAnalysis {
  claimNumber: number;
  totalElements: number;
  supportedElements: number;
  externallyCoveredElements: number;
  distinguishingElements: number;
  unsupportedElements: string[];
  highRiskElements: string[];

  internalSupportCoverage: number;
  externalPriorArtCoverage: number;
  distinguishingCoverage: number;
  finalCoverageScore: number;
}

export interface ExplainablePatentabilityReport {
  overallConclusion:
    | 'insufficient-evidence'
    | 'high-prior-art-risk'
    | 'potentially-distinguishable'
    | 'strong-provisional-case';

  noveltyExplanation: string[];
  inventiveStepExplanation: string[];
  claimSupportExplanation: string[];
  riskExplanation: string[];

  strongestProtectableElements: string[];
  weakestElements: string[];
  designAroundRecommendations: string[];
  evidenceRequired: string[];
}

export interface NoveltyV33Scores {
  graphCompleteness: number;
  claimElementClarity: number;
  mechanismDistinctiveness: number;
  inventiveStepReasoning: number;
  claimCoverage: number;
  explanationQuality: number;
  evidenceConfidence: number;
  uncertainty: number;
  total: number;
}

export interface NoveltyV33Result {
  success: boolean;
  engine: string;
  version: string;
  runId: string;

  status:
    | 'analysis-completed'
    | 'external-evidence-required'
    | 'high-risk-detected';

  claimElements: ExtractedClaimElement[];
  mechanismSignatures: MechanismSignature[];

  knowledgeGraph: PatentKnowledgeGraph;

  mechanismSimilarity: MechanismSimilarityResult[];
  inventiveStepReasoning: InventiveStepReasoning[];
  claimCoverage: ClaimCoverageAnalysis[];

  explainableReport: ExplainablePatentabilityReport;
  scores: NoveltyV33Scores;

  sourceSummary: {
    claimsAnalyzed: number;
    mechanismsAnalyzed: number;
    documentsAnalyzed: number;
    verifiedDocuments: number;
    syntheticDocuments: number;
  };
}
