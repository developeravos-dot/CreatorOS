export interface NoveltyGenerationThresholds {
  originality: number;
  maximumDuplicateRisk: number;
  protectability: number;
  commercialValue: number;
  technicalFeasibility: number;
  innovation: number;
}

export interface IdeaCandidate {
  id: string;
  generation: number;
  parentIds: string[];
  title: string;
  description: string;
  targetUsers: string[];
  problem: string;
  solution: string;
  businessModel: string;
  technology: string[];
  differentiators: string[];
  sourceStrategy: string;
}

export interface IdeaScores {
  originality: number;
  duplicateRisk: number;
  protectability: number;
  commercialValue: number;
  technicalFeasibility: number;
  innovation: number;
  total: number;
}

export interface ScoredIdeaCandidate extends IdeaCandidate {
  scores: IdeaScores;
  weaknesses: string[];
  opportunities: string[];
}

export interface NoveltyIteration {
  iteration: number;
  generatedCandidates: number;
  bestCandidateId: string;
  bestScores: IdeaScores;
  accepted: boolean;
}

export interface NoveltyGenerationResult {
  success: boolean;
  runId: string;
  status: 'accepted' | 'best-effort';
  originalIdea: IdeaCandidate;
  finalProtectableIdea: ScoredIdeaCandidate;
  iterations: NoveltyIteration[];
  mutationHistory: IdeaCandidate[];
  recombinationHistory: IdeaCandidate[];
  generatedCandidates: number;
  thresholds: NoveltyGenerationThresholds;
  improvementSummary: string[];
}
