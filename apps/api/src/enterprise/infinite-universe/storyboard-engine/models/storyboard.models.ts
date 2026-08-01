export type StoryboardAudienceTier =
  | 'kids'
  | 'junior'
  | 'teen'
  | 'adult'
  | 'family';

export type StoryboardShotType =
  | 'establishing'
  | 'wide'
  | 'medium'
  | 'close-up'
  | 'extreme-close-up'
  | 'over-the-shoulder'
  | 'point-of-view'
  | 'insert'
  | 'tracking'
  | 'reaction';

export interface CharacterVisualState {
  characterId: string;
  characterName: string;

  position:
    | 'left'
    | 'center'
    | 'right'
    | 'foreground'
    | 'background';

  pose: string;
  facialExpression: string;
  eyeDirection: string;
  bodyOrientation: string;

  wardrobeContinuity: string[];
  signatureElements: string[];

  visibleEmotion: string;
  hiddenEmotion: string;
}

export interface StoryboardFrame {
  frameNumber: number;
  shotType: StoryboardShotType;

  title: string;
  description: string;

  cameraAngle: string;
  cameraMovement: string;
  lensIntent: string;

  environment: string;
  backgroundDetails: string[];

  characters: CharacterVisualState[];

  lighting: {
    mood: string;
    source: string;
    intensity: number;
    colorTemperature: string;
  };

  soundCue: string[];
  dialogueReference: string[];

  psychologicalPurpose: string;
  narrativePurpose: string;

  estimatedDurationSeconds: number;

  imagePrompt: string;
  videoPrompt: string;
  negativePrompt: string;

  continuityKeys: string[];
}

export interface StoryboardScene {
  sceneNumber: number;
  sourceSceneType: string;

  heading: string;
  location: string;
  targetDurationSeconds: number;

  frames: StoryboardFrame[];

  sceneContinuity: {
    wardrobeLocked: boolean;
    environmentLocked: boolean;
    characterScaleLocked: boolean;
    lightingContinuityRequired: boolean;
    continuityKeys: string[];
  };
}

export interface ProductionAsset {
  assetId: string;

  type:
    | 'character-reference'
    | 'environment-reference'
    | 'prop-reference'
    | 'shot-image'
    | 'video-clip'
    | 'voice'
    | 'music'
    | 'sound-effect';

  name: string;
  description: string;

  required: boolean;
  reusable: boolean;

  relatedCharacterIds: string[];
  relatedSceneNumbers: number[];
  relatedFrameNumbers: number[];

  status:
    | 'planned'
    | 'generated'
    | 'approved'
    | 'rejected';
}

export interface StoryboardPackage {
  storyboardId: string;

  worldId: string;
  episodeId: string;
  scriptId: string;

  episodeNumber: number;
  title: string;

  audienceTier: StoryboardAudienceTier;

  visualStyle: string;
  primaryLanguageCode: string;

  scenes: StoryboardScene[];
  assets: ProductionAsset[];

  consistency: {
    characterIdentityScore: number;
    environmentContinuityScore: number;
    wardrobeContinuityScore: number;
    cameraProgressionScore: number;
    psychologicalVisualScore: number;
    totalScore: number;
    warnings: string[];
  };

  productionReadiness: {
    imageGenerationReady: boolean;
    videoGenerationReady: boolean;
    voiceSynchronizationReady: boolean;
    externalProviderConnected: boolean;
    humanApprovalRequired: boolean;
  };

  status:
    | 'draft'
    | 'approved'
    | 'in-production'
    | 'completed';

  createdAt: string;
}

export interface StoryboardGenerationResult {
  success: boolean;
  engine: string;
  version: string;
  status: 'storyboard-generated';

  storyboard: StoryboardPackage;

  nextActions: string[];
}
