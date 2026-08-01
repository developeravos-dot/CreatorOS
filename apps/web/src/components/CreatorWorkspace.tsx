import type {
  EnterpriseDashboard,
  EnterpriseProject,
  EnterpriseScript,
} from "../enterprise-api";

import type { CreatorView } from "../layouts";

import AIContentStudioPage from "../pages/AIContentStudioPage";
import CalendarPage from "../pages/CalendarPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import PromptsPage from "../pages/PromptsPage";
import ScriptsPage from "../pages/ScriptsPage";

interface CreatorWorkspaceProps {
  view: CreatorView;
  dashboard: EnterpriseDashboard;
  connected: boolean;
  busy: boolean;

  onCreateProject: () => Promise<void>;
  onCreateScript: () => Promise<void>;
  onScheduleContent: () => Promise<void>;
  onCreatePrompt: () => Promise<void>;

  onProjectStatus: (
    project: EnterpriseProject,
  ) => Promise<void>;

  onDeleteProject: (
    project: EnterpriseProject,
  ) => Promise<void>;

  onEditScript: (
    script: EnterpriseScript,
  ) => Promise<void>;

  onScriptStatus: (
    script: EnterpriseScript,
  ) => Promise<void>;
}

export default function CreatorWorkspace(
  props: CreatorWorkspaceProps,
) {
  switch (props.view) {
    case "dashboard":
      return (
        <DashboardPage
          dashboard={props.dashboard}
          connected={props.connected}
          busy={props.busy}
          onCreateProject={props.onCreateProject}
          onCreateScript={props.onCreateScript}
          onSchedule={props.onScheduleContent}
          onCreatePrompt={props.onCreatePrompt}
        />
      );

    case "projects":
      return (
        <ProjectsPage
          projects={props.dashboard.projects}
          busy={props.busy}
          onCreate={props.onCreateProject}
          onStatus={props.onProjectStatus}
          onDelete={props.onDeleteProject}
        />
      );

    case "scripts":
      return (
        <ScriptsPage
          scripts={props.dashboard.scripts}
          projects={props.dashboard.projects}
          busy={props.busy}
          onCreate={props.onCreateScript}
          onEdit={props.onEditScript}
          onStatus={props.onScriptStatus}
        />
      );

    case "calendar":
      return (
        <CalendarPage
          items={props.dashboard.calendar}
          projects={props.dashboard.projects}
          busy={props.busy}
          onCreate={props.onScheduleContent}
        />
      );

    case "prompts":
      return (
        <PromptsPage
          prompts={props.dashboard.prompts}
          busy={props.busy}
          onCreate={props.onCreatePrompt}
        />
      );

    case "ai-content":
      return <AIContentStudioPage />;

    default:
      return null;
  }
}
