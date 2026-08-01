import { apiClient } from "../core/client";

export const dashboardApi={

    getDashboard(){

        return apiClient.get("/enterprise/dashboard");

    },

    getHealth(){

        return apiClient.get("/enterprise/health");

    },

};
