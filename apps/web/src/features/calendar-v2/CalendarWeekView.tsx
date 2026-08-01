import CalendarContentCard from "./CalendarContentCard";
import {
  getDateKey,
  type CalendarDisplayItem,
} from "./calendar-utils";

interface CalendarWeekViewProps {
  currentDate: Date;
  items: CalendarDisplayItem[];
  onSelect: (item: CalendarDisplayItem) => void;
  onLocalMove: (itemId: string, date: Date) => void;
}

export default function CalendarWeekView({
  currentDate,
  items,
  onSelect,
  onLocalMove,
}: CalendarWeekViewProps) {
  const start = new Date(currentDate);
  start.setDate(currentDate.getDate() - currentDate.getDay());

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  return (
    <div className="calendar-v2-week">
      {days.map((date) => {
        const key = getDateKey(date);

        const dayItems = items.filter(
          (item) =>
            item.date &&
            getDateKey(item.date) === key,
        );

        return (
          <section
            className="calendar-v2-week__day"
            key={key}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();

              const itemId =
                event.dataTransfer.getData("text/plain");

              if (itemId) {
                onLocalMove(itemId, date);
              }
            }}
          >
            <header>
              <span>
                {new Intl.DateTimeFormat("en", {
                  weekday: "short",
                }).format(date)}
              </span>

              <strong>{date.getDate()}</strong>

              <small>{dayItems.length} items</small>
            </header>

            <div className="calendar-v2-week__items">
              {dayItems.map((item) => (
                <CalendarContentCard
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
