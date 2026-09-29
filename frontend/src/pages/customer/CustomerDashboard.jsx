import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getMyBookingsRequest } from "../../api/bookingApi.js";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMyBookingsRequest();
        setBookings(res.data.data);
      } catch (err) {
        setError("Something went wrong loading your bookings.");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const now = new Date();

  const upcoming = bookings.filter(
    (b) => ["pending", "confirmed"].includes(b.bookingStatus) && new Date(b.checkIn) >= now
  );
  const completed = bookings.filter((b) => b.bookingStatus === "checked-out");
  const cancelled = bookings.filter((b) => b.bookingStatus === "cancelled");
  const current = bookings.find((b) => b.bookingStatus === "checked-in");

  const StatCard = ({ label, value }) => (
    <div className="bg-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome, {user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            Log out
          </button>
        </div>

        {loading && <p className="text-slate-400">Loading your dashboard...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total bookings" value={bookings.length} />
              <StatCard label="Upcoming" value={upcoming.length} />
              <StatCard label="Completed" value={completed.length} />
              <StatCard label="Cancelled" value={cancelled.length} />
            </div>

            {current && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 mb-8">
                <p className="text-blue-400 text-sm font-medium mb-1">Currently checked in</p>
                <h3 className="text-white font-semibold">{current.room?.title}</h3>
                <p className="text-slate-400 text-sm">
                  {formatDate(current.checkIn)} {"\u2192"} {formatDate(current.checkOut)}
                </p>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <Link
                to="/rooms"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-5 py-2.5 transition"
              >
                Search rooms
              </Link>
              <Link
                to="/my-bookings"
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-5 py-2.5 transition"
              >
                View all bookings
              </Link>
            </div>

            {upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Upcoming stays</h2>
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((b) => (
                    <div key={b._id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{b.room?.title}</p>
                        <p className="text-slate-400 text-sm">
                          {formatDate(b.checkIn)} {"\u2192"} {formatDate(b.checkOut)}
                        </p>
                      </div>
                      <span className="text-slate-300 text-sm">
                        {"\u20B9"}{b.totalAmount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
