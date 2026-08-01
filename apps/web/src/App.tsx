import {
  useMemo,
  useState,
} from "react";
import {
  enterpriseApi,
  type EnterpriseDashboard,
  type EnterpriseProject,
  type EnterpriseScript,
} from "./enterprise-api";
import { styles } from "./styles/appStyles";
import {
  useCreatorDashboard,
  useCreatorOperations,
} from "./hooks";
import { CreatorDialogs } from "./dialogs";
import CreatorWorkspace from "./components/CreatorWorkspace";
import {
  CreatorHeader,
  CreatorSidebar,
  MainLayout,
  type CreatorView,
} from "./layouts";
type View = CreatorView;

function App() {
  const [view, setView] = useState<View>("dashboard");
  const {
    dashboard,
    connected,
    loading,
    busy,
    message,
    error,
    setError,
    setMessage,
    loadDashboard,
    runAction,
  } = useCreatorDashboard();
  const operations = useCreatorOperations({
    dashboard,
    setError,
    runAction,
  });

  const {
    createProject,
    createScript,
    scheduleContent,
    createPrompt,
    changeProjectStatus,
    deleteProject,
    changeScriptStatus,
    editScript,
  } = operations;
const currentTitle = useMemo(() => {
    const titles: Record<View, string> = {
      dashboard: "مركز قيادة المحتوى",
      projects: "إدارة المشاريع",
      scripts: "محرر السكربتات",
      calendar: "تقويم المحتوى",
      prompts: "مكتبة القوالب الذكية",
      "ai-content": "استوديو المحتوى الذكي",
    };

    return titles[view];
  }, [view]);

  return (
    <MainLayout
      sidebar={
        <CreatorSidebar
          view={view}
          connected={connected}
          onViewChange={setView}
        />
      }
      header={
        <CreatorHeader
          title={currentTitle}
          loading={loading}
          busy={busy}
          onRefresh={loadDashboard}
        />
      }
    >

        {message && (
          <div style={styles.successMessage}>{message}</div>
        )}

        {error && (
          <div style={styles.errorMessage}>{error}</div>
        )}

      {loading ? (
        <div style={styles.loading}>
          جارٍ تحميل CreatorOS Enterprise...
        </div>
      ) : (
        <CreatorWorkspace
          view={view}
          dashboard={dashboard}
          connected={connected}
          busy={busy}
          onCreateProject={createProject}
          onCreateScript={createScript}
          onScheduleContent={scheduleContent}
          onCreatePrompt={createPrompt}
          onProjectStatus={changeProjectStatus}
          onDeleteProject={deleteProject}
          onEditScript={editScript}
          onScriptStatus={changeScriptStatus}
        />
      )}

      <CreatorDialogs
        dashboard={dashboard}
        busy={busy}
        error={error}
        operations={operations}
      />
</MainLayout>
  );
}

export default App;
