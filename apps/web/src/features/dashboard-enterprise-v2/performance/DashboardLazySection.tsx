import {
  Suspense,
  type ReactNode,
} from "react";

interface DashboardLazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  label: string;
}

export default function DashboardLazySection({
  children,
  fallback,
  label,
}: DashboardLazySectionProps) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div
            className="dashboard-enterprise-lazy-state"
            role="status"
          >
            Loading {label}...
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}
