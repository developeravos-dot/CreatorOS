export const FACTORY_INTELLIGENCE_SCHEMA =
  "creatoros.factory.deep-intelligence";

export const FACTORY_INTELLIGENCE_VERSION =
  "1.0.0";

export const DEFAULT_PROJECT_LAYER_ORDER = [
  "presentation",
  "application",
  "domain",
  "infrastructure",
  "shared",
] as const;

export const DEFAULT_MODULE_CATEGORIES = [
  "application",
  "feature",
  "domain",
  "service",
  "shared",
  "library",
  "configuration",
  "test",
  "unknown",
] as const;

export const DEFAULT_DEPENDENCY_KINDS = [
  "import",
  "dynamic-import",
  "re-export",
  "external-package",
] as const;

export const HEALTH_SCORE = {
  excellent: 90,
  good: 75,
  fair: 60,
  poor: 40,
} as const;

export const TECHNICAL_DEBT_WEIGHTS = {
  critical: 100,
  high: 50,
  medium: 20,
  low: 5,
} as const;

export const HOTSPOT_LIMITS = {
  imports: 25,
  dependents: 40,
  fanIn: 20,
  fanOut: 20,
} as const;

export const REFACTORING_PRIORITIES = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
} as const;

export const DEFAULT_LAYER_RULES = [
  {
    source: "presentation",
    allowed: [
      "application",
      "shared",
    ],
  },
  {
    source: "application",
    allowed: [
      "domain",
      "shared",
    ],
  },
  {
    source: "domain",
    allowed: [
      "shared",
    ],
  },
  {
    source: "infrastructure",
    allowed: [
      "domain",
      "shared",
    ],
  },
] as const;

export const DEFAULT_REPORT_NAMES = {
  dependency:
    "Dependency Report",
  architecture:
    "Architecture Report",
  health:
    "Health Report",
  hotspot:
    "Hotspot Report",
  debt:
    "Technical Debt Report",
  refactoring:
    "Refactoring Report",
} as const;

export const DEFAULT_FACTORY_METADATA = {
  engine:
    "Deep Project Intelligence",
  package:
    "F1B",
  creator:
    "CreatorOS Factory",
  stable: false,
} as const;
