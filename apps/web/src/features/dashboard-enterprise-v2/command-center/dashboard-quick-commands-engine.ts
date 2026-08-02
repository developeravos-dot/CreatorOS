import type {
  DashboardQuickCommand,
} from "./dashboard-command-center-types";

interface DashboardQuickCommandsInput {
  busy: boolean;
  hasProjects: boolean;
}

export function buildDashboardQuickCommands({
  busy,
  hasProjects,
}: DashboardQuickCommandsInput):
  DashboardQuickCommand[] {
  return [
    {
      id: "create-project",
      label: "Create project",
      description:
        "Start a new CreatorOS production workspace.",
      icon: "+",
      tone: "success",
      disabled: busy,
    },
    {
      id: "create-script",
      label: "Create script",
      description:
        "Add a new script to the production pipeline.",
      icon: "S",
      tone: "info",
      disabled:
        busy ||
        !hasProjects,
    },
    {
      id: "schedule-content",
      label:
        "Schedule content",
      description:
        "Add content to the publishing calendar.",
      icon: "C",
      tone: "warning",
      disabled:
        busy ||
        !hasProjects,
    },
    {
      id: "create-prompt",
      label:
        "Create AI prompt",
      description:
        "Save a reusable prompt for AI workflows.",
      icon: "AI",
      tone: "info",
      disabled: busy,
    },
  ];
}
