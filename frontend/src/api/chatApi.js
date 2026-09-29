import api from "./axios.js";

export const sendChatMessageRequest = (message) => api.post("/chat", { message });

export const getChatHistoryRequest = () => api.get("/chat/history");

export const confirmBookingRequest = (data) => api.post("/chat/confirm-booking", data);

export const confirmCancelRequest = (bookingId) => api.post("/chat/confirm-cancel", { bookingId });

export const confirmComplaintRequest = (data) => api.post("/chat/confirm-complaint", data);
