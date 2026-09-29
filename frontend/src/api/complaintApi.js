import api from "./axios.js";

export const createComplaintRequest = (data) => api.post("/complaints", data);

export const getMyComplaintsRequest = () => api.get("/complaints/my");

export const getAllComplaintsRequest = (filters = {}) => api.get("/complaints", { params: filters });

export const updateComplaintRequest = (id, status) => api.put(`/complaints/${id}`, { status });
