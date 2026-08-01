import type { EnterpriseProject } from "../enterprise-api";

import { EmptyState } from "../components/shared";
import { styles } from "../styles/appStyles";

import {
  platformLabels,
  statusLabels,
} from "../utils/contentLabels";

interface ProjectsPageProps {
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
  onStatus: (project: EnterpriseProject) => Promise<void>;
  onDelete: (project: EnterpriseProject) => Promise<void>;
}

export default function ProjectsPage(
  props: ProjectsPageProps,
) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <div style={styles.eyebrow}>
            PROJECT MANAGEMENT
          </div>

          <h2 style={styles.panelTitle}>
            مشاريع المحتوى
          </h2>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
          disabled={props.busy}
          onClick={() => void props.onCreate()}
        >
          ＋ إنشاء مشروع
        </button>
      </div>

      {props.projects.length === 0 ? (
        <EmptyState text="لا توجد مشاريع. أنشئ أول مشروع محتوى." />
      ) : (
        <div style={styles.cardsGrid}>
          {props.projects.map((project) => (
            <article
              key={project.id}
              style={styles.itemCard}
            >
              <div style={styles.cardTop}>
                <span style={styles.badge}>
                  {statusLabels[project.status]}
                </span>

                <span style={styles.platform}>
                  {platformLabels[project.platform]}
                </span>
              </div>

              <h3 style={styles.itemTitle}>
                {project.name}
              </h3>

              <p style={styles.itemDescription}>
                {project.description ||
                  "لا يوجد وصف للمشروع."}
              </p>

              <div style={styles.cardFooter}>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  disabled={props.busy}
                  onClick={() =>
                    void props.onStatus(project)
                  }
                >
                  تغيير الحالة
                </button>

                <button
                  type="button"
                  style={styles.dangerButton}
                  disabled={props.busy}
                  onClick={() =>
                    void props.onDelete(project)
                  }
                >
                  حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
