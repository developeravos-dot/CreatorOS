import type {
  ReactNode,
} from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  title,
  description,
  icon = "◇",
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <section
      className={[
        "cos-empty-state",
        compact
          ? "cos-empty-state--compact"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="cos-empty-state__icon">
        {icon}
      </div>

      <h3>{title}</h3>

      {description ? (
        <p>{description}</p>
      ) : null}

      {action ? (
        <div className="cos-empty-state__action">
          {action}
        </div>
      ) : null}
    </section>
  );
}
