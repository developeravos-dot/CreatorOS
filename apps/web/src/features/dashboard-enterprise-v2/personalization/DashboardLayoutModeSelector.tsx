import type {
  DashboardLayoutMode,
} from "./dashboard-personalization-types";

interface DashboardLayoutModeSelectorProps {
  value:
    DashboardLayoutMode;

  onChange: (
    value:
      DashboardLayoutMode,
  ) => void;
}

const options: Array<{
  id: DashboardLayoutMode;
  label: string;
  description: string;
}> = [
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Equal emphasis across dashboard sections.",
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Prioritize KPI intelligence and charts.",
  },
  {
    id: "operations",
    label: "Operations",
    description:
      "Prioritize alerts, actions and activity.",
  },
];

export default function DashboardLayoutModeSelector({
  value,
  onChange,
}: DashboardLayoutModeSelectorProps) {
  return (
    <div className="dashboard-personalization-layout-options">
      {options.map(
        (option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={
              value === option.id
            }
            onClick={() =>
              onChange(
                option.id,
              )
            }
          >
            <strong>
              {option.label}
            </strong>

            <span>
              {option.description}
            </span>
          </button>
        ),
      )}
    </div>
  );
}
