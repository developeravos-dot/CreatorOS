import type { DragEvent } from "react";
import type { CalendarDisplayItem } from "./calendar-utils";
import { getDateKey } from "./calendar-utils";

interface CalendarDayViewProps {
  currentDate: Date;
  items: CalendarDisplayItem[];
  onSelect: (item: CalendarDisplayItem) => void;
  onLocalMove: (itemId: string, date: Date) => void;
}

const dayHours = Array.from(
  { length: 24 },
  (_, index) => index,
);

function formatHour(hour: number): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
  }).format(new Date(2026, 0, 1, hour));
}

export default function CalendarDayView({
  currentDate,
  items,
  onSelect,
  onLocalMove,
}: CalendarDayViewProps) {
  const currentDateKey = getDateKey(currentDate);

  const dayItems = items.filter(
    (item) =>
      item.date &&
      getDateKey(item.date) === currentDateKey,
  );

  function handleDragStart(
    event: DragEvent<HTMLElement>,
    itemId: string,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/calendar-item-id",
      itemId,
    );
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    hour: number,
  ) {
    event.preventDefault();

    const itemId = event.dataTransfer.getData(
      "text/calendar-item-id",
    );

    if (!itemId) {
      return;
    }

    const nextDate = new Date(currentDate);
    nextDate.setHours(hour, 0, 0, 0);

    onLocalMove(itemId, nextDate);
  }

  return (
    <div className="calendar-v2-day">
      <header className="calendar-v2-day__header">
        <div>
          <span>
            {new Intl.DateTimeFormat("en", {
              weekday: "long",
            }).format(currentDate)}
          </span>

          <strong>
            {new Intl.DateTimeFormat("en", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(currentDate)}
          </strong>
        </div>

        <small>{dayItems.length} scheduled items</small>
      </header>

      <div className="calendar-v2-day__timeline">
        {dayHours.map((hour) => {
          const hourItems = dayItems.filter(
            (item) => item.date?.getHours() === hour,
          );

          return (
            <div
              className="calendar-v2-day__hour"
              key={hour}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => handleDrop(event, hour)}
            >
              <time>{formatHour(hour)}</time>

              <div className="calendar-v2-day__slot">
                {hourItems.map((item) => (
                  <article
                    className="calendar-v2-day__item"
                    draggable
                    key={item.id}
                    onDragStart={(event) =>
                      handleDragStart(event, item.id)
                    }
                    onClick={() => onSelect(item)}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.projectName}</span>
                    </div>

                    <footer>
                      <span>{item.platform}</span>
                      <small>{item.status}</small>
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
