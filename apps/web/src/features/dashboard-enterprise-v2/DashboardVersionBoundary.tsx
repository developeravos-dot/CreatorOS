import type {
  ReactNode,
} from "react";

import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardEnterpriseV2 from "./DashboardEnterpriseV2";
import DashboardVersionToggle from "./components/DashboardVersionToggle";

import {
  useDashboardVersion,
} from "./hooks/useDashboardVersion";

interface DashboardVersionBoundaryProps {
  dashboard:
    EnterpriseDashboard;

  connected: boolean;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  legacy: ReactNode;

  onRefresh?: () => void;
  onCreateProject?: () => void;
  onCreateScript?: () => void;
  onScheduleContent?: () => void;
  onCreatePrompt?: () => void;
}

export default function DashboardVersionBoundary({
  dashboard,
  connected,
  loading = false,
  refreshing = false,
  error = null,
  legacy,
  onRefresh,
  onCreateProject,
  onCreateScript,
  onScheduleContent,
  onCreatePrompt,
}: DashboardVersionBoundaryProps) {
  const {
    isEnterpriseV2,
    toggleVersion,
  } = useDashboardVersion();

  return (
    <div className="dashboard-enterprise-boundary">
      <div className="dashboard-enterprise-boundary__toggle">
        <DashboardVersionToggle
          enterpriseEnabled={
            isEnterpriseV2
          }
          onToggle={
            toggleVersion
          }
        />
      </div>

      {isEnterpriseV2 ? (
        <DashboardEnterpriseV2
          dashboard={dashboard}
          connected={connected}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={onRefresh}
          onCreateProject={
            onCreateProject
          }
          onCreateScript={
            onCreateScript
          }
          onScheduleContent={
            onScheduleContent
          }
          onCreatePrompt={
            onCreatePrompt
          }
        />
      ) : (
        legacy
      )}
    </div>
  );
}
