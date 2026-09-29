import { useState, useEffect } from "react";
import { getAllBookingsRequest, updateBookingStatusRequest } from "../../api/bookingApi.js";

const STATUSES = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  "checked-in": "bg-green-500/10 text-green-400",
  "checked-out": "bg-slate-500/10 text-slate-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllBookingsRequest(statusFilter ? { bookingStatus: statusFilter } : {});
      setBookings(res.data.data);
    } catch (err) {
      setError("Something went wrong loading bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateBookingStatusRequest(id, newStatus);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong updating the booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Bookings</h1>

        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-slate-400">Loading bookings...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <p className="text-slate-400">No bookings found.</p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-white font-medium">
                      {b.room?.title || "Room no longer available"}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {b.user?.name} {"\u00B7"} {b.user?.email}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {formatDate(b.checkIn)} {"\u2192"} {formatDate(b.checkOut)} {"\u00B7"} {b.guests} guest
                      {b.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${STATUS_COLORS[b.bookingStatus] || "bg-slate-500/10 text-slate-400"}`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-white font-semibold">
                    {"\u20B9"}{b.totalAmount}
                    <span className="text-slate-400 text-sm font-normal"> {"\u00B7"} payment {b.paymentStatus}</span>
                  </span>

                  <select
                    value={b.bookingStatus}
                    disabled={updatingId === b._id}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="bg-slate-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;