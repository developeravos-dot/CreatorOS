import {
  formatCalendarDate,
  type CalendarDisplayItem,
} from "./calendar-utils";

interface CalendarDetailsPanelProps {
  item: CalendarDisplayItem | null;
  onClose: () => void;
}

export default function CalendarDetailsPanel({
  item,
  onClose,
}: CalendarDetailsPanelProps) {
  if (!item) {
    return null;
  }

  return (
    <div
      className="calendar-v2-details-overlay"
      onMouseDown={onClose}
    >
      <aside
        className="calendar-v2-details"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>CONTENT DETAILS</span>
            <h2>{item.title}</h2>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="calendar-v2-details__status">
          {item.status}
        </div>

        <dl>
          <div>
            <dt>Project</dt>
            <dd>{item.projectName}</dd>
          </div>

          <div>
            <dt>Platform</dt>
            <dd>{item.platform}</dd>
          </div>

          <div>
            <dt>Scheduled date</dt>
            <dd>{formatCalendarDate(item.date)}</dd>
          </div>

          <div>
            <dt>Calendar ID</dt>
            <dd>{item.id}</dd>
          </div>

          {Object.entries(
            item.source as unknown as Record<string, unknown>,
          )
            .filter(
              ([key]) =>
                ![
                  "id",
                  "title",
                  "status",
                  "platform",
                  "projectId",
                ].includes(key),
            )
            .slice(0, 8)
            .map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value ?? "—")}
                </dd>
              </div>
            ))}
        </dl>

        <p>
          Dragging items changes their date visually in this workspace.
          Backend persistence will be added when the calendar update API is
          available.
        </p>
      </aside>
    </div>
  );
}
