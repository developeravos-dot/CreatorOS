import CalendarContentCard from "./CalendarContentCard";
import {
  getDateKey,
  type CalendarDisplayItem,
} from "./calendar-utils";

interface CalendarMonthViewProps {
  currentDate: Date;
  items: CalendarDisplayItem[];
  onSelect: (item: CalendarDisplayItem) => void;
  onLocalMove: (itemId: string, date: Date) => void;
}

export default function CalendarMonthView({
  currentDate,
  items,
  onSelect,
  onLocalMove,
}: CalendarMonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();

  const gridStart = new Date(year, month, 1 - startOffset);

  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });

  return (
    <div className="calendar-v2-month">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
        (day) => (
          <div className="calendar-v2-month__weekday" key={day}>
            {day}
          </div>
        ),
      )}

      {days.map((date) => {
        const key = getDateKey(date);

        const dayItems = items.filter(
          (item) =>
            item.date &&
            getDateKey(item.date) === key,
        );

        const outsideMonth = date.getMonth() !== month;

        return (
          <section
            className={[
              "calendar-v2-month__day",
              outsideMonth
                ? "calendar-v2-month__day--outside"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
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
              <span>{date.getDate()}</span>

              {dayItems.length > 0 ? (
                <small>{dayItems.length}</small>
              ) : null}
            </header>

            <div className="calendar-v2-month__items">
              {dayItems.slice(0, 3).map((item) => (
                <CalendarContentCard
                  key={item.id}
                  item={item}
                  compact
                  onSelect={onSelect}
                />
              ))}

              {dayItems.length > 3 ? (
                <div className="calendar-v2-month__more">
                  +{dayItems.length - 3} more
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
