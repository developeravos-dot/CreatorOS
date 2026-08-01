import { Module } from '@nestjs/common';

import { IdeaMutationEngine } from './engines/idea-mutation.engine';
import { IdeaRecombinationEngine } from './engines/idea-recombination.engine';
import { NoveltyOpportunityFinderEngine } from './engines/novelty-opportunity-finder.engine';
import { OriginalityEvaluatorEngine } from './engines/originality-evaluator.engine';
import { ProtectabilityPredictorEngine } from './engines/protectability-predictor.engine';
import { WeaknessAnalyzerEngine } from './engines/weakness-analyzer.engine';
import { NoveltyGenerationController } from './novelty-generation.controller';
import { NoveltyGenerationService } from './novelty-generation.service';

import { AdaptiveMutationPlannerEngine } from './v2/engines/adaptive-mutation-planner.engine';
import { ConceptMutationEngine } from './v2/engines/concept-mutation.engine';
import { DnaNoveltyEvaluatorEngine } from './v2/engines/dna-novelty-evaluator.engine';
import { DnaRecombinationEngine } from './v2/engines/dna-recombination.engine';
import { IdeaDnaExtractorEngine } from './v2/engines/idea-dna-extractor.engine';
import { IdeaRebuilderEngine } from './v2/engines/idea-rebuilder.engine';
import { NoveltyGenerationV2Service } from './v2/novelty-generation-v2.service';

import { CrossIndustryTransferEngine } from './v3/engines/cross-industry-transfer.engine';
import { DraftPatentClaimGeneratorEngine } from './v3/engines/draft-patent-claim-generator.engine';
import { InventivePrincipleGeneratorEngine } from './v3/engines/inventive-principle-generator.engine';
import { PriorArtReasoningEngine } from './v3/engines/prior-art-reasoning.engine';
import { ProtectabilityOptimizerEngine } from './v3/engines/protectability-optimizer.engine';
import { TrizReasoningEngine } from './v3/engines/triz-reasoning.engine';
import { NoveltyGenerationV3Service } from './v3/novelty-generation-v3.service';

import { CitationReadyPriorArtEngine } from './v3-1/engines/citation-ready-prior-art.engine';
import { ClaimSupportMatrixEngine } from './v3-1/engines/claim-support-matrix.engine';
import { EvidenceConfidenceEngine } from './v3-1/engines/evidence-confidence.engine';
import { EvidenceNormalizerEngine } from './v3-1/engines/evidence-normalizer.engine';
import { FalseConfidenceGuardEngine } from './v3-1/engines/false-confidence-guard.engine';
import { PatentSearchPlanEngine } from './v3-1/engines/patent-search-plan.engine';
import { PatentUncertaintyEngine } from './v3-1/engines/patent-uncertainty.engine';
import { PriorArtCoverageEngine } from './v3-1/engines/prior-art-coverage.engine';
import { NoveltyGenerationV31Service } from './v3-1/novelty-generation-v3-1.service';

import { EpoOpsPatentAdapter } from './v3-2/adapters/epo-ops-patent.adapter';
import { LensPatentAdapter } from './v3-2/adapters/lens-patent.adapter';
import { LocalSimulationPatentAdapter } from './v3-2/adapters/local-simulation-patent.adapter';
import { AutomaticEvidenceIngestionEngine } from './v3-2/engines/automatic-evidence-ingestion.engine';
import { ClaimLevelSimilarityEngine } from './v3-2/engines/claim-level-similarity.engine';
import { PatentDocumentNormalizerEngine } from './v3-2/engines/patent-document-normalizer.engine';
import { PatentSearchAdapterRegistry } from './v3-2/engines/patent-search-adapter-registry.engine';
import { PatentSearchJobOrchestrator } from './v3-2/engines/patent-search-job-orchestrator.engine';
import { NoveltyGenerationV32Service } from './v3-2/novelty-generation-v3-2.service';

import { ClaimCoverageAnalyzerEngine } from './v3-3/engines/claim-coverage-analyzer.engine';
import { ClaimElementExtractorEngine } from './v3-3/engines/claim-element-extractor.engine';
import { InventiveStepReasoningEngine } from './v3-3/engines/inventive-step-reasoning.engine';
import { MechanismSignatureEngine } from './v3-3/engines/mechanism-signature.engine';
import { MechanismSimilarityEngine } from './v3-3/engines/mechanism-similarity.engine';
import { PatentabilityExplanationEngine } from './v3-3/engines/patentability-explanation.engine';
import { PriorArtKnowledgeGraphEngine } from './v3-3/engines/prior-art-knowledge-graph.engine';
import { NoveltyGenerationV33Service } from './v3-3/novelty-generation-v3-3.service';

@Module({
  controllers: [
    NoveltyGenerationController,
  ],

  providers: [
    NoveltyGenerationService,
    WeaknessAnalyzerEngine,
    NoveltyOpportunityFinderEngine,
    IdeaMutationEngine,
    IdeaRecombinationEngine,
    OriginalityEvaluatorEngine,
    ProtectabilityPredictorEngine,

    NoveltyGenerationV2Service,
    AdaptiveMutationPlannerEngine,
    IdeaDnaExtractorEngine,
    ConceptMutationEngine,
    DnaRecombinationEngine,
    DnaNoveltyEvaluatorEngine,
    IdeaRebuilderEngine,

    NoveltyGenerationV3Service,
    TrizReasoningEngine,
    CrossIndustryTransferEngine,
    PriorArtReasoningEngine,
    InventivePrincipleGeneratorEngine,
    DraftPatentClaimGeneratorEngine,
    ProtectabilityOptimizerEngine,

    NoveltyGenerationV31Service,
    EvidenceNormalizerEngine,
    EvidenceConfidenceEngine,
    ClaimSupportMatrixEngine,
    PriorArtCoverageEngine,
    PatentUncertaintyEngine,
    FalseConfidenceGuardEngine,
    PatentSearchPlanEngine,
    CitationReadyPriorArtEngine,

    NoveltyGenerationV32Service,
    NoveltyGenerationV33Service,
    LocalSimulationPatentAdapter,
    LensPatentAdapter,
    EpoOpsPatentAdapter,
    PatentSearchAdapterRegistry,
    PatentSearchJobOrchestrator,
    PatentDocumentNormalizerEngine,
    ClaimLevelSimilarityEngine,
    AutomaticEvidenceIngestionEngine,

    NoveltyGenerationV33Service,
    ClaimElementExtractorEngine,
    MechanismSignatureEngine,
    PriorArtKnowledgeGraphEngine,
    MechanismSimilarityEngine,
    InventiveStepReasoningEngine,
    ClaimCoverageAnalyzerEngine,
    PatentabilityExplanationEngine,
  ],

  exports: [
    NoveltyGenerationService,
    NoveltyGenerationV2Service,
    NoveltyGenerationV3Service,
    NoveltyGenerationV31Service,
    NoveltyGenerationV32Service,
    NoveltyGenerationV33Service,
  ],
})
export class NoveltyGenerationModule {}



