export type AudienceTier =
  | 'kids'
  | 'junior'
  | 'teen'
  | 'adult'
  | 'family';

export type UniverseGenre =
  | 'adventure'
  | 'fantasy'
  | 'science-fiction'
  | 'mystery'
  | 'comedy'
  | 'education'
  | 'psychological'
  | 'hybrid';

export interface UniverseLanguage {
  code: string;
  name: string;
  primary: boolean;
  localizationMode:
    | 'translation'
    | 'cultural-adaptation'
    | 'native-reproduction';
}

export interface UniverseLaw {
  id: string;
  name: string;
  description: string;
  immutable: boolean;
  storyImpact: number;
}

export interface WorldLocation {
  id: string;
  name: string;
  type:
    | 'city'
    | 'village'
    | 'region'
    | 'planet'
    | 'school'
    | 'organization'
    | 'hidden-place';

  description: string;
  population: number;
  dangerLevel: number;
  opportunityLevel: number;
  emotionalTone: string;
}

export interface Civilization {
  id: string;
  name: string;
  values: string[];
  customs: string[];
  technologyLevel: number;
  economicPower: number;
  politicalPower: number;
  relationships: string[];
}

export interface WorldEconomy {
  currency: string;
  resources: string[];
  scarceResources: string[];
  industries: string[];
  inequalityLevel: number;
  volatility: number;
}

export interface WorldPolitics {
  governanceModels: string[];
  institutions: string[];
  factions: string[];
  conflictLevel: number;
  stability: number;
}

export interface PsychologicalWorldProfile {
  primaryEmotions: string[];
  recurringConflicts: string[];
  moralComplexity: number;
  emotionalIntensity: number;
  psychologicalContinuity: boolean;
  delayedPayoffEnabled: boolean;
  longTermTraumaEnabled: boolean;
  characterMemoryRequired: boolean;
}

export interface TimelineEvent {
  id: string;
  worldYear: number;
  title: string;
  description: string;
  eventType:
    | 'discovery'
    | 'conflict'
    | 'relationship'
    | 'invention'
    | 'economic'
    | 'political'
    | 'psychological'
    | 'mystery';

  importance: number;
  affectedEntities: string[];
  unresolvedConsequences: string[];
}

export interface UniverseDna {
  id: string;
  name: string;
  audienceTier: AudienceTier;
  genres: UniverseGenre[];

  premise: string;
  visualStyle: string;
  narrativeTone: string;

  technologyLevel: number;
  fantasyLevel: number;
  realismLevel: number;

  endlessStoryEnabled: boolean;
  agingEnabled: boolean;
  deathPermanent: boolean;
  timeTravelEnabled: boolean;
  artificialIntelligenceEnabled: boolean;

  laws: UniverseLaw[];
  languages: UniverseLanguage[];
}

export interface LivingWorld {
  worldId: string;
  version: string;
  createdAt: string;

  universeDna: UniverseDna;
  locations: WorldLocation[];
  civilizations: Civilization[];

  economy: WorldEconomy;
  politics: WorldPolitics;
  psychology: PsychologicalWorldProfile;

  timeline: TimelineEvent[];

  endlessState: {
    currentWorldYear: number;
    activeMysteries: string[];
    activeConflicts: string[];
    futureSeeds: string[];
    openStoryThreads: number;
    continuityScore: number;
  };
}

export interface WorldEngineResult {
  success: boolean;
  engine: string;
  version: string;
  status: 'world-created';

  world: LivingWorld;

  capabilities: {
    universeDna: boolean;
    worldLaws: boolean;
    civilizations: boolean;
    economy: boolean;
    politics: boolean;
    psychology: boolean;
    timeline: boolean;
    endlessStoryReadiness: boolean;
    multilingualFranchise: boolean;
  };
}
