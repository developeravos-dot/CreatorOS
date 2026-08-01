export type EpisodeAudienceTier =
  | 'kids'
  | 'junior'
  | 'teen'
  | 'adult'
  | 'family';

export type EpisodeTone =
  | 'wonder'
  | 'mystery'
  | 'adventure'
  | 'emotional'
  | 'comedy'
  | 'tension'
  | 'discovery'
  | 'hybrid';

export type EpisodeSceneType =
  | 'opening-hook'
  | 'setup'
  | 'discovery'
  | 'conflict'
  | 'decision'
  | 'reversal'
  | 'emotional-payoff'
  | 'cliffhanger'
  | 'resolution';

export interface StoryPressureProfile {
  curiosity: number;
  tension: number;
  empathy: number;
  mystery: number;
  hope: number;
  humor: number;
  surprise: number;
  emotionalSafety: number;
  repetitionRisk: number;
  fatigueRisk: number;

  dominantPressure: string;
  recommendedAdjustment: string[];
  totalPressureScore: number;
}

export interface EpisodeCharacterSelection {
  characterId: string;
  characterName: string;
  role: string;

  narrativeReason: string;
  psychologicalReason: string;

  currentDominantEmotion: string;
  activeGoal?: string;
  activeFear?: string;

  episodeFunction:
    | 'lead'
    | 'support'
    | 'opposition'
    | 'mentor'
    | 'emotional-anchor'
    | 'catalyst';
}

export interface EpisodeScene {
  sceneNumber: number;
  type: EpisodeSceneType;

  title: string;
  location: string;

  participatingCharacterIds: string[];
  participatingCharacterNames: string[];

  purpose: string;
  summary: string;

  emotionalTarget: string;
  curiosityDelta: number;
  tensionDelta: number;
  empathyDelta: number;

  continuityReferences: string[];
  futureSeeds: string[];

  estimatedDurationSeconds: number;
}

export interface EpisodeCharacterImpact {
  characterId: string;
  characterName: string;

  expectedMemoryType:
    | 'event'
    | 'relationship'
    | 'promise'
    | 'success'
    | 'failure'
    | 'fear'
    | 'betrayal'
    | 'discovery'
    | 'lesson';

  expectedEmotionalImpact: number;
  expectedImportance: number;

  affectedTraits: string[];
  relationshipTargets: string[];

  psychologicalExplanation: string;
}

export interface EndlessEpisode {
  episodeId: string;
  worldId: string;

  episodeNumber: number;
  worldYear: number;

  title: string;
  logline: string;
  synopsis: string;

  audienceTier: EpisodeAudienceTier;
  tone: EpisodeTone;

  sourceStoryThread: string;
  secondaryStoryThreads: string[];

  selectedCharacters: EpisodeCharacterSelection[];
  scenes: EpisodeScene[];

  pressureProfile: StoryPressureProfile;
  characterImpacts: EpisodeCharacterImpact[];

  continuity: {
    previousEpisodeIds: string[];
    referencedMemories: string[];
    referencedMysteries: string[];
    openedThreads: string[];
    advancedThreads: string[];
    resolvedThreads: string[];
    continuityScore: number;
    repetitionScore: number;
  };

  production: {
    targetDurationMinutes: number;
    languageCodes: string[];
    localizationRequired: boolean;
    dialogueGenerationReady: boolean;
    visualProductionReady: boolean;
  };

  status:
    | 'planned'
    | 'approved'
    | 'produced'
    | 'published';

  createdAt: string;
}

export interface EpisodeGenerationResult {
  success: boolean;
  engine: string;
  version: string;
  status: 'episode-planned';

  episode: EndlessEpisode;

  nextActions: string[];
}
