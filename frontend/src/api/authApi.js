import api from "./axios.js";

export const registerRequest = (data) => api.post("/auth/register", data);

export const verifyEmailRequest = (data) => api.post("/auth/verify-email", data);

export const resendVerificationRequest = (email) => api.post("/auth/resend-verification", { email });

export const loginRequest = (data) => api.post("/auth/login", data);

export const logoutRequest = () => api.post("/auth/logout");

export const getMeRequest = () => api.get("/auth/me");