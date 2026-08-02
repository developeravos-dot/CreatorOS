import { useMemo } from "react";
import { useTranslation } from "../../hooks";
import type { CalendarDisplayItem } from "./calendar-utils";

interface CalendarSchedulingSuggestionsProps {
  items: CalendarDisplayItem[];
}

interface SchedulingSuggestion {
  id: string;
  icon: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export default function CalendarSchedulingSuggestions({
  items,
}: CalendarSchedulingSuggestionsProps) {
  const { t } = useTranslation();

  const suggestions = useMemo<SchedulingSuggestion[]>(() => {
    const datedItems = items.filter((item) => item.date);
    const undatedItems = items.filter((item) => !item.date);

    const platformCounts = items.reduce<Record<string, number>>(
      (result, item) => {
        const platform = item.platform || "unspecified";
        result[platform] = (result[platform] ?? 0) + 1;
        return result;
      },
      {},
    );

    const dominantPlatform = Object.entries(platformCounts).sort(
      (left, right) => right[1] - left[1],
    )[0]?.[0];

    const results: SchedulingSuggestion[] = [];

    if (undatedItems.length > 0) {
      results.push({
        id: "unscheduled",
        icon: "◇",
        title: t("calendar.scheduleMissingDates"),
        description: `${undatedItems.length} ${t(
          "calendar.itemsNeedDates",
        )}`,
        priority: "high",
      });
    }

    if (datedItems.length > 0) {
      results.push({
        id: "cadence",
        icon: "⌁",
        title: t("calendar.optimizeCadence"),
        description: t("calendar.optimizeCadenceDescription"),
        priority: "medium",
      });
    }

    if (dominantPlatform) {
      results.push({
        id: "platform",
        icon: "◉",
        title: t("calendar.balancePlatforms"),
        description: `${t(
          "calendar.dominantPlatform",
        )}: ${dominantPlatform}`,
        priority: "medium",
      });
    }

    results.push({
      id: "best-time",
      icon: "✦",
      title: t("calendar.bestPublishingTime"),
      description: t("calendar.bestPublishingTimeDescription"),
      priority: "low",
    });

    return results.slice(0, 4);
  }, [items, t]);

  return (
    <article className="calendar-v2-enterprise-panel">
      <header className="calendar-v2-enterprise-panel__header">
        <div>
          <span>{t("calendar.aiSuggestions")}</span>
          <h3>{t("calendar.schedulingIntelligence")}</h3>
        </div>

        <span className="calendar-v2-ai-badge">AI</span>
      </header>

      <div className="calendar-v2-suggestions">
        {suggestions.map((suggestion) => (
          <div
            className={[
              "calendar-v2-suggestion",
              `calendar-v2-suggestion--${suggestion.priority}`,
            ].join(" ")}
            key={suggestion.id}
          >
            <span className="calendar-v2-suggestion__icon">
              {suggestion.icon}
            </span>

            <div>
              <strong>{suggestion.title}</strong>
              <small>{suggestion.description}</small>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
