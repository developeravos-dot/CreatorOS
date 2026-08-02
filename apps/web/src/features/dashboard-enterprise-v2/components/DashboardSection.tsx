import type {
  ReactNode,
} from "react";

interface DashboardSectionProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardSection({
  title,
  description,
  actions,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section
      className={[
        "dashboard-enterprise-section",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="dashboard-enterprise-section__header">
        <div>
          <h2>{title}</h2>

          {description ? (
            <p>
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="dashboard-enterprise-section__actions">
            {actions}
          </div>
        ) : null}
      </header>

      <div className="dashboard-enterprise-section__body">
        {children}
      </div>
    </section>
  );
}
