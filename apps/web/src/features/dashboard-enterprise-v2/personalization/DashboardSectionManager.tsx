import type {
  DashboardSectionId,
  DashboardSectionPreference,
} from "./dashboard-personalization-types";

interface DashboardSectionManagerProps {
  sections:
    DashboardSectionPreference[];

  onToggle: (
    sectionId:
      DashboardSectionId,
  ) => void;

  onMove: (
    sectionId:
      DashboardSectionId,
    direction:
      "up" |
      "down",
  ) => void;
}

const sectionLabels:
  Record<
    DashboardSectionId,
    string
  > = {
  foundation:
    "Foundation overview",

  intelligence:
    "KPI intelligence",

  "command-center":
    "Operational command center",
};

export default function DashboardSectionManager({
  sections,
  onToggle,
  onMove,
}: DashboardSectionManagerProps) {
  const ordered =
    [...sections].sort(
      (
        left,
        right,
      ) =>
        left.order -
        right.order,
    );

  return (
    <div className="dashboard-personalization-section-list">
      {ordered.map(
        (
          section,
          index,
        ) => (
          <article
            key={section.id}
          >
            <label>
              <input
                type="checkbox"
                checked={
                  section.visible
                }
                onChange={() =>
                  onToggle(
                    section.id,
                  )
                }
              />

              <span>
                {
                  sectionLabels[
                    section.id
                  ]
                }
              </span>
            </label>

            <div>
              <button
                type="button"
                aria-label={`Move ${
                  sectionLabels[
                    section.id
                  ]
                } up`}
                disabled={
                  index === 0
                }
                onClick={() =>
                  onMove(
                    section.id,
                    "up",
                  )
                }
              >
                ↑
              </button>

              <button
                type="button"
                aria-label={`Move ${
                  sectionLabels[
                    section.id
                  ]
                } down`}
                disabled={
                  index ===
                  ordered.length - 1
                }
                onClick={() =>
                  onMove(
                    section.id,
                    "down",
                  )
                }
              >
                ↓
              </button>
            </div>
          </article>
        ),
      )}
    </div>
  );
}
