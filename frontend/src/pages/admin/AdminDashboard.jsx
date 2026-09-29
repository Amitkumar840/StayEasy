import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAdminStatsRequest } from "../../api/analyticsApi.js";

const StatCard = ({ label, value }) => (
  <div className="bg-slate-800 rounded-2xl p-5">
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];
const BAR_COLOR = "#3b82f6";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAdminStatsRequest();
        setStats(res.data.data);
      } catch (err) {
        setError("Something went wrong loading dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const occupancyData = stats
    ? [
        { name: "Available", value: stats.rooms.available },
        { name: "Occupied", value: stats.rooms.occupied },
        { name: "Maintenance", value: stats.rooms.maintenance },
      ].filter((d) => d.value > 0)
    : [];

  const bookingStatusData = stats
    ? [
        { name: "Pending", count: stats.bookings.pending },
        { name: "Confirmed", count: stats.bookings.confirmed },
        { name: "Cancelled", count: stats.bookings.cancelled },
      ]
    : [];

  const roomTypeData = stats
    ? (stats.roomTypePopularity || []).map((r) => ({ name: r._id, count: r.count }))
    : [];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link
              to="/admin/rooms"
              className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
            >
              Manage Rooms
            </Link>
          </div>
        </div>

        {loading && <p className="text-slate-400">Loading stats...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && stats && (
          <>
            <h2 className="text-lg font-semibold text-white mb-3">Rooms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total rooms" value={stats.rooms.total} />
              <StatCard label="Available" value={stats.rooms.available} />
              <StatCard label="Occupied" value={stats.rooms.occupied} />
              <StatCard label="Maintenance" value={stats.rooms.maintenance} />
            </div>

            <h2 className="text-lg font-semibold text-white mb-3">Bookings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total bookings" value={stats.bookings.total} />
              <StatCard label="Pending" value={stats.bookings.pending} />
              <StatCard label="Confirmed" value={stats.bookings.confirmed} />
              <StatCard label="Cancelled" value={stats.bookings.cancelled} />
            </div>

            <h2 className="text-lg font-semibold text-white mb-3">Users & Revenue</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              <StatCard label="Customers" value={stats.users.customers} />
              <StatCard label="Staff" value={stats.users.staff} />
              <StatCard label="Revenue" value={`${"\u20B9"}${stats.revenue}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Room Occupancy</h3>
                {occupancyData.length === 0 ? (
                  <p className="text-slate-400 text-sm">No room data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={occupancyData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {occupancyData.map((entry, index) => (
                          <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Booking Status</h3>
                {bookingStatusData.every((d) => d.count === 0) ? (
                  <p className="text-slate-400 text-sm">No bookings yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={bookingStatusData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }} />
                      <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Room Type Popularity</h3>
                {roomTypeData.length === 0 ? (
                  <p className="text-slate-400 text-sm">No bookings yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={roomTypeData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;