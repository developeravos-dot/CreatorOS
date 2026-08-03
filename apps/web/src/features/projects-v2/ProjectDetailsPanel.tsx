import type {
  ComponentProps,
} from "react";

import ProjectActivityTimeline from "./ProjectActivityTimeline";
import ProjectAssetsWorkspace from "./ProjectAssetsWorkspace";
import ProjectDetailsPanelBase from "./ProjectDetailsPanelBase";

type ProjectDetailsPanelProps =
  ComponentProps<
    typeof ProjectDetailsPanelBase
  >;

export default function ProjectDetailsPanel(
  props: ProjectDetailsPanelProps,
) {
  if (!props.project) {
    return (
      <ProjectDetailsPanelBase
        {...props}
      />
    );
  }

  return (
    <div className="projects-v2-details-workspace">
      <ProjectDetailsPanelBase
        {...props}
      />

      <ProjectActivityTimeline
        project={props.project}
      />

      <ProjectAssetsWorkspace
        project={props.project}
      />
    </div>
  );
}
