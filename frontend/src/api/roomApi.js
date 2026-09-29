import api from "./axios.js";

export const getRoomsRequest = (filters = {}) => api.get("/rooms", { params: filters });

export const getAvailableRoomsRequest = (filters = {}) => api.get("/rooms/available", { params: filters });

export const getRoomByIdRequest = (id) => api.get(`/rooms/${id}`);

export const createRoomRequest = (roomData) => api.post("/rooms", roomData);

export const updateRoomRequest = (id, roomData) => api.put(`/rooms/${id}`, roomData);

export const deleteRoomRequest = (id) => api.delete(`/rooms/${id}`);

export const uploadRoomImageRequest = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post(`/rooms/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteRoomImageRequest = (id, publicId) =>
  api.delete(`/rooms/${id}/images`, { params: { publicId } });