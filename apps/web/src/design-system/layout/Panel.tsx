import type {
  ReactNode,
} from "react";

interface PanelProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  elevated?: boolean;
  scrollable?: boolean;
}

export default function Panel({
  children,
  title,
  description,
  actions,
  footer,
  className = "",
  elevated = false,
  scrollable = false,
}: PanelProps) {
  return (
    <section
      className={[
        "cos-panel",
        elevated
          ? "cos-panel--elevated"
          : "",
        scrollable
          ? "cos-panel--scrollable"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title ||
      description ||
      actions ? (
        <header className="cos-panel__header">
          <div>
            {title ? (
              <h2>{title}</h2>
            ) : null}

            {description ? (
              <p>{description}</p>
            ) : null}
          </div>

          {actions ? (
            <div className="cos-panel__actions">
              {actions}
            </div>
          ) : null}
        </header>
      ) : null}

      <div className="cos-panel__body">
        {children}
      </div>

      {footer ? (
        <footer className="cos-panel__footer">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
