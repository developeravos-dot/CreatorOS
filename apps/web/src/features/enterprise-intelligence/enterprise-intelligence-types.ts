export type IntelligenceTrend =
  | "up"
  | "down"
  | "stable";

export type IntelligenceSeverity =
  | "info"
  | "success"
  | "warning"
  | "critical";

export interface IntelligenceKpi {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  description: string;
  trend: IntelligenceTrend;
  trendValue: number;
  severity: IntelligenceSeverity;
}

export interface IntelligenceActivity {
  id: string;
  category:
    | "project"
    | "script"
    | "calendar"
    | "prompt"
    | "system";

  title: string;
  description: string;
  timestamp: string;
  severity: IntelligenceSeverity;
}

export interface IntelligenceHealthItem {
  id: string;
  label: string;
  status: string;
  healthy: boolean;
  score: number;
}

export interface IntelligenceForecast {
  id: string;
  label: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  explanation: string;
}

export interface EnterpriseIntelligenceSnapshot {
  generatedAt: string;

  kpis: IntelligenceKpi[];

  activities: IntelligenceActivity[];

  health: {
    score: number;
    status:
      | "healthy"
      | "attention"
      | "critical";

    items: IntelligenceHealthItem[];
  };

  forecasts: IntelligenceForecast[];

  revenue:
    EnterpriseRevenueIntelligence;

  distribution: {
    projects: number;
    activeProjects: number;
    scripts: number;
    scheduledContent: number;
    prompts: number;
  };
}
export type RevenueOpportunityType =
  | "sponsorship"
  | "content-production"
  | "content-licensing"
  | "affiliate"
  | "digital-product"
  | "localization";

export interface RevenueOpportunity {
  id: string;
  type: RevenueOpportunityType;
  title: string;
  description: string;
  score: number;
  readiness: number;
  estimatedValue: number;
  confidence: number;
  priority:
    | "high"
    | "medium"
    | "low";
  rationale: string[];
}

export interface EnterpriseRevenueIntelligence {
  readinessScore: number;
  monetizationScore: number;
  sponsorshipReadiness: number;
  contentAssetLeverage: number;
  estimatedPipelineValue: number;
  estimatedMonthlyPotential: number;
  opportunities: RevenueOpportunity[];
}
