import api from "./axios.js";

export const payForBookingRequest = (bookingId, amount, method) =>
  api.post("/payments", { bookingId, amount, method: method || "mock_card" });