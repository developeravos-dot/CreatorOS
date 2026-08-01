export type VisualReferenceStatus =
  | 'draft'
  | 'approved'
  | 'rejected';

export interface CanonicalColor {
  name: string;
  hex: string;
  usage: string;
  locked: boolean;
}

export interface CharacterExpressionReference {
  expressionId: string;
  name: string;

  visibleEmotion: string;
  intensity: number;

  facialDescription: string;
  eyeDescription: string;
  eyebrowDescription: string;
  mouthDescription: string;

  suitableSceneTypes: string[];

  imagePrompt: string;
  negativePrompt: string;
}

export interface CharacterPoseReference {
  poseId: string;
  name: string;

  bodyPosition: string;
  handPosition: string;
  headDirection: string;
  eyeDirection: string;

  psychologicalMeaning: string;
  suitableSceneTypes: string[];

  imagePrompt: string;
  negativePrompt: string;
}

export interface CharacterReferenceSheet {
  referenceId: string;
  characterId: string;
  characterName: string;

  role: string;
  audienceTier: string;

  canonicalIdentity: {
    age: number;
    apparentAge: number;
    species: string;
    genderIdentity: string;

    visualDescription: string;

    faceShape: string;
    skinDescription: string;
    hairDescription: string;
    eyeDescription: string;
    bodyProportions: string;

    heightUnits: number;

    wardrobeDescription: string;
    footwearDescription: string;

    signatureElements: string[];
  };

  colorPalette: CanonicalColor[];

  turnaroundViews: Array<{
    view:
      | 'front'
      | 'three-quarter'
      | 'side'
      | 'back';

    description: string;
    imagePrompt: string;
  }>;

  expressions: CharacterExpressionReference[];
  poses: CharacterPoseReference[];

  voiceVisualAlignment: {
    speechStyle: string;
    visualRhythm: string;
    movementStyle: string;
  };

  canonicalPrompt: string;
  identityLockPrompt: string;
  negativeIdentityPrompt: string;

  continuityKeys: string[];

  status: VisualReferenceStatus;
}

export interface EnvironmentReferenceSheet {
  referenceId: string;
  locationName: string;
  locationType: string;

  canonicalDescription: string;
  emotionalTone: string;

  architecturalLanguage: string;
  materials: string[];
  recurringObjects: string[];

  colorPalette: CanonicalColor[];

  timeOfDayVariants: Array<{
    timeOfDay: string;
    lightingDescription: string;
    atmosphereDescription: string;
    imagePrompt: string;
  }>;

  cameraLandmarks: string[];
  prohibitedChanges: string[];

  canonicalPrompt: string;
  negativePrompt: string;

  continuityKeys: string[];

  status: VisualReferenceStatus;
}

export interface PropReferenceSheet {
  referenceId: string;
  propName: string;

  ownerCharacterId?: string;
  ownerCharacterName?: string;

  description: string;
  material: string;
  scaleDescription: string;

  colors: CanonicalColor[];

  functionalBehavior: string[];
  storyImportance: string;

  canonicalPrompt: string;
  negativePrompt: string;

  continuityKeys: string[];

  status: VisualReferenceStatus;
}

export interface WorldColorBible {
  primaryColors: CanonicalColor[];
  secondaryColors: CanonicalColor[];
  accentColors: CanonicalColor[];

  prohibitedColors: CanonicalColor[];

  emotionalRules: Array<{
    emotion: string;
    colorUsage: string;
  }>;

  locationRules: Array<{
    locationName: string;
    paletteDescription: string;
  }>;
}

export interface WorldScaleBible {
  referenceHeightUnits: number;

  characterScales: Array<{
    characterId: string;
    characterName: string;
    heightUnits: number;
    relativeScale: number;
  }>;

  environmentScales: Array<{
    locationName: string;
    scaleDescription: string;
  }>;

  propScales: Array<{
    propName: string;
    scaleDescription: string;
  }>;

  rules: string[];
}

export interface VisualReferenceBible {
  bibleId: string;
  worldId: string;
  storyboardId: string;

  version: string;
  visualStyle: string;

  characterReferences: CharacterReferenceSheet[];
  environmentReferences: EnvironmentReferenceSheet[];
  propReferences: PropReferenceSheet[];

  colorBible: WorldColorBible;
  scaleBible: WorldScaleBible;

  globalIdentityRules: string[];
  globalNegativePrompt: string;

  quality: {
    characterCoverage: number;
    environmentCoverage: number;
    propCoverage: number;
    colorConsistency: number;
    scaleConsistency: number;
    promptReadiness: number;
    totalScore: number;
    warnings: string[];
  };

  productionReadiness: {
    characterReferenceGenerationReady: boolean;
    environmentReferenceGenerationReady: boolean;
    propReferenceGenerationReady: boolean;

    imageProviderConnected: boolean;
    humanApprovalRequired: boolean;
  };

  status: VisualReferenceStatus;
  createdAt: string;
}

export interface VisualReferenceBibleResult {
  success: boolean;
  engine: string;
  version: string;
  status: 'visual-reference-bible-generated';

  bible: VisualReferenceBible;

  nextActions: string[];
}
