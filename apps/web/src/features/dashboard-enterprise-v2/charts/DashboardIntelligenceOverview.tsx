import DashboardChartPanel from "./DashboardChartPanel";
import DashboardChartsEmptyState from "./DashboardChartsEmptyState";
import DashboardChartsLoadingState from "./DashboardChartsLoadingState";
import DashboardKpiInsightGrid from "./DashboardKpiInsightGrid";
import DashboardPeriodSelector from "./DashboardPeriodSelector";

import DashboardSection from "../components/DashboardSection";

import type {
  DashboardChartSnapshot,
} from "../intelligence/dashboard-chart-types";

import type {
  DashboardPeriod,
} from "../intelligence/dashboard-period";

interface DashboardIntelligenceOverviewProps {
  snapshot:
    DashboardChartSnapshot;

  period:
    DashboardPeriod;

  loading?: boolean;

  onPeriodChange: (
    period: DashboardPeriod,
  ) => void;
}

export default function DashboardIntelligenceOverview({
  snapshot,
  period,
  loading = false,
  onPeriodChange,
}: DashboardIntelligenceOverviewProps) {
  const hasData =
    snapshot.series.some(
      (series) =>
        series.points.some(
          (point) =>
            point.value > 0,
        ),
    );

  if (loading) {
    return (
      <DashboardChartsLoadingState />
    );
  }

  if (!hasData) {
    return (
      <DashboardChartsEmptyState />
    );
  }

  return (
    <div className="dashboard-enterprise-intelligence-overview">
      <DashboardSection
        title="KPI intelligence"
        description={
          "Trend-aware KPI analysis across production, publishing, automation and active operations."
        }
        actions={
          <DashboardPeriodSelector
            value={period}
            onChange={
              onPeriodChange
            }
          />
        }
      >
        <DashboardKpiInsightGrid
          insights={
            snapshot.insights
          }
        />
      </DashboardSection>

      <DashboardSection
        title="Performance trends"
        description={
          "Interactive historical trends generated from current CreatorOS operational metrics."
        }
      >
        <DashboardChartPanel
          series={
            snapshot.series
          }
        />
      </DashboardSection>
    </div>
  );
}
