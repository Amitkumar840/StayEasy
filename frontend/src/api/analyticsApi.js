import api from "./axios.js";

export const getAdminStatsRequest = () => api.get("/analytics/admin");
