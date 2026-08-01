export type CharacterAudienceTier =
  | 'kids'
  | 'junior'
  | 'teen'
  | 'adult'
  | 'family';

export type CharacterRole =
  | 'protagonist'
  | 'co-protagonist'
  | 'mentor'
  | 'friend'
  | 'rival'
  | 'antagonist'
  | 'supporting'
  | 'recurring'
  | 'temporary';

export type MemoryType =
  | 'event'
  | 'relationship'
  | 'promise'
  | 'success'
  | 'failure'
  | 'fear'
  | 'betrayal'
  | 'discovery'
  | 'lesson';

export type RelationshipType =
  | 'family'
  | 'friendship'
  | 'mentorship'
  | 'rivalry'
  | 'alliance'
  | 'conflict'
  | 'unknown';

export interface CharacterTrait {
  name: string;
  value: number;
  stability: number;
  visible: boolean;
}

export interface CharacterNeed {
  name: string;
  urgency: number;
  satisfaction: number;
}

export interface CharacterGoal {
  id: string;
  title: string;
  description: string;
  priority: number;
  progress: number;
  active: boolean;
  hidden: boolean;
  longTerm: boolean;
}

export interface CharacterFear {
  id: string;
  name: string;
  intensity: number;
  origin: string;
  copingStrategy: string;
  resolved: boolean;
}

export interface CharacterMemory {
  id: string;
  type: MemoryType;
  title: string;
  description: string;

  worldYear: number;
  episodeNumber?: number;

  emotionalImpact: number;
  importance: number;

  affectedTraits: string[];
  involvedCharacterIds: string[];

  recalledCount: number;
  lastRecalledAt?: string;

  resolved: boolean;
  createdAt: string;
}

export interface CharacterRelationship {
  id: string;
  targetCharacterId: string;
  targetCharacterName: string;

  type: RelationshipType;

  trust: number;
  affection: number;
  respect: number;
  fear: number;
  rivalry: number;
  dependency: number;

  sharedMemoryIds: string[];
  unresolvedIssues: string[];

  lastUpdatedAt: string;
}

export interface EmotionalState {
  happiness: number;
  sadness: number;
  fear: number;
  anger: number;
  curiosity: number;
  confidence: number;
  guilt: number;
  hope: number;
  loneliness: number;

  dominantEmotion: string;
  emotionalStability: number;
  lastUpdatedAt: string;
}

export interface PsychologicalProfile {
  personalityArchetype: string;

  traits: CharacterTrait[];
  needs: CharacterNeed[];

  attachmentStyle:
    | 'secure'
    | 'anxious'
    | 'avoidant'
    | 'mixed';

  decisionStyle:
    | 'analytical'
    | 'emotional'
    | 'impulsive'
    | 'collaborative'
    | 'cautious'
    | 'adaptive';

  moralOrientation: string;
  stressTolerance: number;
  empathy: number;
  selfAwareness: number;
  adaptability: number;

  emotionalState: EmotionalState;
}

export interface CharacterLocalization {
  languageCode: string;
  localizedName: string;
  voiceProfile: string;
  speechStyle: string;
  culturalNotes: string[];
  adaptationMode:
    | 'translation'
    | 'cultural-adaptation'
    | 'native-reproduction';
}

export interface CharacterIdentity {
  characterId: string;
  worldId: string;

  canonicalName: string;
  role: CharacterRole;
  audienceTier: CharacterAudienceTier;

  age: number;
  apparentAge: number;

  species: string;
  genderIdentity: string;

  biography: string;
  visualDescription: string;

  originLocation: string;
  currentLocation: string;

  signatureElements: string[];
}

export interface LivingCharacter {
  identity: CharacterIdentity;

  psychology: PsychologicalProfile;

  goals: CharacterGoal[];
  fears: CharacterFear[];

  secrets: string[];
  values: string[];
  skills: string[];
  weaknesses: string[];

  memories: CharacterMemory[];
  relationships: CharacterRelationship[];

  localizations: CharacterLocalization[];

  continuity: {
    version: number;
    totalExperiences: number;
    majorPsychologicalChanges: number;
    unresolvedInternalConflicts: string[];
    lastEpisodeNumber?: number;
    continuityScore: number;
    lastUpdatedAt: string;
  };
}

export interface CharacterRosterResult {
  success: boolean;
  engine: string;
  version: string;
  status: 'characters-created';

  worldId: string;
  characters: LivingCharacter[];

  summary: {
    totalCharacters: number;
    protagonists: number;
    supportingCharacters: number;
    relationshipCount: number;
    languageCount: number;
  };
}

export interface CharacterEventImpact {
  success: boolean;
  engine: string;
  version: string;
  status: 'event-applied';

  worldId: string;
  characterId: string;
  eventId: string;

  memoryCreated: CharacterMemory;
  previousEmotionalState: EmotionalState;
  currentEmotionalState: EmotionalState;

  changedTraits: CharacterTrait[];
  changedRelationships: CharacterRelationship[];

  continuityScore: number;
}

export interface CharacterDecisionOption {
  optionId: string;
  title: string;
  description: string;

  risk: number;
  moralCost: number;
  relationshipImpact: number;
  goalAlignment: number;
  fearActivation: number;
}

export interface CharacterDecisionEvaluation {
  optionId: string;
  title: string;

  personalityFit: number;
  emotionalFit: number;
  goalFit: number;
  valueFit: number;
  relationshipFit: number;
  fearPenalty: number;
  totalScore: number;

  reasons: string[];
}

export interface CharacterDecisionResult {
  success: boolean;
  engine: string;
  version: string;
  status: 'decision-generated';

  characterId: string;
  characterName: string;

  selectedOptionId: string;
  selectedOptionTitle: string;

  evaluations: CharacterDecisionEvaluation[];

  psychologicalExplanation: string[];
  continuityWarnings: string[];
}
