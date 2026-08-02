import { useMemo } from "react";
import { useTranslation } from "../../hooks";
import type { CalendarDisplayItem } from "./calendar-utils";

interface CalendarPublishingQueueProps {
  items: CalendarDisplayItem[];
  onSelect: (item: CalendarDisplayItem) => void;
}

export default function CalendarPublishingQueue({
  items,
  onSelect,
}: CalendarPublishingQueueProps) {
  const { t } = useTranslation();

  const queueItems = useMemo(
    () =>
      [...items]
        .filter((item) => item.date)
        .sort(
          (left, right) =>
            (left.date?.getTime() ?? 0) -
            (right.date?.getTime() ?? 0),
        )
        .slice(0, 8),
    [items],
  );

  return (
    <article className="calendar-v2-enterprise-panel">
      <header className="calendar-v2-enterprise-panel__header">
        <div>
          <span>{t("calendar.publishingQueue")}</span>
          <h3>{t("calendar.upcomingContent")}</h3>
        </div>

        <strong>{queueItems.length}</strong>
      </header>

      {queueItems.length === 0 ? (
        <div className="calendar-v2-enterprise-empty">
          <strong>{t("calendar.queueEmpty")}</strong>
          <span>{t("calendar.queueEmptyDescription")}</span>
        </div>
      ) : (
        <div className="calendar-v2-queue">
          {queueItems.map((item, index) => (
            <button
              type="button"
              className="calendar-v2-queue__item"
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <span className="calendar-v2-queue__position">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="calendar-v2-queue__content">
                <strong>{item.title}</strong>

                <small>
                  {item.projectName} · {item.platform}
                </small>
              </span>

              <span className="calendar-v2-queue__date">
                {item.date
                  ? new Intl.DateTimeFormat(undefined, {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(item.date)
                  : t("calendar.noDate")}
              </span>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
