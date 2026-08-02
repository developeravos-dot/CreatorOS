import Skeleton from "./Skeleton";

interface LoadingPanelProps {
  title?: string;
  rows?: number;
}

export default function LoadingPanel({
  title = "Loading...",
  rows = 4,
}: LoadingPanelProps) {
  return (
    <section
      className="cos-loading-panel"
      aria-busy="true"
      aria-live="polite"
    >
      <header>
        <Skeleton
          width={180}
          height={18}
        />

        <span>{title}</span>
      </header>

      <div>
        {Array.from({
          length: rows,
        }).map(
          (_, index) => (
            <Skeleton
              key={index}
              height={54}
              radius="var(--cos-radius-md)"
            />
          ),
        )}
      </div>
    </section>
  );
}
