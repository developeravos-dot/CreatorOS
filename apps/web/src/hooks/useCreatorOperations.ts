import {
  useCallback,
  useState,
} from "react";

import type {
  EnterpriseDashboard,
  EnterpriseProject,
  EnterpriseScript,
  ProjectStatus,
  ScriptStatus,
} from "../enterprise-api";

import {
  calendarApi,
} from "../api/services/calendar";

import {
  projectsApi,
} from "../api/services/projects";

import {
  promptsApi,
} from "../api/services/ai";

import {
  scriptsApi,
} from "../api/services/scripts";


import {
  invalidateProjects,
} from "../features/projects-v2/projects-query";

import {
  invalidateScripts,
} from "../features/scripts-v2/scripts-query";

import {
  invalidateCalendar,
} from "../features/calendar-v2/calendar-query";
interface UseCreatorOperationsOptions {
  dashboard: EnterpriseDashboard;
  setError: (value: string) => void;
  runAction: (
    action: () => Promise<unknown>,
    successMessage: string,
  ) => Promise<void>;
}

export function useCreatorOperations({
  dashboard,
  setError,
  runAction,
}: UseCreatorOperationsOptions) {
  const [
    createProjectDialogOpen,
    setCreateProjectDialogOpen,
  ] = useState(false);

  const [
    createScriptDialogOpen,
    setCreateScriptDialogOpen,
  ] = useState(false);

  const [
    scheduleContentDialogOpen,
    setScheduleContentDialogOpen,
  ] = useState(false);

  const [
    createPromptDialogOpen,
    setCreatePromptDialogOpen,
  ] = useState(false);

  const [
    selectedProjectForStatus,
    setSelectedProjectForStatus,
  ] = useState<EnterpriseProject | null>(null);

  const [
    selectedProjectForDelete,
    setSelectedProjectForDelete,
  ] = useState<EnterpriseProject | null>(null);

  const [
    selectedScriptForStatus,
    setSelectedScriptForStatus,
  ] = useState<EnterpriseScript | null>(null);

  const [
    selectedScriptForEdit,
    setSelectedScriptForEdit,
  ] = useState<EnterpriseScript | null>(null);

  const createProject = useCallback(
    async (): Promise<void> => {
      setError("");
      setCreateProjectDialogOpen(true);
    },
    [setError],
  );

  const createScript = useCallback(
    async (): Promise<void> => {
      setError("");

      if (dashboard.projects.length === 0) {
        setError(
          "Ã˜Â£Ã™â€ Ã˜Â´Ã˜Â¦ Ã™â€¦Ã˜Â´Ã˜Â±Ã™Ë†Ã˜Â¹Ã™â€¹Ã˜Â§ Ã˜Â£Ã™Ë†Ã™â€žÃ™â€¹Ã˜Â§ Ã™â€šÃ˜Â¨Ã™â€ž Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â³Ã™Æ’Ã˜Â±Ã˜Â¨Ã˜Âª.",
        );

        return;
      }

      setCreateScriptDialogOpen(true);
    },
    [dashboard.projects.length, setError],
  );

  const scheduleContent = useCallback(
    async (): Promise<void> => {
      setError("");

      if (dashboard.projects.length === 0) {
        setError(
          "Ã˜Â£Ã™â€ Ã˜Â´Ã˜Â¦ Ã™â€¦Ã˜Â´Ã˜Â±Ã™Ë†Ã˜Â¹Ã™â€¹Ã˜Â§ Ã˜Â£Ã™Ë†Ã™â€žÃ™â€¹Ã˜Â§ Ã™â€šÃ˜Â¨Ã™â€ž Ã˜Â¬Ã˜Â¯Ã™Ë†Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â­Ã˜ÂªÃ™Ë†Ã™â€°.",
        );

        return;
      }

      setScheduleContentDialogOpen(true);
    },
    [dashboard.projects.length, setError],
  );

  const createPrompt = useCallback(
    async (): Promise<void> => {
      setError("");
      setCreatePromptDialogOpen(true);
    },
    [setError],
  );

  const changeProjectStatus = useCallback(
    async (
      project: EnterpriseProject,
    ): Promise<void> => {
      setError("");
      setSelectedProjectForStatus(project);
    },
    [setError],
  );

  const deleteProject = useCallback(
    async (
      project: EnterpriseProject,
    ): Promise<void> => {
      setError("");
      setSelectedProjectForDelete(project);
    },
    [setError],
  );

  const changeScriptStatus = useCallback(
    async (
      script: EnterpriseScript,
    ): Promise<void> => {
      setError("");
      setSelectedScriptForStatus(script);
    },
    [setError],
  );

  const editScript = useCallback(
    async (
      script: EnterpriseScript,
    ): Promise<void> => {
      setError("");
      setSelectedScriptForEdit(script);
    },
    [setError],
  );

  const submitCreateProject = useCallback(
    async (input: {
      name: string;
      description: string;
      platform: EnterpriseProject["platform"];
    }): Promise<void> => {
      await runAction(
        () => projectsApi.create(input),
        "Ã˜ÂªÃ™â€¦ Ã˜Â¥Ã™â€ Ã˜Â´Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â±Ã™Ë†Ã˜Â¹ Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­.",
      );

      invalidateProjects();
      setCreateProjectDialogOpen(false);
    },
    [runAction],
  );

  const submitCreateScript = useCallback(
    async (input: {
      projectId: string;
      title: string;
      content: string;
    }): Promise<void> => {
      await runAction(
        () => scriptsApi.create(input),
        "Ã˜ÂªÃ™â€¦ Ã˜Â¥Ã™â€ Ã˜Â´Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â³Ã™Æ’Ã˜Â±Ã˜Â¨Ã˜Âª Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­.",
      );

      setCreateScriptDialogOpen(false);
    },
    [runAction],
  );

  const submitScheduleContent = useCallback(
    async (input: {
      projectId: string;
      title: string;
      scheduledAt: string;
      platform: EnterpriseProject["platform"];
    }): Promise<void> => {
      await runAction(
        () => calendarApi.schedule(input),
        "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¬Ã˜Â¯Ã™Ë†Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â­Ã˜ÂªÃ™Ë†Ã™â€° Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­.",
      );

      setScheduleContentDialogOpen(false);
    },
    [runAction],
  );

  const submitCreatePrompt = useCallback(
    async (input: {
      name: string;
      purpose: string;
      prompt: string;
    }): Promise<void> => {
      await runAction(
        () => promptsApi.create(input),
        "Ã˜ÂªÃ™â€¦ Ã˜Â¥Ã™â€ Ã˜Â´Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ™â€šÃ˜Â§Ã™â€žÃ˜Â¨ Ã˜Â§Ã™â€žÃ˜Â°Ã™Æ’Ã™Å  Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­.",
      );

      setCreatePromptDialogOpen(false);
    },
    [runAction],
  );

  const submitProjectStatus = useCallback(
    async (input: {
      status: ProjectStatus;
    }): Promise<void> => {
      if (!selectedProjectForStatus) {
        return;
      }

      await runAction(
        () =>
          projectsApi.updateStatus(
            selectedProjectForStatus.id,
            input.status,
          ),
        "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â­Ã˜Â¯Ã™Å Ã˜Â« Ã˜Â­Ã˜Â§Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â±Ã™Ë†Ã˜Â¹.",
      );

      invalidateProjects();
      setSelectedProjectForStatus(null);
    },
    [runAction, selectedProjectForStatus],
  );

  const confirmDeleteProject = useCallback(
    async (): Promise<void> => {
      if (!selectedProjectForDelete) {
        return;
      }

      await runAction(
        () =>
          projectsApi.delete(
            selectedProjectForDelete.id,
          ),
        "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â±Ã™Ë†Ã˜Â¹.",
      );

      invalidateProjects();
      setSelectedProjectForDelete(null);
    },
    [runAction, selectedProjectForDelete],
  );

  const submitScriptStatus = useCallback(
    async (input: {
      status: ScriptStatus;
    }): Promise<void> => {
      if (!selectedScriptForStatus) {
        return;
      }

      await runAction(
        () =>
          scriptsApi.update(
            selectedScriptForStatus.id,
            {
              status: input.status,
            },
          ),
        "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â­Ã˜Â¯Ã™Å Ã˜Â« Ã™â€¦Ã˜Â±Ã˜Â­Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â³Ã™Æ’Ã˜Â±Ã˜Â¨Ã˜Âª.",
      );

      setSelectedScriptForStatus(null);
    },
    [runAction, selectedScriptForStatus],
  );

  const submitEditScript = useCallback(
    async (input: {
      title: string;
      content: string;
    }): Promise<void> => {
      if (!selectedScriptForEdit) {
        return;
      }

      await runAction(
        () =>
          scriptsApi.update(
            selectedScriptForEdit.id,
            input,
          ),
        "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã™ÂÃ˜Â¸ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€žÃ˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â³Ã™Æ’Ã˜Â±Ã˜Â¨Ã˜Âª.",
      );

      setSelectedScriptForEdit(null);
    },
    [runAction, selectedScriptForEdit],
  );

  return {
    createProject,
    createScript,
    scheduleContent,
    createPrompt,
    changeProjectStatus,
    deleteProject,
    changeScriptStatus,
    editScript,

    createProjectDialogOpen,
    setCreateProjectDialogOpen,

    createScriptDialogOpen,
    setCreateScriptDialogOpen,

    scheduleContentDialogOpen,
    setScheduleContentDialogOpen,

    createPromptDialogOpen,
    setCreatePromptDialogOpen,

    selectedProjectForStatus,
    setSelectedProjectForStatus,

    selectedProjectForDelete,
    setSelectedProjectForDelete,

    selectedScriptForStatus,
    setSelectedScriptForStatus,

    selectedScriptForEdit,
    setSelectedScriptForEdit,

    submitCreateProject,
    submitCreateScript,
    submitScheduleContent,
    submitCreatePrompt,
    submitProjectStatus,
    confirmDeleteProject,
    submitScriptStatus,
    submitEditScript,

    /*
     * Compatibility aliases for newer internal naming.
     * Existing UI continues using the original contract.
     */
    createProjectOpen:
      createProjectDialogOpen,

    createScriptOpen:
      createScriptDialogOpen,

    scheduleContentOpen:
      scheduleContentDialogOpen,

    createPromptOpen:
      createPromptDialogOpen,

    selectedProject:
      selectedProjectForStatus ??
      selectedProjectForDelete,

    selectedScript:
      selectedScriptForStatus ??
      selectedScriptForEdit,

    updateProjectStatusOpen:
      selectedProjectForStatus !== null,

    deleteProjectOpen:
      selectedProjectForDelete !== null,

    updateScriptStatusOpen:
      selectedScriptForStatus !== null,

    editScriptOpen:
      selectedScriptForEdit !== null,

    closeCreateProject: () =>
      setCreateProjectDialogOpen(false),

    closeCreateScript: () =>
      setCreateScriptDialogOpen(false),

    closeScheduleContent: () =>
      setScheduleContentDialogOpen(false),

    closeCreatePrompt: () =>
      setCreatePromptDialogOpen(false),

    closeProjectStatus: () =>
      setSelectedProjectForStatus(null),

    closeDeleteProject: () =>
      setSelectedProjectForDelete(null),

    closeScriptStatus: () =>
      setSelectedScriptForStatus(null),

    closeEditScript: () =>
      setSelectedScriptForEdit(null),
  };
}
