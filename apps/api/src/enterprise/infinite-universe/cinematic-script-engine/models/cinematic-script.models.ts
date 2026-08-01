export type ScriptAudienceTier =
  | 'kids'
  | 'junior'
  | 'teen'
  | 'adult'
  | 'family';

export type DialogueDelivery =
  | 'calm'
  | 'curious'
  | 'hesitant'
  | 'confident'
  | 'whisper'
  | 'excited'
  | 'worried'
  | 'playful'
  | 'serious'
  | 'emotional';

export type CameraShot =
  | 'establishing-wide'
  | 'wide'
  | 'medium'
  | 'close-up'
  | 'extreme-close-up'
  | 'over-the-shoulder'
  | 'tracking'
  | 'low-angle'
  | 'high-angle'
  | 'point-of-view'
  | 'insert';

export interface ScriptDialogueLine {
  lineNumber: number;

  characterId: string;
  characterName: string;

  dialogue: string;
  delivery: DialogueDelivery;

  visibleEmotion: string;
  hiddenEmotion: string;

  subtext: string;
  bodyLanguage: string;

  pauseAfterSeconds: number;

  continuityReferences: string[];
}

export interface ScriptActionBeat {
  beatNumber: number;

  action: string;
  purpose: string;

  participatingCharacterIds: string[];

  emotionalMeaning: string;
  visualPriority: number;
}

export interface CameraInstruction {
  order: number;

  shot: CameraShot;
  subject: string;
  movement: string;

  framingPurpose: string;

  durationSeconds: number;
}

export interface LightingInstruction {
  mood: string;
  source: string;
  intensity: number;

  colorTemperature:
    | 'warm'
    | 'neutral'
    | 'cool'
    | 'mixed';

  psychologicalPurpose: string;
}

export interface SoundInstruction {
  ambience: string[];
  soundEffects: string[];

  musicMood: string;
  musicIntensity: number;

  silenceRequired: boolean;
  silencePurpose?: string;
}

export interface CinematicSceneScript {
  sceneNumber: number;
  sourceSceneType: string;

  heading: string;
  location: string;
  timeOfDay: string;

  targetDurationSeconds: number;

  dramaticPurpose: string;
  psychologicalPurpose: string;

  openingVisual: string;

  actionBeats: ScriptActionBeat[];
  dialogue: ScriptDialogueLine[];

  camera: CameraInstruction[];
  lighting: LightingInstruction;
  sound: SoundInstruction;

  sceneArc: {
    openingEmotion: string;
    peakEmotion: string;
    closingEmotion: string;

    curiosityStart: number;
    curiosityEnd: number;

    tensionStart: number;
    tensionEnd: number;
  };

  continuityReferences: string[];
  futureSeeds: string[];

  safetyAssessment: {
    suitable: boolean;
    audienceTier: ScriptAudienceTier;
    findings: string[];
    adjustments: string[];
  };
}

export interface LocalizedScriptVersion {
  languageCode: string;

  adaptationMode:
    | 'translation'
    | 'cultural-adaptation'
    | 'native-reproduction';

  status:
    | 'source-ready'
    | 'localization-planned'
    | 'localized';

  title: string;
  logline: string;

  culturalInstructions: string[];
  voiceInstructions: string[];
}

export interface CinematicEpisodeScript {
  scriptId: string;
  worldId: string;
  episodeId: string;

  episodeNumber: number;

  title: string;
  logline: string;
  synopsis: string;

  audienceTier: ScriptAudienceTier;

  sourceLanguageCode: string;

  selectedCharacterIds: string[];
  selectedCharacterNames: string[];

  scenes: CinematicSceneScript[];

  psychologicalArc: {
    openingState: string;
    centralConflict: string;
    emotionalTurningPoint: string;
    closingState: string;

    primaryAudienceEmotion: string;
    secondaryAudienceEmotion: string;

    ethicalHook: string;
    unresolvedQuestion: string;
  };

  quality: {
    dialogueConsistency: number;
    psychologicalContinuity: number;
    ageSuitability: number;
    sceneProgression: number;
    repetitionRisk: number;
    totalScore: number;

    warnings: string[];
  };

  localizationVersions: LocalizedScriptVersion[];

  productionReadiness: {
    screenplayReady: boolean;
    storyboardReady: boolean;
    voiceGenerationReady: boolean;
    animationPromptReady: boolean;
    localizationReady: boolean;
  };

  status:
    | 'draft'
    | 'approved'
    | 'in-production'
    | 'produced';

  createdAt: string;
}

export interface CinematicScriptGenerationResult {
  success: boolean;

  engine: string;
  version: string;

  status: 'script-generated';

  script: CinematicEpisodeScript;

  nextActions: string[];
}
