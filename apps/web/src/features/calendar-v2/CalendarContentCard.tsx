import type { CalendarDisplayItem } from "./calendar-utils";
import { formatCalendarDate } from "./calendar-utils";

interface CalendarContentCardProps {
  item: CalendarDisplayItem;
  compact?: boolean;
  onSelect: (item: CalendarDisplayItem) => void;
}

export default function CalendarContentCard({
  item,
  compact = false,
  onSelect,
}: CalendarContentCardProps) {
  return (
    <button
      type="button"
      draggable
      className={[
        "calendar-v2-card",
        compact ? "calendar-v2-card--compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          "text/plain",
          item.id,
        );
      }}
      onClick={() => onSelect(item)}
    >
      <span className="calendar-v2-card__platform">
        {item.platform}
      </span>

      <strong>{item.title}</strong>

      {!compact ? (
        <small>{item.projectName}</small>
      ) : null}

      <footer>
        <span>{item.status}</span>
        <time>{formatCalendarDate(item.date)}</time>
      </footer>
    </button>
  );
}
