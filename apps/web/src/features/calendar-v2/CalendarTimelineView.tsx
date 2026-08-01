import CalendarContentCard from "./CalendarContentCard";
import type { CalendarDisplayItem } from "./calendar-utils";

interface CalendarTimelineViewProps {
  items: CalendarDisplayItem[];
  onSelect: (item: CalendarDisplayItem) => void;
}

export default function CalendarTimelineView({
  items,
  onSelect,
}: CalendarTimelineViewProps) {
  const sortedItems = [...items].sort((left, right) => {
    const leftTime = left.date?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const rightTime = right.date?.getTime() ?? Number.MAX_SAFE_INTEGER;

    return leftTime - rightTime;
  });

  if (sortedItems.length === 0) {
    return (
      <div className="calendar-v2-empty">
        No calendar items match the current filters.
      </div>
    );
  }

  return (
    <div className="calendar-v2-timeline">
      {sortedItems.map((item, index) => (
        <div className="calendar-v2-timeline__row" key={item.id}>
          <div className="calendar-v2-timeline__marker">
            <span>{index + 1}</span>
          </div>

          <CalendarContentCard
            item={item}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
