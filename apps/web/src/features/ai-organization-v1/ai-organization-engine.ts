import {
  getRuntimeProviderMetadata,
  type AIRuntimeProvider,
} from "../ai-studio-v2/runtime";
import type {
  AIOrganizationAgent,
  AIOrganizationProjectType,
  AIOrganizationTeam,
  AIOrganizationTimelineEvent,
} from "./ai-organization-types";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function mapRuntimeAgents(
  providers: AIRuntimeProvider[],
): AIOrganizationAgent[] {
  return providers.map((provider) => {
    const metadata =
      getRuntimeProviderMetadata(provider);

    return {
      id: provider.id,
      runtimeProviderId: provider.id,
      technicalName: provider.name,
      displayName: metadata.displayName,
      module: metadata.moduleDisplayName,
      capability: provider.capability,
      available: provider.available,
      icon: metadata.icon,
      tags: metadata.tags,
    };
  });
}

function scoreAgent(
  agent: AIOrganizationAgent,
  keywords: string[],
): number {
  const searchable = [
    agent.displayName,
    agent.technicalName,
    agent.module,
    ...agent.tags,
  ]
    .join(" ")
    .toLowerCase();

  return keywords.reduce(
    (score, keyword) =>
      searchable.includes(keyword.toLowerCase())
        ? score + 1
        : score,
    0,
  );
}

const projectBlueprints: Record<
  AIOrganizationProjectType,
  {
    name: string;
    objective: string;
    roles: Array<{
      role: string;
      keywords: string[];
    }>;
  }
> = {
  youtube: {
    name: "فريق إنتاج YouTube",
    objective:
      "إدارة دورة إنتاج فيديو YouTube من الفكرة حتى النشر والتحليل.",
    roles: [
      {
        role: "قائد الإنتاج",
        keywords: [
          "organization",
          "coordination",
          "decision",
          "orchestration",
        ],
      },
      {
        role: "باحث المحتوى",
        keywords: [
          "research",
          "knowledge",
          "intelligence",
          "memory",
        ],
      },
      {
        role: "كاتب السيناريو",
        keywords: [
          "script",
          "content",
          "generation",
          "writer",
        ],
      },
      {
        role: "مراجع الجودة",
        keywords: [
          "quality",
          "review",
          "validation",
          "approval",
        ],
      },
      {
        role: "مسؤول النشر",
        keywords: [
          "publish",
          "schedule",
          "queue",
          "workflow",
        ],
      },
    ],
  },

  tiktok: {
    name: "فريق إنتاج TikTok",
    objective:
      "ابتكار وإنتاج ونشر مقاطع TikTok قصيرة سريعة وعالية الجاذبية.",
    roles: [
      {
        role: "قائد الفريق",
        keywords: [
          "organization",
          "coordination",
          "decision",
        ],
      },
      {
        role: "محلل الاتجاهات",
        keywords: [
          "trend",
          "intelligence",
          "research",
        ],
      },
      {
        role: "كاتب المحتوى القصير",
        keywords: [
          "content",
          "script",
          "generation",
        ],
      },
      {
        role: "مراقب الجودة",
        keywords: [
          "quality",
          "approval",
          "review",
        ],
      },
    ],
  },

  instagram: {
    name: "فريق إنتاج Instagram",
    objective:
      "إدارة محتوى Instagram المرئي والقصصي وجدولة النشر.",
    roles: [
      {
        role: "قائد المحتوى",
        keywords: [
          "organization",
          "coordination",
          "content",
        ],
      },
      {
        role: "مخطط الحملات",
        keywords: [
          "campaign",
          "workflow",
          "planning",
        ],
      },
      {
        role: "محرر المحتوى",
        keywords: [
          "content",
          "generation",
          "creative",
        ],
      },
      {
        role: "مسؤول الجدولة",
        keywords: [
          "queue",
          "schedule",
          "publish",
        ],
      },
    ],
  },

  campaign: {
    name: "فريق الحملة التسويقية",
    objective:
      "تخطيط وتنفيذ ومراقبة حملة محتوى متعددة المنصات.",
    roles: [
      {
        role: "قائد الحملة",
        keywords: [
          "organization",
          "decision",
          "coordination",
        ],
      },
      {
        role: "محلل الجمهور",
        keywords: [
          "intelligence",
          "analytics",
          "research",
        ],
      },
      {
        role: "منشئ المحتوى",
        keywords: [
          "generation",
          "content",
          "creative",
        ],
      },
      {
        role: "مدير سير العمل",
        keywords: [
          "workflow",
          "pipeline",
          "orchestration",
        ],
      },
      {
        role: "بوابة الاعتماد",
        keywords: [
          "approval",
          "governance",
          "authority",
        ],
      },
    ],
  },

  research: {
    name: "فريق البحث والذكاء",
    objective:
      "جمع وتحليل وربط المعرفة وتحويلها إلى قرارات قابلة للتنفيذ.",
    roles: [
      {
        role: "قائد البحث",
        keywords: [
          "organization",
          "decision",
          "intelligence",
        ],
      },
      {
        role: "باحث متخصص",
        keywords: [
          "research",
          "knowledge",
          "analysis",
        ],
      },
      {
        role: "مدير الذاكرة",
        keywords: [
          "memory",
          "knowledge",
          "context",
        ],
      },
      {
        role: "مراجع النتائج",
        keywords: [
          "validation",
          "approval",
          "quality",
        ],
      },
    ],
  },

  general: {
    name: "فريق CreatorOS الذكي",
    objective:
      "فريق متعدد التخصصات لتنفيذ مهام CreatorOS العامة.",
    roles: [
      {
        role: "قائد الفريق",
        keywords: [
          "organization",
          "coordination",
          "decision",
        ],
      },
      {
        role: "وكيل متخصص",
        keywords: ["agent", "service"],
      },
      {
        role: "مدير سير العمل",
        keywords: [
          "workflow",
          "pipeline",
          "orchestration",
        ],
      },
      {
        role: "مراقب الجودة",
        keywords: [
          "approval",
          "quality",
          "review",
        ],
      },
    ],
  },
};

export function createAutomaticTeam(
  agents: AIOrganizationAgent[],
  projectType: AIOrganizationProjectType,
): AIOrganizationTeam {
  const blueprint = projectBlueprints[projectType];
  const availableAgents = agents.filter(
    (agent) => agent.available,
  );

  const usedAgentIds = new Set<string>();

  const members = blueprint.roles
    .map((roleDefinition, index) => {
      const rankedAgents = availableAgents
        .filter(
          (agent) => !usedAgentIds.has(agent.id),
        )
        .map((agent) => ({
          agent,
          score: scoreAgent(
            agent,
            roleDefinition.keywords,
          ),
        }))
        .sort((left, right) => {
          if (right.score !== left.score) {
            return right.score - left.score;
          }

          return left.agent.displayName.localeCompare(
            right.agent.displayName,
          );
        });

      const selectedAgent =
        rankedAgents[0]?.agent ??
        availableAgents.find(
          (agent) => !usedAgentIds.has(agent.id),
        );

      if (!selectedAgent) {
        return null;
      }

      usedAgentIds.add(selectedAgent.id);

      return {
        agentId: selectedAgent.id,
        role: roleDefinition.role,
        isLeader: index === 0,
        workload: 0,
      };
    })
    .filter(
      (
        member,
      ): member is NonNullable<typeof member> =>
        member !== null,
    );

  const now = new Date().toISOString();

  const initialTimeline: AIOrganizationTimelineEvent[] = [
    {
      id: createId("event"),
      type: "team-created",
      title: "تم إنشاء فريق ذكي",
      description:
        "تم تكوين الفريق تلقائيًا اعتمادًا على قدرات مزودي Runtime الحقيقيين.",
      createdAt: now,
    },
    ...members.map((member) => {
      const agent = agents.find(
        (item) => item.id === member.agentId,
      );

      return {
        id: createId("event"),
        type: "member-added" as const,
        title: member.isLeader
          ? "تم تعيين قائد الفريق"
          : "تم تعيين وكيل متخصص",
        description: `${agent?.displayName ?? member.agentId} — ${member.role}`,
        createdAt: now,
      };
    }),
  ];

  return {
    id: createId("team"),
    name: blueprint.name,
    projectType,
    objective: blueprint.objective,
    members,
    tasks: [],
    messages: [],
    memory: [],
    approvals: [
      {
        id: createId("approval"),
        title: "اعتماد خطة الفريق",
        description:
          "اعتماد التكوين والأدوار قبل بدء التنفيذ الفعلي.",
        requestedByAgentId:
          members.find((member) => member.isLeader)
            ?.agentId ?? null,
        status: "pending",
        createdAt: now,
        decidedAt: null,
      },
    ],
    timeline: initialTimeline,
    createdAt: now,
    updatedAt: now,
  };
}

export function calculateTeamHealth(
  team: AIOrganizationTeam,
  agents: AIOrganizationAgent[],
): number {
  if (team.members.length === 0) {
    return 0;
  }

  const availableMembers =
    team.members.filter((member) =>
      agents.find(
        (agent) =>
          agent.id === member.agentId &&
          agent.available,
      ),
    ).length;

  const availabilityScore =
    (availableMembers / team.members.length) * 60;

  const blockedTasks = team.tasks.filter(
    (task) => task.status === "blocked",
  ).length;

  const taskScore =
    team.tasks.length === 0
      ? 30
      : Math.max(
          0,
          30 -
            (blockedTasks / team.tasks.length) * 30,
        );

  const pendingApprovals = team.approvals.filter(
    (approval) => approval.status === "pending",
  ).length;

  const approvalScore =
    pendingApprovals > 3 ? 2 : 10;

  return Math.round(
    availabilityScore +
      taskScore +
      approvalScore,
  );
}

export function getAverageWorkload(
  team: AIOrganizationTeam,
): number {
  if (team.members.length === 0) {
    return 0;
  }

  return Math.round(
    team.members.reduce(
      (total, member) =>
        total + member.workload,
      0,
    ) / team.members.length,
  );
}
