import { Module } from '@nestjs/common';
import { ContentIntelligenceStageModule } from '../content-intelligence-stage/content-intelligence-stage.module';
import { AudienceIntelligenceStageModule } from '../audience-intelligence-stage/audience-intelligence-stage.module';
import { ProductionStrategyStageModule } from '../production-strategy-stage/production-strategy-stage.module';
import { CreativeDirectionStageModule } from '../creative-direction-stage/creative-direction-stage.module';
import { ScriptIntelligenceStageModule } from '../script-intelligence-stage/script-intelligence-stage.module';
import { StoryboardIntelligenceStageModule } from '../storyboard-intelligence-stage/storyboard-intelligence-stage.module';
import { VisualStyleIntelligenceStageModule } from '../visual-style-intelligence-stage/visual-style-intelligence-stage.module';
import { CinematographyIntelligenceStageModule } from '../cinematography-intelligence-stage/cinematography-intelligence-stage.module';
import { LightingIntelligenceStageModule } from '../lighting-intelligence-stage/lighting-intelligence-stage.module';
import { CharacterIntelligenceStageModule } from '../character-intelligence-stage/character-intelligence-stage.module';
import { VoiceIntelligenceStageModule } from '../voice-intelligence-stage/voice-intelligence-stage.module';
import { MusicIntelligenceStageModule } from '../music-intelligence-stage/music-intelligence-stage.module';
import { SoundDesignIntelligenceStageModule } from '../sound-design-intelligence-stage/sound-design-intelligence-stage.module';
import { EditingIntelligenceStageModule } from '../editing-intelligence-stage/editing-intelligence-stage.module';
import { ModelRoutingStageModule } from '../model-routing-stage/model-routing-stage.module';
import { ProductionCouncilStageModule } from '../production-council-stage/production-council-stage.module';
import { CreativeQualityAssuranceStageModule } from '../creative-quality-assurance-stage/creative-quality-assurance-stage.module';
import { BrandStrategyStageModule } from '../brand-strategy-stage/brand-strategy-stage.module';
import { BrandNamingStageModule } from '../brand-naming-stage/brand-naming-stage.module';
import { BrandPersonalityStageModule } from '../brand-personality-stage/brand-personality-stage.module';
import { VisualDnaStageModule } from '../visual-dna-stage/visual-dna-stage.module';
import { LogoIntelligenceStageModule } from '../logo-intelligence-stage/logo-intelligence-stage.module';
import { BannerIntelligenceStageModule } from '../banner-intelligence-stage/banner-intelligence-stage.module';
import { ThumbnailIntelligenceStageModule } from '../thumbnail-intelligence-stage/thumbnail-intelligence-stage.module';
import { BrandDesignSystemStageModule } from '../brand-design-system-stage/brand-design-system-stage.module';
import { BrandBookStageModule } from '../brand-book-stage/brand-book-stage.module';
import { CreativeAssetLibraryStageModule } from '../creative-asset-library-stage/creative-asset-library-stage.module';
import { CreativeTemplateEngineStageModule } from '../creative-template-engine-stage/creative-template-engine-stage.module';
import { MultilingualCreativeAdaptationStageModule } from '../multilingual-creative-adaptation-stage/multilingual-creative-adaptation-stage.module';
import { MulticulturalAdaptationStageModule } from '../multicultural-adaptation-stage/multicultural-adaptation-stage.module';
import { MultiplatformAdaptationStageModule } from '../multiplatform-adaptation-stage/multiplatform-adaptation-stage.module';
import { CreativeExperimentationStageModule } from '../creative-experimentation-stage/creative-experimentation-stage.module';
import { CreativeAnalyticsStageModule } from '../creative-analytics-stage/creative-analytics-stage.module';
import { CreativeLearningStageModule } from '../creative-learning-stage/creative-learning-stage.module';
import { EcosystemOrchestrationStageModule } from '../ecosystem-orchestration-stage/ecosystem-orchestration-stage.module';
import { ChannelNetworkIntelligenceStageModule } from '../channel-network-intelligence-stage/channel-network-intelligence-stage.module';
import { CrossPromotionIntelligenceStageModule } from '../cross-promotion-intelligence-stage/cross-promotion-intelligence-stage.module';
import { AudienceSharingIntelligenceStageModule } from '../audience-sharing-intelligence-stage/audience-sharing-intelligence-stage.module';
import { GlobalMediaOrchestrationStageModule } from '../global-media-orchestration-stage/global-media-orchestration-stage.module';
import { HumanFinalAuthorityStageModule } from '../human-final-authority-stage/human-final-authority-stage.module';

const CreativeMediaEcosystemModules = [
  ContentIntelligenceStageModule,
  AudienceIntelligenceStageModule,
  ProductionStrategyStageModule,
  CreativeDirectionStageModule,
  ScriptIntelligenceStageModule,
  StoryboardIntelligenceStageModule,
  VisualStyleIntelligenceStageModule,
  CinematographyIntelligenceStageModule,
  LightingIntelligenceStageModule,
  CharacterIntelligenceStageModule,
  VoiceIntelligenceStageModule,
  MusicIntelligenceStageModule,
  SoundDesignIntelligenceStageModule,
  EditingIntelligenceStageModule,
  ModelRoutingStageModule,
  ProductionCouncilStageModule,
  CreativeQualityAssuranceStageModule,
  BrandStrategyStageModule,
  BrandNamingStageModule,
  BrandPersonalityStageModule,
  VisualDnaStageModule,
  LogoIntelligenceStageModule,
  BannerIntelligenceStageModule,
  ThumbnailIntelligenceStageModule,
  BrandDesignSystemStageModule,
  BrandBookStageModule,
  CreativeAssetLibraryStageModule,
  CreativeTemplateEngineStageModule,
  MultilingualCreativeAdaptationStageModule,
  MulticulturalAdaptationStageModule,
  MultiplatformAdaptationStageModule,
  CreativeExperimentationStageModule,
  CreativeAnalyticsStageModule,
  CreativeLearningStageModule,
  EcosystemOrchestrationStageModule,
  ChannelNetworkIntelligenceStageModule,
  CrossPromotionIntelligenceStageModule,
  AudienceSharingIntelligenceStageModule,
  GlobalMediaOrchestrationStageModule,
  HumanFinalAuthorityStageModule,
];

@Module({
  imports: CreativeMediaEcosystemModules,
  exports: CreativeMediaEcosystemModules,
})
export class CreativeMediaEcosystemMegaModule {}
