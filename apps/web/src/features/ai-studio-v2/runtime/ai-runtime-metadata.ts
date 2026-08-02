import type { AIRuntimeProvider } from "./ai-runtime-types";

export type AIRuntimeMetadataCategory =
  | "agents"
  | "organization"
  | "workflow"
  | "memory"
  | "models"
  | "tools"
  | "execution"
  | "approval"
  | "queue"
  | "logging"
  | "platform";

export interface AIRuntimeProviderMetadata {
  displayName: string;
  displayNameKey?: string;
  descriptionKey: string;
  category: AIRuntimeMetadataCategory;
  categoryKey: string;
  icon: string;
  tags: string[];
  technicalName: string;
  technicalModule: string;
  moduleDisplayName: string;
}

interface MetadataRule {
  pattern: RegExp;
  displayName: string;
  displayNameKey?: string;
  descriptionKey: string;
  category: AIRuntimeMetadataCategory;
  icon: string;
  tags: string[];
}

const metadataRules: MetadataRule[] = [
  {
    pattern: /AiOrganization.*Brain/i,
    displayName: "AI Organization Brain",
    displayNameKey: "aiStudio.metadata.names.organizationBrain",
    descriptionKey:
      "aiStudio.metadata.descriptions.organizationBrain",
    category: "organization",
    icon: "🧠",
    tags: ["organization", "decision", "coordination"],
  },
  {
    pattern: /OrganizationOs/i,
    displayName: "AI Organization OS",
    displayNameKey: "aiStudio.metadata.names.organizationOs",
    descriptionKey:
      "aiStudio.metadata.descriptions.organizationOs",
    category: "organization",
    icon: "◉",
    tags: ["organization", "orchestration"],
  },
  {
    pattern: /AgentCoordination/i,
    displayName: "Agent Coordination",
    displayNameKey: "aiStudio.metadata.names.agentCoordination",
    descriptionKey:
      "aiStudio.metadata.descriptions.agentCoordination",
    category: "agents",
    icon: "◎",
    tags: ["agents", "coordination"],
  },
  {
    pattern: /AgentRegistry/i,
    displayName: "Agent Registry",
    displayNameKey: "aiStudio.metadata.names.agentRegistry",
    descriptionKey:
      "aiStudio.metadata.descriptions.agentRegistry",
    category: "agents",
    icon: "◌",
    tags: ["agents", "registry"],
  },
  {
    pattern: /AgentApplication/i,
    displayName: "Agent Application Service",
    displayNameKey: "aiStudio.metadata.names.agentApplication",
    descriptionKey:
      "aiStudio.metadata.descriptions.agentApplication",
    category: "agents",
    icon: "🤖",
    tags: ["agents", "application"],
  },
  {
    pattern: /AgentRepository/i,
    displayName: "Agent Repository",
    displayNameKey: "aiStudio.metadata.names.agentRepository",
    descriptionKey:
      "aiStudio.metadata.descriptions.agentRepository",
    category: "agents",
    icon: "▤",
    tags: ["agents", "storage"],
  },
  {
    pattern: /DecisionEngine/i,
    displayName: "Decision Intelligence Engine",
    displayNameKey: "aiStudio.metadata.names.decisionEngine",
    descriptionKey:
      "aiStudio.metadata.descriptions.decisionEngine",
    category: "organization",
    icon: "◆",
    tags: ["decision", "intelligence"],
  },
  {
    pattern: /Workflow|Pipeline|Orchestrat/i,
    displayName: "Workflow Orchestration",
    displayNameKey: "aiStudio.metadata.names.workflow",
    descriptionKey:
      "aiStudio.metadata.descriptions.workflow",
    category: "workflow",
    icon: "⌘",
    tags: ["workflow", "pipeline"],
  },
  {
    pattern: /Memory|Knowledge|Context/i,
    displayName: "Shared Intelligence Memory",
    displayNameKey: "aiStudio.metadata.names.memory",
    descriptionKey:
      "aiStudio.metadata.descriptions.memory",
    category: "memory",
    icon: "◈",
    tags: ["memory", "knowledge"],
  },
  {
    pattern: /Model|Router|Provider/i,
    displayName: "AI Model Runtime",
    displayNameKey: "aiStudio.metadata.names.models",
    descriptionKey:
      "aiStudio.metadata.descriptions.models",
    category: "models",
    icon: "◇",
    tags: ["models", "routing"],
  },
  {
    pattern: /Approval|Authority|Governance/i,
    displayName: "Human Approval Gate",
    displayNameKey: "aiStudio.metadata.names.approval",
    descriptionKey:
      "aiStudio.metadata.descriptions.approval",
    category: "approval",
    icon: "✓",
    tags: ["approval", "governance"],
  },
  {
    pattern: /Execution|Runtime|Runner/i,
    displayName: "Execution Runtime",
    displayNameKey: "aiStudio.metadata.names.execution",
    descriptionKey:
      "aiStudio.metadata.descriptions.execution",
    category: "execution",
    icon: "▶",
    tags: ["execution", "runtime"],
  },
  {
    pattern: /Queue|Job|Scheduler/i,
    displayName: "Runtime Queue",
    displayNameKey: "aiStudio.metadata.names.queue",
    descriptionKey:
      "aiStudio.metadata.descriptions.queue",
    category: "queue",
    icon: "≡",
    tags: ["queue", "scheduling"],
  },
  {
    pattern: /Log|Audit|Observability|Monitor/i,
    displayName: "Runtime Observability",
    displayNameKey: "aiStudio.metadata.names.logging",
    descriptionKey:
      "aiStudio.metadata.descriptions.logging",
    category: "logging",
    icon: "▥",
    tags: ["logging", "monitoring"],
  },
  {
    pattern: /Tool|Integration|Connector/i,
    displayName: "Runtime Tool",
    displayNameKey: "aiStudio.metadata.names.tools",
    descriptionKey:
      "aiStudio.metadata.descriptions.tools",
    category: "tools",
    icon: "✦",
    tags: ["tools", "integration"],
  },
];

const categoryKeys: Record<
  AIRuntimeMetadataCategory,
  string
> = {
  agents: "aiStudio.metadata.categories.agents",
  organization:
    "aiStudio.metadata.categories.organization",
  workflow: "aiStudio.metadata.categories.workflow",
  memory: "aiStudio.metadata.categories.memory",
  models: "aiStudio.metadata.categories.models",
  tools: "aiStudio.metadata.categories.tools",
  execution: "aiStudio.metadata.categories.execution",
  approval: "aiStudio.metadata.categories.approval",
  queue: "aiStudio.metadata.categories.queue",
  logging: "aiStudio.metadata.categories.logging",
  platform: "aiStudio.metadata.categories.platform",
};

function splitPascalCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeTechnicalSuffixes(value: string): string {
  return value
    .replace(
      /(ApplicationService|Repository|Service|Engine|Module)$/i,
      "",
    )
    .trim();
}

export function formatRuntimeModuleName(
  moduleName: string,
): string {
  const cleaned = splitPascalCase(moduleName)
    .replace(/\bModule\b$/i, "")
    .trim();

  return cleaned || moduleName;
}

function getFallbackCategory(
  provider: AIRuntimeProvider,
): AIRuntimeMetadataCategory {
  switch (provider.capability) {
    case "agent":
      return "agents";
    case "workflow":
    case "task":
      return "workflow";
    case "memory":
      return "memory";
    case "model":
      return "models";
    case "tool":
      return "tools";
    case "execution":
      return "execution";
    case "approval":
      return "approval";
    case "queue":
      return "queue";
    case "logging":
      return "logging";
    default:
      return "platform";
  }
}

function getFallbackIcon(
  category: AIRuntimeMetadataCategory,
): string {
  const icons: Record<
    AIRuntimeMetadataCategory,
    string
  > = {
    agents: "◎",
    organization: "🧠",
    workflow: "⌘",
    memory: "◈",
    models: "◇",
    tools: "✦",
    execution: "▶",
    approval: "✓",
    queue: "≡",
    logging: "▥",
    platform: "◆",
  };

  return icons[category];
}

export function getRuntimeProviderMetadata(
  provider: AIRuntimeProvider,
): AIRuntimeProviderMetadata {
  const technicalName = provider.name;
  const searchableValue =
    `${provider.name} ${provider.module}`;

  const matchedRule = metadataRules.find((rule) =>
    rule.pattern.test(searchableValue),
  );

  if (matchedRule) {
    return {
      displayName: matchedRule.displayName,
      displayNameKey: matchedRule.displayNameKey,
      descriptionKey: matchedRule.descriptionKey,
      category: matchedRule.category,
      categoryKey: categoryKeys[matchedRule.category],
      icon: matchedRule.icon,
      tags: matchedRule.tags,
      technicalName,
      technicalModule: provider.module,
      moduleDisplayName: formatRuntimeModuleName(
        provider.module,
      ),
    };
  }

  const category = getFallbackCategory(provider);

  const readableName =
    removeTechnicalSuffixes(
      splitPascalCase(provider.name),
    ) || splitPascalCase(provider.name);

  return {
    displayName: readableName,
    descriptionKey:
      "aiStudio.metadata.descriptions.generic",
    category,
    categoryKey: categoryKeys[category],
    icon: getFallbackIcon(category),
    tags: [provider.capability, category],
    technicalName,
    technicalModule: provider.module,
    moduleDisplayName: formatRuntimeModuleName(
      provider.module,
    ),
  };
}


