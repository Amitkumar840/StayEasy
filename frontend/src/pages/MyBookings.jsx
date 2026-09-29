import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyBookingsRequest, cancelBookingRequest } from "../api/bookingApi.js";
import { payForBookingRequest } from "../api/paymentApi.js";

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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyBookingsRequest();
      setBookings(res.data.data);
    } catch (err) {
      setError("Something went wrong loading your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    setCancellingId(id);
    try {
      await cancelBookingRequest(id);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong cancelling the booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const handlePay = async (booking) => {
    setPayingId(booking._id);
    try {
      await payForBookingRequest(booking._id, booking.totalAmount);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong processing the payment.");
    } finally {
      setPayingId(null);
    }
  };

  const canCancel = (status) => !["cancelled", "checked-out"].includes(status);
  const canPay = (booking) =>
    booking.paymentStatus === "pending" && !["cancelled"].includes(booking.bookingStatus);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>

        {loading && <p className="text-slate-400">Loading your bookings...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No bookings found.</p>
            <Link to="/rooms" className="text-blue-400 hover:underline">
              Browse rooms
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-slate-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">
                      {booking.room?.title || "Room no longer available"}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {formatDate(booking.checkIn)} {"\u2192"} {formatDate(booking.checkOut)} {"\u00B7"} {booking.guests} guest
                      {booking.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${STATUS_COLORS[booking.bookingStatus] || "bg-slate-500/10 text-slate-400"}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-slate-300">
                    <span className="text-lg font-bold text-white">
                      {"\u20B9"}{booking.totalAmount}
                    </span>
                    <span className="text-slate-400 text-sm"> {"\u00B7"} payment {booking.paymentStatus}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {canPay(booking) && (
                      <button
                        onClick={() => handlePay(booking)}
                        disabled={payingId === booking._id}
                        className="bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-3 py-1.5 transition"
                      >
                        {payingId === booking._id ? "Processing..." : "Pay Now"}
                      </button>
                    )}

                    {canCancel(booking.bookingStatus) && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="text-red-400 hover:underline text-sm disabled:opacity-60"
                      >
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>

                {booking.specialRequests && (
                  <p className="text-slate-500 text-xs mt-2 italic">"{booking.specialRequests}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;