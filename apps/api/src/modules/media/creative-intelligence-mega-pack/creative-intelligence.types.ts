export type CreativeMode =
  | 'cinematic'
  | 'documentary'
  | 'animation'
  | 'anime'
  | 'realistic'
  | 'hybrid';

export type CreativeStatus =
  | 'draft'
  | 'planned'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'completed'
  | 'rejected';

export interface CreativeProjectBrief {
  title: string;
  concept: string;
  contentType: string;
  audience: string;
  ageGroup: string;
  platform: string;
  durationSeconds?: number;
  languages?: string[];
  cultures?: string[];
  tone?: string;
  genre?: string;
  budget?: number;
  constraints?: string[];
}

export interface StoryArchitecture {
  premise: string;
  theme: string;
  centralQuestion: string;
  hook: string;
  acts: Array<{
    order: number;
    name: string;
    purpose: string;
    turningPoint: string;
  }>;
  emotionalArc: string[];
  ending: string;
}

export interface ScriptPackage {
  logline: string;
  synopsis: string;
  scenes: Array<{
    id: string;
    order: number;
    heading: string;
    purpose: string;
    dialogue: string[];
    narration: string[];
    durationSeconds: number;
  }>;
  continuityNotes: string[];
  languageVersions: Array<{
    language: string;
    status: string;
  }>;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  objective: string;
  conflict: string;
  personality: string[];
  appearance: string[];
  wardrobe: string[];
  voice: string;
  behaviorRules: string[];
  continuityFingerprint: string;
}

export interface WorldProfile {
  name: string;
  rules: string[];
  locations: Array<{
    name: string;
    purpose: string;
    geography: string;
    architecture: string;
    atmosphere: string;
  }>;
  colorLanguage: string[];
  environmentalContinuity: string[];
}

export interface VisualStyleProfile {
  mode: CreativeMode;
  visualPrinciples: string[];
  palette: Array<{
    name: string;
    hex: string;
    usage: string;
  }>;
  textureLanguage: string[];
  compositionRules: string[];
  forbiddenVisuals: string[];
}

export interface CameraPlan {
  shots: Array<{
    sceneOrder: number;
    shot: string;
    lens: string;
    movement: string;
    framing: string;
    purpose: string;
  }>;
  globalRules: string[];
}

export interface LightingPlan {
  scenes: Array<{
    sceneOrder: number;
    setup: string;
    mood: string;
    direction: string;
    contrast: string;
    colorTemperature: string;
  }>;
  continuityRules: string[];
}

export interface AudioPlan {
  scenes: Array<{
    sceneOrder: number;
    ambience: string[];
    effects: string[];
    dialogueTreatment: string;
    silenceStrategy: string;
  }>;
  masteringRules: string[];
}

export interface MusicPlan {
  themes: Array<{
    name: string;
    purpose: string;
    instrumentation: string[];
    emotionalTarget: string;
  }>;
  sceneCues: Array<{
    sceneOrder: number;
    cue: string;
    intensity: number;
  }>;
  rightsRules: string[];
}

export interface VoicePlan {
  characters: Array<{
    characterId: string;
    castingDirection: string;
    deliveryRules: string[];
    languageVariants: string[];
  }>;
  narrator?: {
    style: string;
    deliveryRules: string[];
  };
}

export interface EditingPlan {
  pacing: string;
  sceneCuts: Array<{
    sceneOrder: number;
    entry: string;
    exit: string;
    transition: string;
    retentionPurpose: string;
  }>;
  platformVariants: Array<{
    platform: string;
    format: string;
    durationStrategy: string;
  }>;
}

export interface ThumbnailPlan {
  concepts: Array<{
    id: string;
    headline: string;
    visualFocus: string;
    emotion: string;
    composition: string;
    contrastStrategy: string;
  }>;
  rules: string[];
  platformVariants: string[];
}

export interface CreativeIntelligenceProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CreativeStatus;
  brief: CreativeProjectBrief;
  story: StoryArchitecture;
  script: ScriptPackage;
  characters: CharacterProfile[];
  world: WorldProfile;
  visualStyle: VisualStyleProfile;
  camera: CameraPlan;
  lighting: LightingPlan;
  audio: AudioPlan;
  music: MusicPlan;
  voice: VoicePlan;
  editing: EditingPlan;
  thumbnail: ThumbnailPlan;
  quality: {
    scores: Record<string, number>;
    failures: string[];
    approved: boolean;
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditTrail: Array<{
      at: string;
      actor: string;
      action: string;
      details?: Record<string, unknown>;
    }>;
  };
}