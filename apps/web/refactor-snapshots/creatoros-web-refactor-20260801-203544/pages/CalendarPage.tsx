import type {
  EnterpriseCalendarItem,
  EnterpriseProject,
} from "../enterprise-api";

import { EmptyState } from "../components/shared";
import { styles } from "../styles/appStyles";
import { platformLabels } from "../utils/contentLabels";

interface CalendarPageProps {
  items: EnterpriseCalendarItem[];
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
}

export default function CalendarPage(
  props: CalendarPageProps,
) {
  const projectName = (projectId: string) =>
    props.projects.find(
      (project) => project.id === projectId,
    )?.name ?? "مشروع غير معروف";

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <div style={styles.eyebrow}>
            CONTENT CALENDAR
          </div>

          <h2 style={styles.panelTitle}>
            تقويم المحتوى
          </h2>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
          disabled={props.busy}
          onClick={() => void props.onCreate()}
        >
          ＋ جدولة محتوى
        </button>
      </div>

      {props.items.length === 0 ? (
        <EmptyState text="لا توجد عناصر مجدولة حتى الآن." />
      ) : (
        <div style={styles.list}>
          {props.items
            .slice()
            .sort(
              (a, b) =>
                Date.parse(a.scheduledAt) -
                Date.parse(b.scheduledAt),
            )
            .map((item) => (
              <article
                key={item.id}
                style={styles.calendarCard}
              >
                <div style={styles.calendarDate}>
                  <strong>
                    {new Date(
                      item.scheduledAt,
                    ).toLocaleDateString("ar-AE", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </strong>

                  <span>
                    {new Date(
                      item.scheduledAt,
                    ).toLocaleTimeString("ar-AE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={styles.itemTitle}>
                    {item.title}
                  </h3>

                  <p style={styles.itemDescription}>
                    {projectName(item.projectId)} ·{" "}
                    {platformLabels[item.platform]}
                  </p>
                </div>

                <span style={styles.badge}>
                  مجدول
                </span>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}
