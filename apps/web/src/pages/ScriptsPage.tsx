import type {
  EnterpriseProject,
  EnterpriseScript,
} from "../enterprise-api";

import { EmptyState } from "../components/shared";
import { styles } from "../styles/appStyles";
import { scriptStatusLabels } from "../utils/contentLabels";

interface ScriptsPageProps {
  scripts: EnterpriseScript[];
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
  onEdit: (script: EnterpriseScript) => Promise<void>;
  onStatus: (script: EnterpriseScript) => Promise<void>;
}

export default function ScriptsPage(
  props: ScriptsPageProps,
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
            SCRIPT WORKSPACE
          </div>

          <h2 style={styles.panelTitle}>
            محرر السكربتات
          </h2>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
          disabled={props.busy}
          onClick={() => void props.onCreate()}
        >
          ＋ إنشاء سكربت
        </button>
      </div>

      {props.scripts.length === 0 ? (
        <EmptyState text="لا توجد سكربتات. أنشئ أول سكربت." />
      ) : (
        <div style={styles.list}>
          {props.scripts.map((script) => (
            <article
              key={script.id}
              style={styles.scriptCard}
            >
              <div style={styles.cardTop}>
                <span style={styles.badge}>
                  {scriptStatusLabels[script.status]}
                </span>

                <span style={styles.platform}>
                  {projectName(script.projectId)}
                </span>
              </div>

              <h3 style={styles.itemTitle}>
                {script.title}
              </h3>

              <p style={styles.scriptPreview}>
                {script.content || "السكربت فارغ."}
              </p>

              <div style={styles.cardFooter}>
                <button
                  type="button"
                  style={styles.primarySmallButton}
                  disabled={props.busy}
                  onClick={() =>
                    void props.onEdit(script)
                  }
                >
                  تعديل السكربت
                </button>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  disabled={props.busy}
                  onClick={() =>
                    void props.onStatus(script)
                  }
                >
                  تغيير المرحلة
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
