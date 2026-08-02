export type DashboardPeriod =
  | "7d"
  | "30d"
  | "90d"
  | "1y";

export interface DashboardPeriodOption {
  value: DashboardPeriod;
  label: string;
  days: number;
}

export const dashboardPeriodOptions:
  DashboardPeriodOption[] = [
  {
    value: "7d",
    label: "7 days",
    days: 7,
  },
  {
    value: "30d",
    label: "30 days",
    days: 30,
  },
  {
    value: "90d",
    label: "90 days",
    days: 90,
  },
  {
    value: "1y",
    label: "1 year",
    days: 365,
  },
];

export function getDashboardPeriodDays(
  period: DashboardPeriod,
): number {
  return (
    dashboardPeriodOptions.find(
      (option) =>
        option.value === period,
    )?.days ?? 30
  );
}
