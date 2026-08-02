import type {
  EnterpriseDashboard,
  EnterpriseProject,
  EnterpriseScript,
} from "../../enterprise-api";

import type {
  EnterpriseRevenueIntelligence,
  RevenueOpportunity,
  RevenueOpportunityType,
} from "./enterprise-intelligence-types";

function clamp(
  value: number,
  minimum = 0,
  maximum = 100,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function isActiveProject(
  project: EnterpriseProject,
): boolean {
  const status =
    normalize(project.status);

  return (
    status.includes("active") ||
    status.includes("production") ||
    status.includes("running") ||
    status.includes("approved")
  );
}

function isAdvancedScript(
  script: EnterpriseScript,
): boolean {
  const status =
    normalize(script.status);

  return (
    status.includes("approved") ||
    status.includes("completed") ||
    status.includes("published") ||
    status.includes("ready") ||
    status.includes("production")
  );
}

function opportunityPriority(
  score: number,
): RevenueOpportunity["priority"] {
  if (score >= 75) {
    return "high";
  }

  if (score >= 45) {
    return "medium";
  }

  return "low";
}

function estimateOpportunityValue(
  type: RevenueOpportunityType,
  score: number,
  assets: number,
): number {
  const baseValues:
    Record<
      RevenueOpportunityType,
      number
    > = {
      sponsorship: 2_500,
      "content-production": 1_500,
      "content-licensing": 3_000,
      affiliate: 800,
      "digital-product": 2_000,
      localization: 1_200,
    };

  const multiplier =
    0.4 +
    score / 100 +
    Math.min(
      assets,
      20,
    ) * 0.03;

  return Math.round(
    baseValues[type] *
      multiplier,
  );
}

function createOpportunity(
  input: {
    id: string;
    type: RevenueOpportunityType;
    title: string;
    description: string;
    score: number;
    readiness: number;
    confidence: number;
    assets: number;
    rationale: string[];
  },
): RevenueOpportunity {
  const score =
    clamp(
      Math.round(input.score),
    );

  const readiness =
    clamp(
      Math.round(
        input.readiness,
      ),
    );

  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description:
      input.description,
    score,
    readiness,
    estimatedValue:
      estimateOpportunityValue(
        input.type,
        score,
        input.assets,
      ),
    confidence:
      clamp(
        Math.round(
          input.confidence,
        ),
      ),
    priority:
      opportunityPriority(
        score,
      ),
    rationale:
      input.rationale,
  };
}

export function buildRevenueIntelligence(
  dashboard: EnterpriseDashboard,
): EnterpriseRevenueIntelligence {
  const projects =
    dashboard.projects;

  const scripts =
    dashboard.scripts;

  const calendar =
    dashboard.calendar;

  const prompts =
    dashboard.prompts;

  const activeProjects =
    projects.filter(
      isActiveProject,
    );

  const advancedScripts =
    scripts.filter(
      isAdvancedScript,
    );

  const platforms =
    new Set(
      projects
        .map(
          (project) =>
            project.platform,
        )
        .filter(Boolean),
    );

  const scheduledRatio =
    scripts.length > 0
      ? calendar.length /
        scripts.length
      : 0;

  const productionDensity =
    projects.length > 0
      ? scripts.length /
        projects.length
      : 0;

  const reusableAssetCount =
    scripts.length +
    prompts.length +
    calendar.length;

  const readinessScore =
    clamp(
      Math.round(
        Math.min(
          projects.length,
          10,
        ) *
          4 +
          Math.min(
            scripts.length,
            20,
          ) *
            2 +
          Math.min(
            prompts.length,
            10,
          ) *
            2 +
          Math.min(
            calendar.length,
            10,
          ) *
            2,
      ),
    );

  const sponsorshipReadiness =
    clamp(
      Math.round(
        activeProjects.length *
          12 +
          advancedScripts.length *
            4 +
          calendar.length * 3 +
          platforms.size * 8,
      ),
    );

  const contentAssetLeverage =
    clamp(
      Math.round(
        reusableAssetCount *
          3 +
          productionDensity *
            12 +
          platforms.size * 6,
      ),
    );

  const monetizationScore =
    clamp(
      Math.round(
        readinessScore * 0.35 +
          sponsorshipReadiness *
            0.35 +
          contentAssetLeverage *
            0.3,
      ),
    );

  const opportunities:
    RevenueOpportunity[] = [
    createOpportunity({
      id: "sponsorship-readiness",
      type: "sponsorship",
      title:
        "Direct sponsorship packages",
      description:
        "Package active projects and scheduled content into sponsor-ready campaigns.",
      score:
        sponsorshipReadiness,
      readiness:
        sponsorshipReadiness,
      confidence:
        projects.length > 0
          ? 72
          : 30,
      assets:
        reusableAssetCount,
      rationale: [
        `${activeProjects.length} active projects`,
        `${advancedScripts.length} advanced scripts`,
        `${calendar.length} scheduled content items`,
        `${platforms.size} represented platforms`,
      ],
    }),

    createOpportunity({
      id: "business-content-production",
      type: "content-production",
      title:
        "AI content production services",
      description:
        "Use the existing production workflow to deliver content packages for external businesses.",
      score:
        clamp(
          scripts.length * 6 +
            prompts.length * 8 +
            activeProjects.length *
              10,
        ),
      readiness:
        clamp(
          readinessScore + 5,
        ),
      confidence:
        scripts.length > 0
          ? 76
          : 38,
      assets:
        scripts.length +
        prompts.length,
      rationale: [
        `${scripts.length} reusable script assets`,
        `${prompts.length} reusable AI prompt templates`,
        `${activeProjects.length} active production workspaces`,
      ],
    }),

    createOpportunity({
      id: "content-licensing",
      type: "content-licensing",
      title:
        "Content and format licensing",
      description:
        "License reusable scripts, formats and production concepts to other creators or media companies.",
      score:
        clamp(
          advancedScripts.length *
            10 +
            prompts.length * 6 +
            platforms.size * 6,
        ),
      readiness:
        clamp(
          contentAssetLeverage,
        ),
      confidence:
        advancedScripts.length > 0
          ? 68
          : 32,
      assets:
        advancedScripts.length +
        prompts.length,
      rationale: [
        `${advancedScripts.length} advanced scripts`,
        `${prompts.length} prompt assets`,
        `${platforms.size} platform contexts`,
      ],
    }),

    createOpportunity({
      id: "affiliate-commerce",
      type: "affiliate",
      title:
        "Affiliate content integration",
      description:
        "Attach relevant affiliate offers to scheduled and platform-specific content.",
      score:
        clamp(
          calendar.length * 8 +
            platforms.size * 12 +
            activeProjects.length *
              4,
        ),
      readiness:
        clamp(
          scheduledRatio * 70 +
            platforms.size * 10,
        ),
      confidence:
        calendar.length > 0
          ? 64
          : 28,
      assets:
        calendar.length,
      rationale: [
        `${calendar.length} scheduled publishing opportunities`,
        `${platforms.size} platform channels`,
        `${Math.round(
          scheduledRatio * 100,
        )}% script scheduling coverage`,
      ],
    }),

    createOpportunity({
      id: "digital-products",
      type: "digital-product",
      title:
        "Digital products and knowledge assets",
      description:
        "Convert successful scripts, prompts and production systems into templates, guides or courses.",
      score:
        clamp(
          prompts.length * 10 +
            scripts.length * 4 +
            projects.length * 3,
        ),
      readiness:
        clamp(
          contentAssetLeverage +
            prompts.length * 4,
        ),
      confidence:
        prompts.length > 0
          ? 70
          : 35,
      assets:
        prompts.length +
        scripts.length,
      rationale: [
        `${prompts.length} structured prompt templates`,
        `${scripts.length} script assets`,
        `${projects.length} project contexts`,
      ],
    }),

    createOpportunity({
      id: "multilingual-localization",
      type: "localization",
      title:
        "Multilingual localization services",
      description:
        "Repurpose existing scripts and content packages for additional languages and markets.",
      score:
        clamp(
          scripts.length * 5 +
            platforms.size * 8 +
            calendar.length * 3,
        ),
      readiness:
        clamp(
          readinessScore * 0.75 +
            contentAssetLeverage *
              0.25,
        ),
      confidence:
        scripts.length > 0
          ? 66
          : 30,
      assets:
        scripts.length +
        calendar.length,
      rationale: [
        `${scripts.length} scripts available for localization`,
        `${calendar.length} calendar assets`,
        `${platforms.size} platforms available for distribution`,
      ],
    }),
  ].sort(
    (left, right) =>
      right.score -
      left.score,
  );

  const estimatedPipelineValue =
    opportunities.reduce(
      (
        total,
        opportunity,
      ) =>
        total +
        opportunity.estimatedValue,
      0,
    );

  const estimatedMonthlyPotential =
    Math.round(
      estimatedPipelineValue *
        (
          0.08 +
          monetizationScore /
            1_000
        ),
    );

  return {
    readinessScore,
    monetizationScore,
    sponsorshipReadiness,
    contentAssetLeverage,
    estimatedPipelineValue,
    estimatedMonthlyPotential,
    opportunities,
  };
}
