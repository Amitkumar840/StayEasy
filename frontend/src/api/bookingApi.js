import api from "./axios.js";

export const createBookingRequest = (bookingData) => api.post("/bookings", bookingData);

export const getMyBookingsRequest = () => api.get("/bookings/my");

export const getBookingByIdRequest = (id) => api.get(`/bookings/${id}`);

export const cancelBookingRequest = (id) => api.post(`/bookings/${id}/cancel`);

export const getAllBookingsRequest = (filters = {}) => api.get("/bookings", { params: filters });

export const updateBookingStatusRequest = (id, bookingStatus) =>
  api.put(`/bookings/${id}/status`, { bookingStatus });