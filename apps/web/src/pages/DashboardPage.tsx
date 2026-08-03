import type { EnterpriseDashboard } from "../enterprise-api";

import {
  ActionButton,
  CompactItem,
  EmptyState,
  MetricCard,
  SystemRow,
} from "../components/shared";

import { styles } from "../styles/appStyles";

import {
  platformLabels,
  scriptStatusLabels,
  statusLabels,
} from "../utils/contentLabels";

interface DashboardPageProps {
  dashboard: EnterpriseDashboard;
  connected: boolean;
  busy: boolean;
  onCreateProject: () => Promise<void>;
  onCreateScript: () => Promise<void>;
  onSchedule: () => Promise<void>;
  onCreatePrompt: () => Promise<void>;
}

export default function DashboardPage(
  props: DashboardPageProps,
) {
  const {
    dashboard,
    connected,
    busy,
    onCreateProject,
    onCreateScript,
    onSchedule,
    onCreatePrompt,
  } = props;

  return (
    <>
      <section style={styles.metricsGrid}>
        <MetricCard
          icon="▦"
          label="المشاريع"
          value={dashboard.metrics.projects}
          note={`${dashboard.metrics.activeProjects} مشروع نشط`}
        />

        <MetricCard
          icon="✎"
          label="السكربتات"
          value={dashboard.metrics.scripts}
          note="محتوى محفوظ في الخادم"
        />

        <MetricCard
          icon="▣"
          label="المحتوى المجدول"
          value={dashboard.metrics.scheduledContent}
          note="عناصر تقويم الإنتاج"
        />

        <MetricCard
          icon="✦"
          label="القوالب الذكية"
          value={dashboard.metrics.prompts}
          note="قوالب الذكاء الاصطناعي"
        />
      </section>

      <section style={styles.twoColumns}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.eyebrow}>
                QUICK ACTIONS
              </div>

              <h2 style={styles.panelTitle}>
                مركز العمليات
              </h2>
            </div>
          </div>

          <div style={styles.actionsGrid}>
            <ActionButton
              icon="＋"
              title="إنشاء مشروع"
              description="إضافة مشروع محتوى جديد"
              disabled={busy}
              onClick={() => void onCreateProject()}
            />

            <ActionButton
              icon="✎"
              title="إنشاء سكربت"
              description="إضافة سكربت إلى أحد المشاريع"
              disabled={busy}
              onClick={() => void onCreateScript()}
            />

            <ActionButton
              icon="▣"
              title="جدولة محتوى"
              description="تحديد موعد نشر جديد"
              disabled={busy}
              onClick={() => void onSchedule()}
            />

            <ActionButton
              icon="✦"
              title="إضافة قالب ذكي"
              description="حفظ أمر للذكاء الاصطناعي"
              disabled={busy}
              onClick={() => void onCreatePrompt()}
            />
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.eyebrow}>
            LIVE SYSTEM
          </div>

          <h2 style={styles.panelTitle}>
            حالة النظام
          </h2>

          <SystemRow
            label="Backend API"
            value={connected ? "متصل" : "غير متصل"}
          />

          <SystemRow
            label="محرك المشاريع"
            value={dashboard.system.projectEngine}
          />

          <SystemRow
            label="محرك السكربت"
            value={dashboard.system.scriptEngine}
          />

          <SystemRow
            label="محرك التقويم"
            value={dashboard.system.calendarEngine}
          />

          <SystemRow
            label="التخزين"
            value={dashboard.system.storage}
          />
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <div style={styles.eyebrow}>
              PRODUCTION WORKSPACE
            </div>

            <h2 style={styles.panelTitle}>
              أحدث المشاريع والسكربتات
            </h2>
          </div>
        </div>

        <div style={styles.workspaceGrid}>
          <div>
            <h3 style={styles.sectionTitle}>
              المشاريع
            </h3>

            {dashboard.projects.length === 0 ? (
              <EmptyState text="لا توجد مشاريع حتى الآن." />
            ) : (
              dashboard.projects
                .slice(0, 4)
                .map((project) => (
                  <CompactItem
                    key={project.id}
                    title={project.name}
                    subtitle={`${
                      platformLabels[project.platform]
                    } · ${
                      statusLabels[project.status]
                    }`}
                  />
                ))
            )}
          </div>

          <div>
            <h3 style={styles.sectionTitle}>
              السكربتات
            </h3>

            {dashboard.scripts.length === 0 ? (
              <EmptyState text="لا توجد سكربتات حتى الآن." />
            ) : (
              dashboard.scripts
                .slice(0, 4)
                .map((script) => (
                  <CompactItem
                    key={script.id}
                    title={script.title}
                    subtitle={
                      scriptStatusLabels[script.status]
                    }
                  />
                ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
