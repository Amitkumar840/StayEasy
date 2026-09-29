import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isSameDay = (dateStr, reference) => {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
};

const ROOM_STATUS_COLORS = {
  available: "bg-green-500/10 text-green-400",
  occupied: "bg-red-500/10 text-red-400",
  maintenance: "bg-yellow-500/10 text-yellow-400",
};

const StaffDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [bookingsRes, complaintsRes, roomsRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/complaints", { params: { status: "pending" } }),
          api.get("/rooms"),
        ]);
        setBookings(bookingsRes.data.data);
        setComplaints(complaintsRes.data.data);
        setRooms(roomsRes.data.data);
      } catch (err) {
        setError("Something went wrong loading the staff dashboard.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const today = new Date();

  const todayCheckIns = bookings.filter(
    (b) => isSameDay(b.checkIn, today) && ["pending", "confirmed"].includes(b.bookingStatus)
  );
  const todayCheckOuts = bookings.filter(
    (b) => isSameDay(b.checkOut, today) && b.bookingStatus === "checked-in"
  );
  const activeBookings = bookings.filter((b) => b.bookingStatus === "checked-in");

  const StatCard = ({ label, value }) => (
    <div className="bg-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Staff Dashboard</h1>
          <Link
            to="/admin/complaints"
            className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            View all complaints
          </Link>
        </div>

        {loading && <p className="text-slate-400">Loading...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <StatCard label="Today's check-ins" value={todayCheckIns.length} />
              <StatCard label="Today's check-outs" value={todayCheckOuts.length} />
              <StatCard label="Active stays" value={activeBookings.length} />
            </div>

            <h2 className="text-lg font-semibold text-white mb-3">Today's check-ins</h2>
            {todayCheckIns.length === 0 ? (
              <p className="text-slate-400 mb-8">No check-ins scheduled for today.</p>
            ) : (
              <div className="space-y-2 mb-8">
                {todayCheckIns.map((b) => (
                  <div key={b._id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{b.user?.name}</p>
                      <p className="text-slate-400 text-sm">{b.room?.title}</p>
                    </div>
                    <span className="text-slate-400 text-sm">{formatDate(b.checkIn)}</span>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-lg font-semibold text-white mb-3">Room Status</h2>
            {rooms.length === 0 ? (
              <p className="text-slate-400 mb-8">No rooms found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {rooms.map((r) => (
                  <div key={r._id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {r.roomNumber} {"\u00B7"} {r.title}
                      </p>
                      <p className="text-slate-400 text-xs">{r.roomType}</p>
                    </div>
                    <span
                      className={`text-xs rounded-full px-2 py-1 ${ROOM_STATUS_COLORS[r.status] || "bg-slate-500/10 text-slate-400"}`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-lg font-semibold text-white mb-3">Pending complaints</h2>
            {complaints.length === 0 ? (
              <p className="text-slate-400">No pending complaints.</p>
            ) : (
              <div className="space-y-2">
                {complaints.map((c) => (
                  <div key={c._id} className="bg-slate-800 rounded-xl p-4">
                    <p className="text-white font-medium">{c.subject}</p>
                    <p className="text-slate-400 text-sm">
                      {c.user?.name} {"\u00B7"} {c.category} {"\u00B7"} {c.priority} priority
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;