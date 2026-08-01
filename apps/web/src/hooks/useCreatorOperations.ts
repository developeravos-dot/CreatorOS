import { useState } from "react";

import {
  enterpriseApi,
  type EnterpriseDashboard,
  type EnterpriseProject,
  type EnterpriseScript,
} from "../enterprise-api";

import type {
  CreateProjectValues,
  CreatePromptValues,
  CreateScriptValues,
  EditScriptValues,
  ScheduleContentValues,
  UpdateProjectStatusValues,
  UpdateScriptStatusValues,
} from "../dialogs";

interface UseCreatorOperationsOptions {
  dashboard: EnterpriseDashboard;
  setError: (message: string) => void;
  runAction: (
    action: () => Promise<unknown>,
    successMessage: string,
  ) => Promise<void>;
}

export function useCreatorOperations(
  options: UseCreatorOperationsOptions,
) {
  const {
    dashboard,
    setError,
    runAction,
  } = options;

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

  const createProject = async () => {
    setError("");
    setCreateProjectDialogOpen(true);
  };

  const submitCreateProject = async (
    values: CreateProjectValues,
  ) => {
    setCreateProjectDialogOpen(false);

    await runAction(
      () =>
        enterpriseApi.createProject({
          name: values.name,
          description: values.description,
          platform: values.platform,
        }),
      "تم إنشاء المشروع بنجاح.",
    );
  };

  const createScript = async () => {
    if (dashboard.projects.length === 0) {
      setError("أنشئ مشروعًا أولًا قبل إضافة السكربت.");
      return;
    }

    setError("");
    setCreateScriptDialogOpen(true);
  };

  const submitCreateScript = async (
    values: CreateScriptValues,
  ) => {
    setCreateScriptDialogOpen(false);

    await runAction(
      () =>
        enterpriseApi.createScript({
          projectId: values.projectId,
          title: values.title,
          content: values.content,
        }),
      "تم إنشاء السكربت بنجاح.",
    );
  };

  const scheduleContent = async () => {
    if (dashboard.projects.length === 0) {
      setError("أنشئ مشروعًا أولًا قبل جدولة المحتوى.");
      return;
    }

    setError("");
    setScheduleContentDialogOpen(true);
  };

  const submitScheduleContent = async (
    values: ScheduleContentValues,
  ) => {
    if (
      !values.scheduledAt ||
      Number.isNaN(Date.parse(values.scheduledAt))
    ) {
      setError("موعد النشر غير صالح.");
      return;
    }

    setScheduleContentDialogOpen(false);

    await runAction(
      () =>
        enterpriseApi.scheduleContent({
          projectId: values.projectId,
          title: values.title,
          scheduledAt: new Date(
            values.scheduledAt,
          ).toISOString(),
          platform: values.platform,
        }),
      "تمت جدولة المحتوى بنجاح.",
    );
  };

  const createPrompt = async () => {
    setError("");
    setCreatePromptDialogOpen(true);
  };

  const submitCreatePrompt = async (
    values: CreatePromptValues,
  ) => {
    setCreatePromptDialogOpen(false);

    await runAction(
      () =>
        enterpriseApi.createPrompt({
          name: values.name,
          purpose: values.purpose,
          prompt: values.prompt,
        }),
      "تم حفظ القالب الذكي بنجاح.",
    );
  };

  const changeProjectStatus = async (
    project: EnterpriseProject,
  ) => {
    setError("");
    setSelectedProjectForStatus(project);
  };

  const submitProjectStatus = async (
    values: UpdateProjectStatusValues,
  ) => {
    const project = selectedProjectForStatus;

    if (!project) {
      return;
    }

    setSelectedProjectForStatus(null);

    await runAction(
      () =>
        enterpriseApi.updateProjectStatus(
          project.id,
          values.status,
        ),
      "تم تحديث حالة المشروع.",
    );
  };

  const deleteProject = async (
    project: EnterpriseProject,
  ) => {
    setError("");
    setSelectedProjectForDelete(project);
  };

  const confirmDeleteProject = async () => {
    const project = selectedProjectForDelete;

    if (!project) {
      return;
    }

    setSelectedProjectForDelete(null);

    await runAction(
      () => enterpriseApi.deleteProject(project.id),
      "تم حذف المشروع.",
    );
  };

  const changeScriptStatus = async (
    script: EnterpriseScript,
  ) => {
    setError("");
    setSelectedScriptForStatus(script);
  };

  const submitScriptStatus = async (
    values: UpdateScriptStatusValues,
  ) => {
    const script = selectedScriptForStatus;

    if (!script) {
      return;
    }

    setSelectedScriptForStatus(null);

    await runAction(
      () =>
        enterpriseApi.updateScript(script.id, {
          status: values.status,
        }),
      "تم تحديث حالة السكربت.",
    );
  };

  const editScript = async (
    script: EnterpriseScript,
  ) => {
    setError("");
    setSelectedScriptForEdit(script);
  };

  const submitEditScript = async (
    values: EditScriptValues,
  ) => {
    const script = selectedScriptForEdit;

    if (!script) {
      return;
    }

    setSelectedScriptForEdit(null);

    await runAction(
      () =>
        enterpriseApi.updateScript(script.id, {
          title: values.title,
          content: values.content,
        }),
      "تم حفظ تعديلات السكربت.",
    );
  };

  return {
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

    createProject,
    submitCreateProject,

    createScript,
    submitCreateScript,

    scheduleContent,
    submitScheduleContent,

    createPrompt,
    submitCreatePrompt,

    changeProjectStatus,
    submitProjectStatus,

    deleteProject,
    confirmDeleteProject,

    changeScriptStatus,
    submitScriptStatus,

    editScript,
    submitEditScript,
  };
}
