export type UniverseMemoryEntityType =
  | 'world'
  | 'character-roster'
  | 'character-event'
  | 'character-decision'
  | 'episode'
  | 'localization'
  | 'relationship'
  | 'timeline'
  | 'episode'
  | 'script'
  | 'storyboard'
  | 'visual-reference-bible'
  | 'image-generation-job'
  | 'canonical-visual-fingerprint'
  | 'visual-consistency-validation'
  | 'provider-migration-test'
  | 'provider-entity-lock';

export interface UniverseMemoryAuditRecord {
  auditId: string;
  worldId: string;

  entityType: UniverseMemoryEntityType;
  entityId?: string;

  operation:
    | 'create'
    | 'update'
    | 'load'
    | 'delete'
    | 'decision'
    | 'event';

  timestamp: string;
  version: number;

  metadata: Record<
    string,
    string | number | boolean | string[]
  >;
}

export interface UniverseMemoryStatus {
  success: boolean;
  engine: string;
  version: string;
  status: 'operational';

  storage: {
    mode: 'persistent-json';
    rootDirectory: string;
    atomicWrites: boolean;
    lazyLoading: boolean;
    auditLogEnabled: boolean;
  };

  capabilities: {
    persistentWorlds: boolean;
    persistentCharacters: boolean;
    persistentMemories: boolean;
    persistentRelationships: boolean;
    persistentPsychology: boolean;
    eventAuditTrail: boolean;
    decisionAuditTrail: boolean;
    restartRecovery: boolean;
  };

  statistics: {
    storedWorlds: number;
    storedCharacterRosters: number;
    auditRecords: number;
  };
}







