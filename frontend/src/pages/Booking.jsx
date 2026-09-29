import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoomByIdRequest } from "../api/roomApi.js";
import { createBookingRequest } from "../api/bookingApi.js";

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await getRoomByIdRequest(roomId);
        setRoom(res.data.data);
      } catch (err) {
        setLoadError("Room not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const nights =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
      : 0;

  const estimatedTotal = room ? nights * room.pricePerNight : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const res = await createBookingRequest({
        roomId,
        checkIn,
        checkOut,
        guests: Number(guests),
        specialRequests,
      });
      navigate("/my-bookings", { state: { justBooked: res.data.data._id } });
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (loadError || !room) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{loadError || "Room not found."}</p>
          <Link to="/rooms" className="text-blue-400 hover:underline">
            Back to rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-lg mx-auto">
        <Link to={`/rooms/${roomId}`} className="text-blue-400 hover:underline text-sm mb-4 inline-block">
          Back to room
        </Link>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white mb-1">{room.title}</h1>
          <p className="text-slate-400 text-sm mb-6">
            {room.roomType} {"\u00B7"} {"\u20B9"}
            {room.pricePerNight}/night {"\u00B7"} up to {room.capacity} guests
          </p>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Guests</label>
              <input
                type="number"
                min="1"
                max={room.capacity}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Special requests (optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {nights > 0 && (
              <div className="bg-slate-700/50 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-slate-300 text-sm">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
                <span className="text-white font-bold text-lg">
                  {"\u20B9"}{estimatedTotal}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || nights === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 transition"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
