import type {
  ReactNode,
} from "react";

interface WorkspaceToolbarProps {
  primary?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function WorkspaceToolbar({
  primary,
  filters,
  actions,
  className = "",
}: WorkspaceToolbarProps) {
  return (
    <section
      className={[
        "cos-workspace-toolbar",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="cos-workspace-toolbar__primary">
        {primary}
      </div>

      <div className="cos-workspace-toolbar__filters">
        {filters}
      </div>

      <div className="cos-workspace-toolbar__actions">
        {actions}
      </div>
    </section>
  );
}
