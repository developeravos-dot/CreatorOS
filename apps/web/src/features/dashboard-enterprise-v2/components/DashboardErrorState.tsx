interface DashboardErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function DashboardErrorState({
  message,
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <section
      className="dashboard-enterprise-state dashboard-enterprise-state--error"
      role="alert"
    >
      <div>
        <span aria-hidden="true">
          !
        </span>

        <div>
          <h2>
            Dashboard unavailable
          </h2>

          <p>
            {message}
          </p>
        </div>
      </div>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      ) : null}
    </section>
  );
}
