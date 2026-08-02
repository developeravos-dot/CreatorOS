import type {
  ReactNode,
} from "react";

interface WorkspaceHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  metadata?: ReactNode;
}

export default function WorkspaceHeader({
  eyebrow,
  title,
  description,
  actions,
  metadata,
}: WorkspaceHeaderProps) {
  return (
    <header className="cos-workspace-header">
      <section>
        {eyebrow ? (
          <span className="cos-workspace-header__eyebrow">
            {eyebrow}
          </span>
        ) : null}

        <h1>{title}</h1>

        {description ? (
          <p>{description}</p>
        ) : null}

        {metadata ? (
          <div className="cos-workspace-header__metadata">
            {metadata}
          </div>
        ) : null}
      </section>

      {actions ? (
        <div className="cos-workspace-header__actions">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
