import api from "./axios.js";

export const updateProfileRequest = (data) => api.put("/auth/me", data);

export const changePasswordRequest = (data) => api.put("/auth/change-password", data);
