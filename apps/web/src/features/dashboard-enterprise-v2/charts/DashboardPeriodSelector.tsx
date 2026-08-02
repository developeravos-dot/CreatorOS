import {
  dashboardPeriodOptions,
  type DashboardPeriod,
} from "../intelligence/dashboard-period";

interface DashboardPeriodSelectorProps {
  value: DashboardPeriod;

  onChange: (
    period: DashboardPeriod,
  ) => void;
}

export default function DashboardPeriodSelector({
  value,
  onChange,
}: DashboardPeriodSelectorProps) {
  return (
    <div
      className="dashboard-enterprise-period-selector"
      role="group"
      aria-label="Dashboard period"
    >
      {dashboardPeriodOptions.map(
        (option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={
              value === option.value
            }
            className={
              value === option.value
                ? "dashboard-enterprise-period-selector__button dashboard-enterprise-period-selector__button--active"
                : "dashboard-enterprise-period-selector__button"
            }
            onClick={() =>
              onChange(
                option.value,
              )
            }
          >
            {option.label}
          </button>
        ),
      )}
    </div>
  );
}
