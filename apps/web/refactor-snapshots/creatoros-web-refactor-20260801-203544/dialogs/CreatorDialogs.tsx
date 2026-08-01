import type { EnterpriseDashboard } from "../enterprise-api";
import type { useCreatorOperations } from "../hooks";

import CreateProjectDialog from "./CreateProjectDialog";
import CreatePromptDialog from "./CreatePromptDialog";
import CreateScriptDialog from "./CreateScriptDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import EditScriptDialog from "./EditScriptDialog";
import ScheduleContentDialog from "./ScheduleContentDialog";
import UpdateProjectStatusDialog from "./UpdateProjectStatusDialog";
import UpdateScriptStatusDialog from "./UpdateScriptStatusDialog";

type CreatorOperations = ReturnType<
  typeof useCreatorOperations
>;

interface CreatorDialogsProps {
  dashboard: EnterpriseDashboard;
  busy: boolean;
  error: string;
  operations: CreatorOperations;
}

export default function CreatorDialogs(
  props: CreatorDialogsProps,
) {
  const {
    dashboard,
    busy,
    error,
    operations,
  } = props;

  return (
    <>
      <UpdateProjectStatusDialog
        open={
          operations.selectedProjectForStatus !== null
        }
        busy={busy}
        error={error}
        project={
          operations.selectedProjectForStatus
        }
        onClose={() =>
          operations.setSelectedProjectForStatus(null)
        }
        onSubmit={
          operations.submitProjectStatus
        }
      />

      <DeleteProjectDialog
        open={
          operations.selectedProjectForDelete !== null
        }
        busy={busy}
        error={error}
        project={
          operations.selectedProjectForDelete
        }
        onClose={() =>
          operations.setSelectedProjectForDelete(null)
        }
        onConfirm={
          operations.confirmDeleteProject
        }
      />

      <UpdateScriptStatusDialog
        open={
          operations.selectedScriptForStatus !== null
        }
        busy={busy}
        error={error}
        script={
          operations.selectedScriptForStatus
        }
        onClose={() =>
          operations.setSelectedScriptForStatus(null)
        }
        onSubmit={
          operations.submitScriptStatus
        }
      />

      <EditScriptDialog
        open={
          operations.selectedScriptForEdit !== null
        }
        busy={busy}
        error={error}
        script={
          operations.selectedScriptForEdit
        }
        onClose={() =>
          operations.setSelectedScriptForEdit(null)
        }
        onSubmit={
          operations.submitEditScript
        }
      />

      <CreateProjectDialog
        open={
          operations.createProjectDialogOpen
        }
        busy={busy}
        error={error}
        onClose={() =>
          operations.setCreateProjectDialogOpen(
            false,
          )
        }
        onSubmit={
          operations.submitCreateProject
        }
      />

      <CreateScriptDialog
        open={
          operations.createScriptDialogOpen
        }
        busy={busy}
        error={error}
        projects={dashboard.projects}
        onClose={() =>
          operations.setCreateScriptDialogOpen(
            false,
          )
        }
        onSubmit={
          operations.submitCreateScript
        }
      />

      <ScheduleContentDialog
        open={
          operations.scheduleContentDialogOpen
        }
        busy={busy}
        error={error}
        projects={dashboard.projects}
        onClose={() =>
          operations.setScheduleContentDialogOpen(
            false,
          )
        }
        onSubmit={
          operations.submitScheduleContent
        }
      />

      <CreatePromptDialog
        open={
          operations.createPromptDialogOpen
        }
        busy={busy}
        error={error}
        onClose={() =>
          operations.setCreatePromptDialogOpen(
            false,
          )
        }
        onSubmit={
          operations.submitCreatePrompt
        }
      />
    </>
  );
}
