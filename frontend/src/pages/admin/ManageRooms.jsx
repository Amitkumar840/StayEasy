import { useState, useEffect } from "react";
import {
  getRoomsRequest,
  createRoomRequest,
  updateRoomRequest,
  deleteRoomRequest,
  uploadRoomImageRequest,
  deleteRoomImageRequest,
} from "../../api/roomApi.js";

const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite", "Family"];

const emptyForm = {
  roomNumber: "",
  title: "",
  description: "",
  roomType: "Single",
  pricePerNight: "",
  capacity: "",
  amenities: "",
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [uploadingId, setUploadingId] = useState(null);

  const loadRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRoomsRequest();
      setRooms(res.data.data);
    } catch (err) {
      setError("Something went wrong loading rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const startEdit = (room) => {
    setFormData({
      roomNumber: room.roomNumber,
      title: room.title,
      description: room.description,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      amenities: (room.amenities || []).join(", "),
    });
    setEditingId(room._id);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      roomNumber: formData.roomNumber,
      title: formData.title,
      description: formData.description,
      roomType: formData.roomType,
      pricePerNight: Number(formData.pricePerNight),
      capacity: Number(formData.capacity),
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateRoomRequest(editingId, payload);
      } else {
        await createRoomRequest(payload);
      }
      resetForm();
      loadRooms();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    try {
      await deleteRoomRequest(id);
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong deleting the room.");
    }
  };

  const handleImageUpload = async (roomId, file) => {
    if (!file) return;
    setUploadingId(roomId);
    try {
      await uploadRoomImageRequest(roomId, file);
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong uploading the image.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleImageDelete = async (roomId, publicId) => {
    if (!confirm("Remove this image?")) return;
    try {
      await deleteRoomImageRequest(roomId, publicId);
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong removing the image.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Rooms</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <h2 className="sm:col-span-2 text-lg font-semibold text-white">
            {editingId ? "Edit room" : "Add a new room"}
          </h2>

          {formError && (
            <div className="sm:col-span-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {formError}
            </div>
          )}

          <input
            type="text"
            placeholder="Room number"
            value={formData.roomNumber}
            onChange={(e) => handleFieldChange("roomNumber", e.target.value)}
            required
            className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            required
            className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            required
            rows={2}
            className="sm:col-span-2 bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={formData.roomType}
            onChange={(e) => handleFieldChange("roomType", e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            placeholder={"Price per night (\u20B9)"}
            value={formData.pricePerNight}
            onChange={(e) => handleFieldChange("pricePerNight", e.target.value)}
            required
            className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            min="1"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => handleFieldChange("capacity", e.target.value)}
            required
            className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Amenities (comma separated)"
            value={formData.amenities}
            onChange={(e) => handleFieldChange("amenities", e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg px-5 py-2 transition"
            >
              {saving ? "Saving..." : editingId ? "Update room" : "Create room"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-white text-sm underline"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        {loading && <p className="text-slate-400">Loading rooms...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room._id} className="bg-slate-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">
                      {room.roomNumber} - {room.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {room.roomType} {"\u00B7"} {"\u20B9"}
                      {room.pricePerNight}/night {"\u00B7"} {room.capacity} guests
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(room)}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  {room.images.map((img) => (
                    <div key={img.publicId} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleImageDelete(room._id, img.publicId)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {"\u00D7"}
                      </button>
                    </div>
                  ))}

                  <label className="text-sm text-blue-400 hover:underline cursor-pointer">
                    {uploadingId === room._id ? "Uploading..." : "+ Add image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingId === room._id}
                      onChange={(e) => handleImageUpload(room._id, e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
