import { enterpriseClient } from "../core/client";
import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

export const dashboardApi = {
  getDashboard() {
    return enterpriseClient.get<EnterpriseDashboard>(
      "/dashboard",
    );
  },

  getHealth() {
    return enterpriseClient.get<{
      success: boolean;
      status: string;
    }>("/health");
  },
};
