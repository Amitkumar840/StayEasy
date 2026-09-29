import api from "./axios.js";

export const getUsersRequest = () => api.get("/users");

export const updateUserRequest = (id, data) => api.put(`/users/${id}`, data);

export const deactivateUserRequest = (id) => api.delete(`/users/${id}`);