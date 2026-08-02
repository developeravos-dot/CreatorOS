import {
  useMemo,
  useState,
} from "react";
import { useTranslation } from "../hooks";
import type {
  EnterpriseCalendarItem,
  EnterpriseProject,
} from "../enterprise-api";
import {
  CalendarDetailsPanel,
  CalendarDayView,
  CalendarMonthView,
  CalendarPublishingQueue,
  CalendarSchedulingSuggestions,
  CalendarTimelineView,
  CalendarToolbar,
  CalendarWeekView,
  normalizeCalendarItem,
  type CalendarDisplayItem,
  type CalendarViewMode,
} from "../features/calendar-v2";
import "../features/calendar-v2/calendar-v2.css";

interface CalendarPageProps {
  items: EnterpriseCalendarItem[];
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
}

export default function CalendarPage({
  items,
  projects,
  busy,
  onCreate,
}: CalendarPageProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [viewMode, setViewMode] =
    useState<CalendarViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItem, setSelectedItem] =
    useState<CalendarDisplayItem | null>(null);
  const [localDates, setLocalDates] =
    useState<Record<string, Date>>({});

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) => {
        const normalized = normalizeCalendarItem(
          item,
          projects,
          index,
        );

        return {
          ...normalized,
          date: localDates[normalized.id] ?? normalized.date,
        };
      }),
    [items, localDates, projects],
  );

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          normalizedItems
            .map((item) => item.status)
            .filter(Boolean),
        ),
      ),
    [normalizedItems],
  );


  const platforms = useMemo(
    () =>
      Array.from(
        new Set(
          normalizedItems
            .map((item) => item.platform)
            .filter(Boolean),
        ),
      ),
    [normalizedItems],
  );
  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return normalizedItems.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.projectName.toLowerCase().includes(normalizedSearch) ||
        item.platform.toLowerCase().includes(normalizedSearch) ||
        item.status.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        status === "all" || item.status === status;

      const matchesProject =
        projectId === "all" || item.projectId === projectId;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [
    normalizedItems,
    projectId,
    platform,
    search,
    status,
  ]);

  const datedItems = normalizedItems.filter((item) => item.date);
  const undatedItems = normalizedItems.length - datedItems.length;

  function movePeriod(direction: number) {
    setCurrentDate((previous) => {
      const next = new Date(previous);

      if (viewMode === "month") {
        next.setMonth(previous.getMonth() + direction);
      } else {
        next.setDate(previous.getDate() + direction * 7);
      }

      return next;
    });
  }

  function moveItemLocally(itemId: string, date: Date) {
    setLocalDates((previous) => ({
      ...previous,
      [itemId]: new Date(date),
    }));
  }

  const periodTitle =
    viewMode === "month"
      ? new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
        }).format(currentDate)
      : `Week of ${new Intl.DateTimeFormat("en", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(currentDate)}`;

  return (
    <div className="calendar-v2">
      <header className="calendar-v2-header">
        <div>
          <span>{t("calendar.workspace")}</span>
          <h2>{t("calendar.title")}</h2>
          <p>
            Plan, inspect and organize scheduled CreatorOS content across
            projects and platforms.
          </p>
        </div>

        <div className="calendar-v2-header__stats">
          <div>
            <strong>{items.length}</strong>
            <span>{t("calendar.totalItems")}</span>
          </div>

          <div>
            <strong>{datedItems.length}</strong>
            <span>{t("calendar.scheduled")}</span>
          </div>

          <div>
            <strong>{undatedItems}</strong>
            <span>{t("calendar.withoutDate")}</span>
          </div>
        </div>
      </header>

      <CalendarToolbar
        search={search}
        status={status}
        projectId={projectId}
        platform={platform}
        viewMode={viewMode}
        statuses={statuses}
        platforms={platforms}
        projects={projects.map((project) => ({
          id: String(project.id),
          name: project.name,
        }))}
        busy={busy}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onProjectChange={setProjectId}
        onPlatformChange={setPlatform}
        onViewChange={setViewMode}
        onCreate={() => void onCreate()}
      />

      <section className="calendar-v2-period">
        <button
          type="button"
          onClick={() => movePeriod(-1)}
        >
          ‹
        </button>

        <div>
          <span>{t("calendar.currentPeriod")}</span>
          <h3>{periodTitle}</h3>
        </div>

        <button
          type="button"
          onClick={() => movePeriod(1)}
        >
          ›
        </button>

        <button
          type="button"
          className="calendar-v2-period__today"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </section>

      <section className="calendar-v2-workspace">
        {viewMode === "month" ? (
          <CalendarMonthView
            currentDate={currentDate}
            items={filteredItems}
            onSelect={setSelectedItem}
            onLocalMove={moveItemLocally}
          />
        ) : null}

        {viewMode === "week" ? (
          <CalendarWeekView
            currentDate={currentDate}
            items={filteredItems}
            onSelect={setSelectedItem}
            onLocalMove={moveItemLocally}
          />
        ) : null}


        {viewMode === "day" ? (
          <CalendarDayView
            currentDate={currentDate}
            items={filteredItems}
            onSelect={setSelectedItem}
            onLocalMove={moveItemLocally}
          />
        ) : null}
        {viewMode === "timeline" ? (
          <CalendarTimelineView
            items={filteredItems}
            onSelect={setSelectedItem}
          />
        ) : null}
      </section>


      <section className="calendar-v2-enterprise-grid">
        <CalendarPublishingQueue
          items={filteredItems}
          onSelect={setSelectedItem}
        />

        <CalendarSchedulingSuggestions
          items={filteredItems}
        />
      </section>
      <CalendarDetailsPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}



