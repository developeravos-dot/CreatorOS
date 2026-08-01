import type {
  DraftPatentClaim,
  NoveltyV3Result,
  PriorArtReasoningItem,
} from '../../v3/models/novelty-v3.models';

export type EvidenceType =
  | 'user-input'
  | 'internal-analysis'
  | 'technical-definition'
  | 'prototype'
  | 'experiment'
  | 'prior-art-document'
  | 'patent-document'
  | 'scientific-publication'
  | 'market-evidence'
  | 'unknown';

export type EvidenceVerificationStatus =
  | 'unverified'
  | 'partially-verified'
  | 'verified'
  | 'rejected';

export interface PatentEvidenceRecord {
  id: string;
  type: EvidenceType;
  title: string;
  source?: string;
  reference?: string;
  publicationNumber?: string;
  publicationDate?: string;

  supports: string[];
  contradicts: string[];

  relevance: number;
  reliability: number;
  verificationStatus: EvidenceVerificationStatus;

  notes: string[];
}

export interface ClaimSupportItem {
  supportId: string;
  category:
    | 'idea-dna'
    | 'technical-mechanism'
    | 'triz'
    | 'cross-industry-transfer'
    | 'prior-art-difference'
    | 'external-evidence';

  reference: string;
  description: string;
  supportStrength: number;
  evidenceRecordIds: string[];
}

export interface ClaimSupportMatrixRow {
  claimNumber: number;
  claimType: DraftPatentClaim['type'];
  claimText: string;

  elements: string[];
  supportItems: ClaimSupportItem[];

  supportCoverage: number;
  evidenceCoverage: number;
  unsupportedElements: string[];
  contradictions: string[];

  status:
    | 'supported'
    | 'partially-supported'
    | 'unsupported'
    | 'contradicted';
}

export interface EvidenceConfidenceReport {
  evidenceRecordCount: number;
  verifiedEvidenceCount: number;
  externalEvidenceCount: number;
  patentDocumentCount: number;
  publicationCount: number;

  sourceDiversity: number;
  averageReliability: number;
  averageRelevance: number;
  verificationCoverage: number;

  confidenceScore: number;
  confidenceLevel:
    | 'very-low'
    | 'low'
    | 'moderate'
    | 'high'
    | 'very-high';

  limitations: string[];
}

export interface PriorArtCoverageReport {
  heuristicPatternsAnalyzed: number;
  evidenceBackedReferences: number;
  verifiedPatentReferences: number;
  verifiedPublicationReferences: number;

  claimCoverage: number;
  mechanismCoverage: number;
  searchCoverage: number;

  coverageScore: number;
  coverageLevel:
    | 'none'
    | 'limited'
    | 'partial'
    | 'substantial'
    | 'strong';

  uncoveredAreas: string[];
}

export interface UncertaintyReport {
  evidenceUncertainty: number;
  priorArtUncertainty: number;
  claimSupportUncertainty: number;
  technicalValidationUncertainty: number;
  legalUncertainty: number;

  totalUncertainty: number;

  majorUnknowns: string[];
  reductionActions: string[];
}

export interface CalibratedPatentScores {
  heuristicProtectability: number;
  evidenceConfidence: number;
  verifiedPriorArtCoverage: number;
  claimSupportCoverage: number;
  technicalValidation: number;
  uncertainty: number;

  falseConfidencePenalty: number;
  finalCalibratedProtectability: number;
}

export interface FalseConfidenceFinding {
  code: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  affectedMetric: string;
  originalValue: number;
  cappedValue: number;
  reason: string;
}

export interface PatentSearchQueryPlan {
  queryId: string;
  purpose:
    | 'novelty'
    | 'inventive-step'
    | 'claim-element'
    | 'technical-effect'
    | 'design-around';

  query: string;
  targetDatabases: string[];
  targetClaimNumbers: number[];
  targetMechanisms: string[];
  priority: number;
}

export interface CitationReadyPriorArtEntry {
  evidenceId?: string;
  referenceLabel: string;
  title: string;
  publicationNumber?: string;
  publicationDate?: string;
  source?: string;

  relevantClaims: number[];
  overlap: string[];
  differences: string[];
  risk: number;

  verified: boolean;
  citationStatus:
    | 'ready'
    | 'partial'
    | 'missing-source'
    | 'unverified';
}

export interface NoveltyV31Result {
  success: boolean;
  engine: string;
  version: string;
  runId: string;
  status:
    | 'evidence-insufficient'
    | 'provisionally-supported'
    | 'evidence-supported';

  baseV3: NoveltyV3Result;

  evidenceRecords: PatentEvidenceRecord[];
  evidenceConfidence: EvidenceConfidenceReport;

  claimSupportMatrix: ClaimSupportMatrixRow[];
  priorArtCoverage: PriorArtCoverageReport;
  uncertainty: UncertaintyReport;

  falseConfidenceFindings: FalseConfidenceFinding[];
  calibratedScores: CalibratedPatentScores;

  patentSearchPlan: PatentSearchQueryPlan[];
  citationReadyPriorArtReport: CitationReadyPriorArtEntry[];

  decision: {
    proceedToFormalSearch: boolean;
    proceedToPatentDrafting: boolean;
    proceedToFiling: boolean;
    reason: string;
    requiredNextEvidence: string[];
  };

  legalNotice: string;
}
