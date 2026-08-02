import type {
  DashboardDensity,
} from "./dashboard-personalization-types";

interface DashboardDensitySelectorProps {
  value: DashboardDensity;

  onChange: (
    value: DashboardDensity,
  ) => void;
}

export default function DashboardDensitySelector({
  value,
  onChange,
}: DashboardDensitySelectorProps) {
  return (
    <div className="dashboard-personalization-control">
      <div>
        <strong>
          Density
        </strong>

        <span>
          Adjust dashboard spacing.
        </span>
      </div>

      <div
        className="dashboard-personalization-segmented"
        role="group"
        aria-label="Dashboard density"
      >
        <button
          type="button"
          aria-pressed={
            value === "comfortable"
          }
          onClick={() =>
            onChange(
              "comfortable",
            )
          }
        >
          Comfortable
        </button>

        <button
          type="button"
          aria-pressed={
            value === "compact"
          }
          onClick={() =>
            onChange(
              "compact",
            )
          }
        >
          Compact
        </button>
      </div>
    </div>
  );
}
