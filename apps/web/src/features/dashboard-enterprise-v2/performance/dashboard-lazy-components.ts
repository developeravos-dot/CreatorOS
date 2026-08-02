import {
  lazy,
} from "react";

export const LazyDashboardIntelligenceOverview =
  lazy(
    async () => {
      const module =
        await import(
          "../charts/DashboardIntelligenceOverview"
        );

      return {
        default:
          module.default,
      };
    },
  );

export const LazyDashboardCommandCenterOverview =
  lazy(
    async () => {
      const module =
        await import(
          "../command-center/DashboardCommandCenterOverview"
        );

      return {
        default:
          module.default,
      };
    },
  );

export const LazyDashboardPersonalizationDrawer =
  lazy(
    async () => {
      const module =
        await import(
          "../personalization/DashboardPersonalizationDrawer"
        );

      return {
        default:
          module.default,
      };
    },
  );
